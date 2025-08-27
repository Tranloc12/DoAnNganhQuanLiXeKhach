///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.controllers;
//
//import com.nhom12.pojo.GymPackage;
//import com.nhom12.pojo.Subscription;
//import com.nhom12.pojo.User;
//import com.nhom12.services.GymPackageService;
//import com.nhom12.services.SubscriptionService;
//import com.nhom12.services.UserService;
//import java.security.Principal;
//import java.text.ParseException;
//import java.text.SimpleDateFormat;
//import java.util.Calendar;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
///**
// *
// * @author HP
// */
//@RestController
//@RequestMapping("/api/secure/subscription")
//@CrossOrigin(origins = "*")
//public class ApiSubscriptionController {
//    @Autowired
//    private SubscriptionService subService;
//
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private GymPackageService gymPackageService;
//
//    @PostMapping(path = "/create/", consumes = {
//            MediaType.APPLICATION_JSON_VALUE,
//            MediaType.MULTIPART_FORM_DATA_VALUE
//    })
//    @CrossOrigin
//    @Transactional
//    public ResponseEntity<?> createSubscription(
//            @RequestParam Map<String, String> params, Principal p) throws ParseException {
//
//        try {
//            System.out.println("=== DEBUG: Creating subscription ===");
//            System.out.println("Received parameters: " + params);
//
//            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//            int packageId = Integer.parseInt(params.get("packageId"));
//            System.out.println("Package ID: " + packageId);
//
//            Date startDate = sdf.parse(params.get("startDate"));
//            System.out.println("Start Date: " + startDate);
//
//            GymPackage gymPackage = gymPackageService.getGymPackageById(packageId);
//            if (gymPackage == null) {
//                System.out.println("ERROR: Gym package not found with ID: " + packageId);
//                return new ResponseEntity<>("Không tìm thấy gói tập", HttpStatus.NOT_FOUND);
//            }
//            System.out.println("Gym Package: " + gymPackage.getNamePack() + ", Choice: " + gymPackage.getChoice());
//
//            User member = userService.getUserByUsername(p.getName());
//            if (member == null) {
//                System.out.println("ERROR: Member not found with username: " + p.getName());
//                return new ResponseEntity<>("Không tìm thấy thông tin thành viên", HttpStatus.NOT_FOUND);
//            }
//            System.out.println("Member: " + member.getUsername());
//
//            // Trainer is now required
//            if (!params.containsKey("trainerId") || params.get("trainerId").isEmpty()) {
//                System.out.println("ERROR: Trainer ID is missing or empty");
//                return new ResponseEntity<>("Vui lòng chọn huấn luyện viên", HttpStatus.BAD_REQUEST);
//            }
//
//            User trainer = userService.getUserById(Integer.valueOf(params.get("trainerId")));
//            if (trainer == null) {
//                System.out.println("ERROR: Trainer not found with ID: " + params.get("trainerId"));
//                return new ResponseEntity<>("Huấn luyện viên không tồn tại", HttpStatus.BAD_REQUEST);
//            }
//            System.out.println("Trainer: " + trainer.getUsername());
//
//            int numOfMonth = extractMonthsFromChoice(gymPackage.getChoice());
//            System.out.println("Extracted months: " + numOfMonth);
//
//            Calendar calendar = Calendar.getInstance();
//            calendar.setTime(startDate);
//            calendar.add(Calendar.MONTH, numOfMonth);
//            Date endDate = calendar.getTime();
//
//            // Tạo subscription với trạng thái chờ thanh toán
//            Subscription sub = new Subscription();
//            sub.setStartDate(startDate);
//            sub.setEndDate(endDate);
//            sub.setIsActive(false); // Chưa kích hoạt cho đến khi thanh toán thành công
//            sub.setPaymentStatus("PENDING");
//            sub.setRemainingSessions(gymPackage.getDayswpt());
//            sub.setPackageId(gymPackage);
//            sub.setMemberId(member);
//            sub.setTrainerId(trainer);
//            Subscription createdSub = subService.addSubscription(sub);
//
//            // Trả về subscription ID để frontend có thể tạo payment URL
//            Map<String, Object> response = new HashMap<>();
//            response.put("subscriptionId", createdSub.getId());
//            response.put("message", "Subscription created. Please proceed to payment.");
//            return new ResponseEntity<Map<String, Object>>(response, HttpStatus.CREATED);
//
//        } catch (NumberFormatException e) {
//            System.err.println("NumberFormatException: " + e.getMessage());
//            return new ResponseEntity<>("Tham số không hợp lệ", HttpStatus.BAD_REQUEST);
//        } catch (NullPointerException e) {
//            System.err.println("NullPointerException: " + e.getMessage());
//            return new ResponseEntity<>("Không tìm thấy thông tin gói tập hoặc người dùng", HttpStatus.NOT_FOUND);
//        } catch (Exception e) {
//            System.err.println("Exception: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // lấy danh sách subscription theo member id
//    @GetMapping("/my")
//    public ResponseEntity<List<Subscription>> getSubscriptionsByMemberId(Principal p) {
//        try {
//            User member = userService.getUserByUsername(p.getName());
//            System.out.println("=== DEBUG: Getting subscriptions for user ===");
//            System.out.println("Username: " + p.getName());
//            System.out.println("User ID: " + member.getId());
//            System.out.println("User Role: " + member.getUserRole());
//
//            List<Subscription> subscriptions = subService.getSubscriptionsByMemberId(member.getId());
//            System.out.println("Found " + subscriptions.size() + " subscriptions");
//
//            for (Subscription sub : subscriptions) {
//                System.out.println("Subscription ID: " + sub.getId() +
//                        ", Active: " + sub.getIsActive() +
//                        ", Payment Status: " + sub.getPaymentStatus() +
//                        ", Package: " + sub.getPackageId().getNamePack());
//            }
//
//            return new ResponseEntity<>(subscriptions, HttpStatus.OK);
//        } catch (Exception e) {
//            System.out.println("ERROR in getSubscriptionsByMemberId: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // lấy danh sách subscription theo trainer id
//    @GetMapping("/trainer")
//    public ResponseEntity<List<Subscription>> getSubscriptionsByTrainerId(Principal p) {
//        User trainer = userService.getUserByUsername(p.getName());
//        if (!trainer.getUserRole().equals("ROLE_TRAINER")) {
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
//        }
//        return new ResponseEntity<>(subService.getSubscriptionsByTrainer(trainer), HttpStatus.OK);
//    }
//
//    // Debug endpoint to see all subscriptions
//    @GetMapping("/debug/all")
//    public ResponseEntity<List<Subscription>> getAllSubscriptionsDebug() {
//        try {
//            List<Subscription> allSubs = subService.getAll();
//            System.out.println("=== DEBUG: All Subscriptions ===");
//            System.out.println("Total subscriptions: " + allSubs.size());
//
//            for (Subscription sub : allSubs) {
//                System.out.println("ID: " + sub.getId() +
//                        ", Member: " + sub.getMemberId().getUsername() +
//                        ", Active: " + sub.getIsActive() +
//                        ", Payment Status: " + sub.getPaymentStatus() +
//                        ", Package: " + sub.getPackageId().getNamePack());
//            }
//
//            return new ResponseEntity<>(allSubs, HttpStatus.OK);
//        } catch (Exception e) {
//            System.out.println("ERROR in getAllSubscriptionsDebug: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // Debug endpoint to see subscriptions for a specific user (by username)
//    @GetMapping("/debug/user/{username}")
//    public ResponseEntity<Map<String, Object>> getSubscriptionsByUsername(
//            @PathVariable(name = "username") String username) {
//        try {
//            User user = userService.getUserByUsername(username);
//            if (user == null) {
//                Map<String, Object> response = new HashMap<>();
//                response.put("error", "User not found: " + username);
//                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
//            }
//
//            List<Subscription> subscriptions = subService.getSubscriptionsByMemberId(user.getId());
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("user", Map.of(
//                    "id", user.getId(),
//                    "username", user.getUsername(),
//                    "role", user.getUserRole()));
//            response.put("subscriptions", subscriptions);
//            response.put("count", subscriptions.size());
//
//            System.out.println("=== DEBUG: Subscriptions for user " + username + " ===");
//            System.out.println("User ID: " + user.getId());
//            System.out.println("Found " + subscriptions.size() + " subscriptions");
//
//            for (Subscription sub : subscriptions) {
//                System.out.println("Subscription ID: " + sub.getId() +
//                        ", Active: " + sub.getIsActive() +
//                        ", Payment Status: " + sub.getPaymentStatus() +
//                        ", Package: " + sub.getPackageId().getNamePack());
//            }
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        } catch (Exception e) {
//            System.out.println("ERROR in getSubscriptionsByUsername: " + e.getMessage());
//            e.printStackTrace();
//            Map<String, Object> response = new HashMap<>();
//            response.put("error", "Error retrieving subscriptions: " + e.getMessage());
//            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // lấy subscription theo id
//    @GetMapping("/{id}")
//    public ResponseEntity<Subscription> getSubscriptionById(@PathVariable(name = "id") int id) {
//        return new ResponseEntity<>(subService.getSubscriptionsById(id), HttpStatus.OK);
//    }
//
//    /**
//     * Extract number of months from choice string
//     * Supports both old format (e.g., "3") and new format (e.g., "3-month",
//     * "1-year")
//     */
//    private int extractMonthsFromChoice(String choice) {
//        System.out.println("DEBUG: extractMonthsFromChoice called with: '" + choice + "'");
//
//        if (choice == null || choice.trim().isEmpty()) {
//            System.out.println("ERROR: Choice is null or empty");
//            throw new IllegalArgumentException("Choice cannot be null or empty");
//        }
//
//        // Handle new format (e.g., "3-month", "1-year")
//        if (choice.contains("-")) {
//            System.out.println("DEBUG: Processing new format choice");
//            String[] parts = choice.split("-");
//            if (parts.length != 2) {
//                System.out.println("ERROR: Invalid choice format, parts length: " + parts.length);
//                throw new IllegalArgumentException("Invalid choice format: " + choice);
//            }
//
//            try {
//                int duration = Integer.parseInt(parts[0]);
//                String unit = parts[1].toLowerCase();
//                System.out.println("DEBUG: Duration: " + duration + ", Unit: " + unit);
//
//                switch (unit) {
//                    case "month":
//                        System.out.println("DEBUG: Returning " + duration + " months");
//                        return duration;
//                    case "quarter":
//                        int quarterMonths = duration * 3;
//                        System.out.println("DEBUG: Returning " + quarterMonths + " months (from quarters)");
//                        return quarterMonths;
//                    case "year":
//                        int yearMonths = duration * 12;
//                        System.out.println("DEBUG: Returning " + yearMonths + " months (from years)");
//                        return yearMonths;
//                    default:
//                        System.out.println("ERROR: Unknown time unit: " + unit);
//                        throw new IllegalArgumentException("Unknown time unit: " + unit);
//                }
//            } catch (NumberFormatException e) {
//                System.out.println("ERROR: Cannot parse duration number: " + parts[0]);
//                throw new IllegalArgumentException("Invalid duration number in choice: " + choice);
//            }
//        } else {
//            // Handle old format (just a number representing months)
//            System.out.println("DEBUG: Processing old format choice");
//            try {
//                int months = Integer.parseInt(choice);
//                System.out.println("DEBUG: Returning " + months + " months (old format)");
//                return months;
//            } catch (NumberFormatException e) {
//                System.out.println("ERROR: Cannot parse choice as integer: " + choice);
//                throw new IllegalArgumentException("Invalid choice format: " + choice);
//            }
//        }
//    }
//}

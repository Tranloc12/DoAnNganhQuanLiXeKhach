///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.controllers;
//
//import com.nhom12.pojo.Subscription;
//import com.nhom12.pojo.User;
//import com.nhom12.pojo.Workout;
//import com.nhom12.services.SubscriptionService;
//import com.nhom12.services.UserService;
//import com.nhom12.services.WorkoutService;
//import java.security.Principal;
//import java.text.ParseException;
//import java.text.SimpleDateFormat;
//import java.util.Date;
//import java.util.List;
//import java.util.Map;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PatchMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
///**
// *
// * @author HP
// */
//@RestController
//@RequestMapping("/api/secure/workout")
//@CrossOrigin(origins = "*")
//public class ApiWorkoutController {
//
//    @Autowired
//    private WorkoutService workoutSer;
//
//    @Autowired
//    private SubscriptionService subService;
//
//    @Autowired
//    private UserService userService;
//
//    @GetMapping("/subscription/{subscriptionId}/")
//    @CrossOrigin
//    public ResponseEntity<?> getWorkoutsBySubscriptionId(@PathVariable(name = "subscriptionId") int subscriptionId,
//            Principal principal) {
//        try {
//            User user = userService.getUserByUsername(principal.getName());
//            Subscription subscription = subService.getSubscriptionsById(subscriptionId);
//
//            // Kiểm tra quyền truy cập
//            if (user.getUserRole().equals("ROLE_MEMBER") &&
//                    subscription.getMemberId().getId() != user.getId()) {
//                return new ResponseEntity<>("Không có quyền truy cập", HttpStatus.FORBIDDEN);
//            }
//
//            List<Workout> workouts = workoutSer.getWorkoutsBySubscriptionId(subscriptionId);
//            return new ResponseEntity<>(workouts, HttpStatus.OK);
//        } catch (Exception e) {
//            System.err.println("Exception: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @PostMapping(path = "/create/", consumes = {
//            MediaType.APPLICATION_JSON_VALUE,
//            MediaType.MULTIPART_FORM_DATA_VALUE
//    })
//    @CrossOrigin
//    @Transactional
//    public ResponseEntity<String> create(@RequestParam Map<String, String> params, Principal p) throws ParseException {
//        try {
//            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//            int subscriptionId = Integer.parseInt(params.get("subscriptionId"));
//            Subscription subscription = subService.getSubscriptionsById(subscriptionId);
//
//            User u = userService.getUserByUsername(p.getName());
//            if (u == null || subscription.getMemberId().getId() != u.getId()
//                    && subscription.getTrainerId().getId() != u.getId()) {
//                return new ResponseEntity<>("Không có quyền", HttpStatus.BAD_REQUEST);
//            }
//
//            Date startTime = sdf.parse(params.get("startTime"));
//            Date endTime = sdf.parse(params.get("endTime"));
//
//            // Parse isWithTrainer parameter
//            boolean isWithTrainer = Boolean.parseBoolean(params.get("isWithTrainer"));
//
//            // Check remaining sessions if workout is with trainer
//            if (isWithTrainer) {
//                Integer remainingSessions = subscription.getRemainingSessions();
//                if (remainingSessions == null || remainingSessions <= 0) {
//                    return new ResponseEntity<>("Không còn buổi tập với huấn luyện viên", HttpStatus.BAD_REQUEST);
//                }
//
//                // Decrease remaining sessions atomically
//                int rowsAffected = subService.updateRemainingSessions(subscription.getId(), -1);
//                if (rowsAffected == 0) {
//                    return new ResponseEntity<>("Không còn buổi tập với huấn luyện viên hoặc không thể cập nhật",
//                            HttpStatus.BAD_REQUEST);
//                }
//            }
//
//            Workout workout = new Workout();
//            workout.setStartTime(startTime);
//            workout.setEndTime(endTime);
//            workout.setIsWithTrainer(isWithTrainer);
//            workout.setType(params.get("type"));
//            workout.setStatus(params.get("status"));
//            workout.setSubscriptionId(subscription);
//            workoutSer.createWorkout(workout);
//            return new ResponseEntity<>("Đăng ký lịch tập thành công!", HttpStatus.CREATED);
//
//        } catch (NumberFormatException e) {
//            System.err.println("NumberFormatException: " + e.getMessage());
//            return new ResponseEntity<>("Tham số không hợp lệ", HttpStatus.BAD_REQUEST);
//        } catch (NullPointerException e) {
//            System.err.println("NullPointerException: " + e.getMessage());
//            return new ResponseEntity<>("Không tìm thấy thông tin lịch tập hoặc người dùng", HttpStatus.NOT_FOUND);
//        } catch (Exception e) {
//            System.err.println("Exception: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @PatchMapping(path = "/{id}/", consumes = {
//            MediaType.MULTIPART_FORM_DATA_VALUE,
//            MediaType.APPLICATION_JSON_VALUE
//    })
//    @CrossOrigin
//    @Transactional
//    public ResponseEntity<?> updateWorkout(@PathVariable(name = "id") int id, @RequestParam Map<String, String> params,
//            Principal principal) throws ParseException {
//        try {
//            User user = userService.getUserByUsername(principal.getName());
//            Workout w = workoutSer.getById(id);
//            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//            if (params.containsKey("startTime")) {
//                Date startTime = sdf.parse(params.get("startTime"));
//                w.setStartTime(startTime);
//            }
//            if (params.containsKey("endTime")) {
//                Date endTime = sdf.parse(params.get("endTime"));
//                w.setEndTime(endTime);
//            }
//            if (params.containsKey("type")) {
//                w.setType(params.get("type"));
//            }
//            if (w.getStatus().equals("PENDING") && user.getUserRole().equals("ROLE_TRAINER")) {
//                w.setStatus("PENDING_MEMBER");
//            } else if (w.getStatus().equals("PENDING_MEMBER") && user.getUserRole().equals("ROLE_TRAINER")) {
//                w.setStatus("PENDING");
//            }
//
//            // Handle status updates
//            if (params.containsKey("status")) {
//                String newStatus = params.get("status");
//                // Member reject trainer's suggestion - back to MEMBER status
//                if (w.getStatus().equals("TRAINER") && user.getUserRole().equals("ROLE_MEMBER")
//                        && newStatus.equals("MEMBER")) {
//                    w.setStatus("MEMBER");
//                }
//                // Other status updates
//                else if (params.containsKey("status")) {
//                    w.setStatus(newStatus);
//                }
//            }
//
//            Workout updateWorkout = workoutSer.updateWorkout(w);
//            return new ResponseEntity<>("Thành công", HttpStatus.OK);
//        } catch (NumberFormatException e) {
//            System.err.println("NumberFormatException: " + e.getMessage());
//            return new ResponseEntity<>("Tham số không hợp lệ", HttpStatus.BAD_REQUEST);
//        } catch (NullPointerException e) {
//            System.err.println("NullPointerException: " + e.getMessage());
//            return new ResponseEntity<>("Không tìm thấy thông tin lịch tập hoặc người dùng", HttpStatus.NOT_FOUND);
//        } catch (Exception e) {
//            System.err.println("Exception: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // Trainer suggest alternative schedule
//    @PatchMapping(path = "/{id}/suggest/", consumes = {
//            MediaType.APPLICATION_JSON_VALUE,
//            MediaType.MULTIPART_FORM_DATA_VALUE
//    })
//    @CrossOrigin
//    @Transactional
//    public ResponseEntity<?> suggestAlternativeSchedule(@PathVariable(name = "id") int id,
//            @RequestParam Map<String, String> params, Principal principal) throws ParseException {
//        try {
//            User user = userService.getUserByUsername(principal.getName());
//            if (!user.getUserRole().equals("ROLE_TRAINER")) {
//                return new ResponseEntity<>("Chỉ trainer mới có thể đề xuất lịch khác", HttpStatus.FORBIDDEN);
//            }
//
//            Workout w = workoutSer.getById(id);
//            if (!w.getStatus().equals("MEMBER")) {
//                return new ResponseEntity<>("Chỉ có thể đề xuất lịch khác cho lịch tập có status MEMBER",
//                        HttpStatus.BAD_REQUEST);
//            }
//
//            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
//            if (params.containsKey("startTime")) {
//                Date startTime = sdf.parse(params.get("startTime"));
//                w.setStartTime(startTime);
//            }
//            if (params.containsKey("endTime")) {
//                Date endTime = sdf.parse(params.get("endTime"));
//                w.setEndTime(endTime);
//            }
//            if (params.containsKey("type")) {
//                w.setType(params.get("type"));
//            }
//
//            w.setStatus("TRAINER");
//            workoutSer.updateWorkout(w);
//            return new ResponseEntity<>("Đề xuất lịch thành công", HttpStatus.OK);
//        } catch (NumberFormatException e) {
//            System.err.println("NumberFormatException: " + e.getMessage());
//            return new ResponseEntity<>("Tham số không hợp lệ", HttpStatus.BAD_REQUEST);
//        } catch (NullPointerException e) {
//            System.err.println("NullPointerException: " + e.getMessage());
//            return new ResponseEntity<>("Không tìm thấy thông tin lịch tập hoặc người dùng", HttpStatus.NOT_FOUND);
//        } catch (Exception e) {
//            System.err.println("Exception: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @PatchMapping(path = "/{id}/approve/", consumes = {
//            MediaType.APPLICATION_JSON_VALUE,
//            MediaType.MULTIPART_FORM_DATA_VALUE
//    })
//    @CrossOrigin
//    @Transactional
//    public ResponseEntity<?> approveWorkout(@PathVariable(name = "id") int id, Principal principal)
//            throws ParseException {
//        try {
//            User user = userService.getUserByUsername(principal.getName());
//            Workout w = workoutSer.getById(id);
//
//            // Trainer approve member's schedule
//            if (w.getStatus().equals("MEMBER") && user.getUserRole().equals("ROLE_TRAINER")) {
//                w.setStatus("APPROVED");
//            }
//            // Member accept trainer's suggestion
//            else if (w.getStatus().equals("TRAINER") && user.getUserRole().equals("ROLE_MEMBER")) {
//                w.setStatus("APPROVED");
//            }
//            // Legacy logic for PENDING status
//            else if (w.getStatus().equals("PENDING") && user.getUserRole().equals("ROLE_TRAINER")
//                    || w.getStatus().equals("PENDING_MEMBER") && user.getUserRole().equals("ROLE_TRAINER")) {
//                w.setStatus("APPROVED");
//            }
//            Workout updateWorkout = workoutSer.updateWorkout(w);
//            return new ResponseEntity<>("Thành công", HttpStatus.OK);
//        } catch (NullPointerException e) {
//            System.err.println("NullPointerException: " + e.getMessage());
//            return new ResponseEntity<>("Không tìm thấy thông tin lịch tập hoặc người dùng", HttpStatus.NOT_FOUND);
//        } catch (Exception e) {
//            System.err.println("Exception: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // Delete
//    @DeleteMapping("/{id}/")
//    @CrossOrigin
//    @Transactional
//    public ResponseEntity<?> deleteWorkout(@PathVariable(name = "id") int id, Principal principal) {
//        try {
//            User user = userService.getUserByUsername(principal.getName());
//            Workout w = workoutSer.getById(id);
//
//            // If workout was with trainer, increase remaining sessions
//            if (w.getIsWithTrainer() != null && w.getIsWithTrainer()) {
//                int rowsAffected = subService.updateRemainingSessions(w.getSubscriptionId().getId(), 1);
//                if (rowsAffected == 0) {
//                    System.err.println("Warning: Could not increase remaining sessions for subscription " +
//                            w.getSubscriptionId().getId());
//                    // Continue with deletion even if we can't update sessions
//                }
//            }
//
//            workoutSer.deleteWorkout(w);
//            return new ResponseEntity<>("Xóa thành công", HttpStatus.OK);
//
//        } catch (NullPointerException e) {
//            System.err.println("NullPointerException: " + e.getMessage());
//            return new ResponseEntity<>("Không tìm thấy thông tin lịch tập hoặc người dùng", HttpStatus.NOT_FOUND);
//        } catch (Exception e) {
//            System.err.println("Exception: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>("Lỗi hệ thống", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//}

///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.controllers;
//
//import com.nhom12.pojo.GymPackage;
//import com.nhom12.services.GymPackageService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.*;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api")
//@CrossOrigin(origins = "*")
//public class ApiGymPackageController {
//
//    @Autowired
//    private GymPackageService gymPackageService;
//
//    // Lấy danh sách tất cả gói tập
//    @GetMapping("/gym-packages")
//    public ResponseEntity<List<GymPackage>> list(@RequestParam Map<String, String> params) {
//        try {
//            System.out.println("=== API /gym-packages được gọi ===");
//            List<GymPackage> packages = gymPackageService.getAllGymPackages();
//            System.out.println("Số lượng gói tập: " + (packages != null ? packages.size() : "null"));
//            return new ResponseEntity<>(packages, HttpStatus.OK);
//        } catch (Exception e) {
//            System.err.println("Lỗi khi lấy danh sách gói tập: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // Lấy danh sách gói tập với phân trang
//    @GetMapping("/gym-packages/paginated")
//    public ResponseEntity<Map<String, Object>> listWithPagination(
//            @RequestParam(name = "page", defaultValue = "0") int page,
//            @RequestParam(name = "size", defaultValue = "6") int size) {
//        try {
//            List<GymPackage> packages = gymPackageService.getAllGymPackagesWithPagination(page, size);
//            long totalElements = gymPackageService.getTotalGymPackagesCount();
//            int totalPages = (int) Math.ceil((double) totalElements / size);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("content", packages);
//            response.put("totalElements", totalElements);
//            response.put("totalPages", totalPages);
//            response.put("currentPage", page);
//            response.put("size", size);
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        } catch (Exception e) {
//            System.err.println("Lỗi khi lấy danh sách gói tập có phân trang: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // Lấy danh sách gói tập với rating trung bình và phân trang
//    @GetMapping("/gym-packages/with-rating")
//    public ResponseEntity<Map<String, Object>> listWithRating(
//            @RequestParam(name = "page", defaultValue = "0") int page,
//            @RequestParam(name = "size", defaultValue = "6") int size) {
//        try {
//            List<Map<String, Object>> packages = gymPackageService.getAllGymPackagesWithAverageRating(page, size);
//            long totalElements = gymPackageService.getTotalGymPackagesCount();
//            int totalPages = (int) Math.ceil((double) totalElements / size);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("content", packages);
//            response.put("totalElements", totalElements);
//            response.put("totalPages", totalPages);
//            response.put("currentPage", page);
//            response.put("size", size);
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        } catch (Exception e) {
//            System.err.println("Lỗi khi lấy danh sách gói tập với rating: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // Lấy chi tiết một gói tập theo ID
//    @GetMapping("/gym-packages/{id}")
//    public ResponseEntity<GymPackage> getById(@PathVariable(name = "id") int id) {
//        GymPackage gp = gymPackageService.getGymPackageById(id);
//        if (gp != null)
//            return new ResponseEntity<>(gp, HttpStatus.OK);
//        else
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
//
//    // Xoá gói tập theo ID
//    @DeleteMapping("/gym-packages/{id}")
//    @ResponseStatus(HttpStatus.NO_CONTENT)
//    public void delete(@PathVariable(name = "id") int id) {
//        gymPackageService.deleteGymPackage(id);
//    }
//
//    // Thêm mới gói tập (POST)
//    @PostMapping("/gym-packages")
//    public ResponseEntity<GymPackage> create(@RequestBody GymPackage gymPackage) {
//        boolean success = gymPackageService.addGymPackage(gymPackage);
//        if (success)
//            return new ResponseEntity<>(gymPackage, HttpStatus.CREATED);
//        else
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//    }
//
//    // Cập nhật gói tập (PUT)
//    @PutMapping("/gym-packages/{id}")
//    public ResponseEntity<GymPackage> update(@PathVariable(name = "id") int id,
//            @RequestBody GymPackage gymPackage) {
//        gymPackage.setId(id); // Đảm bảo ID đúng
//        boolean success = gymPackageService.updateGymPackage(gymPackage);
//        if (success)
//            return new ResponseEntity<>(gymPackage, HttpStatus.OK);
//        else
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
//    }
//
//    // Debug endpoint to update choice format for all packages
//    @PostMapping("/gym-packages/update-choice-format")
//    public ResponseEntity<Map<String, Object>> updateChoiceFormat() {
//        Map<String, Object> response = new HashMap<>();
//
//        try {
//            List<GymPackage> packages = gymPackageService.getAllGymPackages();
//            int updatedCount = 0;
//
//            for (GymPackage pkg : packages) {
//                String oldChoice = pkg.getChoice();
//                String newChoice = convertToNewChoiceFormat(oldChoice);
//
//                if (!oldChoice.equals(newChoice)) {
//                    pkg.setChoice(newChoice);
//                    gymPackageService.updateGymPackage(pkg);
//                    updatedCount++;
//                    System.out.println("Updated package " + pkg.getId() + ": " + oldChoice + " -> " + newChoice);
//                }
//            }
//
//            response.put("message", "Choice format update completed");
//            response.put("totalPackages", packages.size());
//            response.put("updatedPackages", updatedCount);
//            response.put("success", true);
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//
//        } catch (Exception e) {
//            response.put("error", "Error updating choice format: " + e.getMessage());
//            response.put("success", false);
//            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    private String convertToNewChoiceFormat(String oldChoice) {
//        if (oldChoice == null || oldChoice.contains("-")) {
//            return oldChoice; // Already in new format or null
//        }
//
//        switch (oldChoice) {
//            case "1":
//                return "1-month";
//            case "3":
//                return "3-month";
//            case "6":
//                return "6-month";
//            case "12":
//                return "1-year";
//            case "24":
//                return "2-year";
//            default:
//                // Try to parse as number and assume months
//                try {
//                    int months = Integer.parseInt(oldChoice);
//                    if (months % 12 == 0) {
//                        return (months / 12) + "-year";
//                    } else {
//                        return months + "-month";
//                    }
//                } catch (NumberFormatException e) {
//                    return oldChoice; // Return as-is if can't parse
//                }
//        }
//    }
//}

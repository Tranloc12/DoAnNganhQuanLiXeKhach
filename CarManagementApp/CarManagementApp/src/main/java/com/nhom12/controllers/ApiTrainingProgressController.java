///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.controllers;
//
//import com.nhom12.pojo.MemberInfo;
//import com.nhom12.pojo.TrainingProgress;
//import com.nhom12.pojo.User;
//import com.nhom12.services.MemberInfoService;
//import com.nhom12.services.TrainingProgresService;
//import com.nhom12.services.UserService;
//import java.security.Principal;
//import java.text.ParseException;
//import java.text.SimpleDateFormat;
//import java.util.Date;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Map;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.GetMapping;
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
//@RequestMapping("/api/secure/progress")
//@CrossOrigin(origins = "*")
//public class ApiTrainingProgressController {
//
//    @Autowired
//    private TrainingProgresService trainProService;
//
//    @Autowired
//    private MemberInfoService memInfoService;
//
//    @Autowired
//    private MemberInfoService memberInfoService;
//
//    @Autowired
//    private UserService userService;
//
//    @PostMapping(path = "/create/", consumes = {
//            MediaType.APPLICATION_JSON_VALUE,
//            MediaType.MULTIPART_FORM_DATA_VALUE
//    })
//    @CrossOrigin
//    @Transactional
//    public ResponseEntity<String> createTrainingProgress(
//            @RequestParam Map<String, String> params, Principal p) throws ParseException {
//
//        try {
//            User user = userService.getUserByUsername(p.getName());
//            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//            int memberInfoId = Integer.parseInt(params.get("memberInfoId"));
//            Date recordDate = sdf.parse(params.get("recordDate"));
//            double weight = Double.parseDouble(params.get("weight"));
//            double bodyFat = Double.parseDouble(params.get("bodyFat"));
//            double muscle = Double.parseDouble(params.get("muscle"));
//
//            if (user.getUserRole().equals("ROLE_TRAINER")) {
//                TrainingProgress progress = new TrainingProgress();
//                progress.setRecordDate(recordDate);
//                progress.setWeight(weight);
//                progress.setBodyFat(bodyFat);
//                progress.setMuscle(muscle);
//                progress.setNote(params.get("note"));
//                progress.setMemberInfoId(memInfoService.getMemberInfoById(memberInfoId));
//
//                // Lưu tiến độ
//                trainProService.addTrainingProgress(progress);
//            }
//
//            return new ResponseEntity<>("Thêm tiến độ tập luyện thành công!", HttpStatus.CREATED);
//
//        } catch (NumberFormatException e) {
//            return new ResponseEntity<>("Tham số không hợp lệ", HttpStatus.BAD_REQUEST);
//        } catch (NullPointerException e) {
//            return new ResponseEntity<>("Không tìm thấy thông tin thành viên", HttpStatus.NOT_FOUND);
//        } catch (Exception e) {
//            return new ResponseEntity<>("Lỗi hệ thống: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @GetMapping("/my-progress")
//    public ResponseEntity<?> listMyTrainingProgress(Principal p) throws ParseException {
//        try {
//            User user = userService.getUserByUsername(p.getName());
//
//            // Check if user exists
//            if (user == null) {
//                return new ResponseEntity<>("Người dùng không tồn tại", HttpStatus.NOT_FOUND);
//            }
//
//            // Check if user has MemberInfo - try to load it separately if null
//            MemberInfo memberInfo = user.getMemberInfo();
//            if (memberInfo == null) {
//                System.out.println("User " + user.getUsername() + " MemberInfo is null, trying to load separately");
//                // Try to load MemberInfo separately using repository
//                memberInfo = memberInfoService.getMemberInfoByUserId(user.getId());
//            }
//
//            if (memberInfo == null) {
//                System.out.println("User " + user.getUsername() + " does not have MemberInfo in database");
//                return new ResponseEntity<>(
//                        "Thông tin thành viên chưa được tạo. Vui lòng tạo thông tin thành viên trước.",
//                        HttpStatus.NOT_FOUND);
//            }
//
//            System.out.println("Getting progress for member ID: " + memberInfo.getId());
//            List<TrainingProgress> progresses = trainProService.getProgressByMember(memberInfo.getId());
//
//            if (progresses.isEmpty()) {
//                return new ResponseEntity<>("Chưa có tiến độ tập luyện nào được ghi nhận", HttpStatus.NOT_FOUND);
//            }
//
//            return new ResponseEntity<>(progresses, HttpStatus.OK);
//        } catch (NumberFormatException e) {
//            System.out.println("NumberFormatException: " + e.getMessage());
//            return new ResponseEntity<>("ID thành viên không hợp lệ", HttpStatus.BAD_REQUEST);
//        } catch (Exception e) {
//            System.out.println("Exception in listMyTrainingProgress: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>("Lỗi hệ thống: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    @PostMapping(path = "/mem-progress", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    public ResponseEntity<?> listMemTrainingProgress(@RequestParam Map<String, String> params, Principal p)
//            throws ParseException {
//        try {
//            User user = userService.getUserByUsername(p.getName());
//            if (user.getUserRole().equals("ROLE_MEMBER")) {
//                return new ResponseEntity<>("Không có quyền", HttpStatus.BAD_REQUEST);
//            }
//            int memberId = Integer.parseInt(params.get("memberId"));
//            List<TrainingProgress> progresses = trainProService.getProgressByMember(memberId);
//            if (progresses.isEmpty()) {
//                return new ResponseEntity<>("Không tìm thấy tiến độ tập luyện", HttpStatus.NOT_FOUND);
//            }
//            return new ResponseEntity<>(progresses, HttpStatus.OK);
//        } catch (NumberFormatException e) {
//            return new ResponseEntity<>("ID thành viên không hợp lệ", HttpStatus.BAD_REQUEST);
//        } catch (Exception e) {
//            return new ResponseEntity<>("Lỗi hệ thống: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // Tạo MemberInfo cho user hiện tại nếu chưa có
//    @PostMapping("/create-member-info")
//    public ResponseEntity<?> createMemberInfo(@RequestParam Map<String, String> params, Principal p) {
//        try {
//            User user = userService.getUserByUsername(p.getName());
//
//            if (user == null) {
//                return new ResponseEntity<>("Người dùng không tồn tại", HttpStatus.NOT_FOUND);
//            }
//
//            if (user.getMemberInfo() != null) {
//                return new ResponseEntity<>("Thông tin thành viên đã tồn tại", HttpStatus.BAD_REQUEST);
//            }
//
//            // Tạo MemberInfo mới
//            MemberInfo memberInfo = new MemberInfo();
//            memberInfo.setUserId(user);
//
//            // Set default values hoặc từ params
//            memberInfo.setHeight(params.get("height") != null ? Integer.parseInt(params.get("height")) : 170);
//            memberInfo.setWeight(params.get("weight") != null ? Integer.parseInt(params.get("weight")) : 70);
//            memberInfo.setGoal(params.get("goal") != null ? params.get("goal") : "Tăng cường sức khỏe");
//            memberInfo.setTrainingProgressSet(new HashSet<>());
//
//            // Lưu MemberInfo
//            memberInfoService.addMemberInfo(memberInfo);
//
//            return new ResponseEntity<>("Tạo thông tin thành viên thành công", HttpStatus.CREATED);
//        } catch (Exception e) {
//            System.out.println("Error creating MemberInfo: " + e.getMessage());
//            e.printStackTrace();
//            return new ResponseEntity<>("Lỗi hệ thống: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // Lấy danh sách tất cả hội viên
//    @GetMapping("/members")
//    public ResponseEntity<?> listMembers() {
//        try {
//            List<MemberInfo> members = memberInfoService.getAllMembers();
//            if (members.isEmpty()) {
//                return new ResponseEntity<>("Không tìm thấy hội viên nào", HttpStatus.NOT_FOUND);
//            }
//            return new ResponseEntity<>(members, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>("Lỗi hệ thống: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//}

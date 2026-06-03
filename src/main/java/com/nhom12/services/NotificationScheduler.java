///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.services;
//// Ví dụ: Trong một class mới tên là NotificationScheduler.java
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Scheduled;
//
//@Service
//public class NotificationScheduler {
//    @Autowired
//    private FcmService fcmService;
//    @Autowired
//    private UserService userService; // Để truy vấn người dùng
//
//    // Tác vụ này sẽ chạy mỗi 5 phút
//    @Scheduled(fixedRate = 300000) 
//    public void sendDepartureReminders() {
//        // 1. Lấy danh sách những người dùng có chuyến đi sắp khởi hành
//        List<UserService> usersToNotify = userService.getUsersWithUpcomingTrips();
//
//        // 2. Lặp qua danh sách và gửi thông báo
//        for (User user : usersToNotify) {
//            if (user.getFcmToken() != null) {
//                fcmService.sendNotification(user.getFcmToken(), "Nhắc nhở khởi hành", "Chuyến xe của bạn sắp khởi hành!");
//            }
//        }
//    }
//}
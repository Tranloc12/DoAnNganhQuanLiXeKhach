/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.pojo.User;
import com.nhom12.services.TripService;
import com.nhom12.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin
public class ApiStatisticController {

    @Autowired
    private TripService tripService;

    @Autowired
    private UserService userService;

    // 📊 Thống kê doanh thu theo tháng
    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenueStats(@RequestParam(required = false) Integer year) {
        if (year == null) {
            year = LocalDate.now().getYear();
        }
        List<Object[]> stats = tripService.getMonthlyRevenueStats(year);
        return ResponseEntity.ok(stats);
    }

    // 📊 Thống kê số chuyến theo tuyến đường
    @GetMapping("/trips")
    public ResponseEntity<?> getTripCountStats() {
        return ResponseEntity.ok(tripService.getTripCountByRouteStats());
    }

    // 📊 Thống kê số user theo vai trò
    @GetMapping("/users")
    public ResponseEntity<?> getUserRoleStats() {
        return ResponseEntity.ok(userService.getUserRoleStats());
    }
}


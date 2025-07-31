/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;
import com.nhom12.services.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/secure/statistics")
@CrossOrigin(origins = "*")
public class ApiStatisticController {

    @Autowired
    private StatisticService statisticService;

    @GetMapping("/members")
    public ResponseEntity<Long> getTotalMembers() {
        long totalMembers = statisticService.getTotalMembers();
        return ResponseEntity.ok(totalMembers);
    }

    @GetMapping("/revenue")
    public ResponseEntity<Double> getTotalRevenue() {
        double totalRevenue = statisticService.getTotalRevenue();
        return ResponseEntity.ok(totalRevenue);
    }

    @GetMapping("/gym-usage")
    public ResponseEntity<Map<String, Integer>> getGymUsageByTimeSlot() {
        Map<String, Integer> gymUsage = statisticService.getGymUsageByTimeSlot();
        return ResponseEntity.ok(gymUsage);
    }
    
    
}
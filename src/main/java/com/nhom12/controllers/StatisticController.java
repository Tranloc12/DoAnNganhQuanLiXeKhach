/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.pojo.User;
import com.nhom12.services.StatisticService;
import com.nhom12.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.security.Principal;
import java.util.Map;

@Controller
public class StatisticController {

    @Autowired
    private StatisticService statisticService;

    @Autowired
    private UserService userService;

    @GetMapping("/statistics")
    public String showStatistics(Model model, Principal principal) {
        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userService.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        // Thêm currentUser vào model để navbar hiển thị đúng
        model.addAttribute("currentUser", currentUser);

        // Lấy số lượng hội viên
        long memberCount = statisticService.getTotalMembers();

        // Lấy tổng doanh thu
        double totalRevenue = statisticService.getTotalRevenue();

        // Lấy mức độ sử dụng phòng tập theo khung giờ
        Map<String, Integer> gymUsage = statisticService.getGymUsageByTimeSlot();
        // Thêm dữ liệu vào model để hiển thị trên Thymeleaf
        model.addAttribute("memberCount", memberCount);
        model.addAttribute("totalRevenue", totalRevenue);
        model.addAttribute("gymUsage", gymUsage);

        return "statistics"; // Tên file Thymeleaf: statistics.html
    }
}

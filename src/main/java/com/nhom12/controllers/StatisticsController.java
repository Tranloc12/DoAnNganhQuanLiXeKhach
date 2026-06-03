/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
// src/main/java/com/nhom12/controllers/StatisticsController.java
package com.nhom12.controllers;

import com.nhom12.services.TripService;
import com.nhom12.services.UserService;
import com.nhom12.pojo.User;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class StatisticsController {

    @Autowired
    private TripService tripService;
    @Autowired
    private UserService userService; // Để kiểm tra quyền truy cập

    // Phương thức kiểm tra quyền Admin
    private String checkAdminAccess(Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }
        User currentUser = userService.getUserByUsername(principal.getName());
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/access-denied"; // Chuyển hướng đến trang từ chối truy cập
        }
        return null;
    }

    @GetMapping("/admin-statics")
    public String showStatistics(Model model, Principal principal, RedirectAttributes redirectAttributes,
                                 @RequestParam(name = "year", required = false) Integer year) {
        // Kiểm tra quyền Admin
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        // Nếu không có năm nào được cung cấp, mặc định là năm hiện tại
        int currentYear = LocalDate.now().getYear();
        if (year == null) {
            year = currentYear;
        }

        // 1. Thống kê doanh thu theo tháng
        List<Object[]> monthlyRevenueStats = tripService.getMonthlyRevenueStats(year);
        model.addAttribute("monthlyRevenueStats", monthlyRevenueStats);
        model.addAttribute("statsYear", year);

        // Chuẩn bị dữ liệu cho biểu đồ (Chart.js)
        StringBuilder monthLabels = new StringBuilder("[");
        StringBuilder revenueData = new StringBuilder("[");
        for (int i = 0; i < monthlyRevenueStats.size(); i++) {
            Object[] row = monthlyRevenueStats.get(i);
            monthLabels.append("'Tháng ").append(row[0]).append("'");
            revenueData.append(row[1]);
            if (i < monthlyRevenueStats.size() - 1) {
                monthLabels.append(", ");
                revenueData.append(", ");
            }
        }
        monthLabels.append("]");
        revenueData.append("]");
        model.addAttribute("monthLabels", monthLabels.toString());
        model.addAttribute("revenueData", revenueData.toString());

        // 2. Thống kê số lượng chuyến đi theo tuyến đường
        List<Object[]> tripCountByRouteStats = tripService.getTripCountByRouteStats();
        model.addAttribute("tripCountByRouteStats", tripCountByRouteStats);

        // Chuẩn bị dữ liệu cho biểu đồ (Chart.js)
        StringBuilder routeLabels = new StringBuilder("[");
        StringBuilder tripCountData = new StringBuilder("[");
        for (int i = 0; i < tripCountByRouteStats.size(); i++) {
            Object[] row = tripCountByRouteStats.get(i);
            routeLabels.append("'").append(row[0]).append("'");
            tripCountData.append(row[1]);
            if (i < tripCountByRouteStats.size() - 1) {
                routeLabels.append(", ");
                tripCountData.append(", ");
            }
        }
        routeLabels.append("]");
        tripCountData.append("]");
        model.addAttribute("routeLabels", routeLabels.toString());
        model.addAttribute("tripCountData", tripCountData.toString());

        // 3. Thống kê số lượng người dùng theo vai trò
        List<Object[]> userRoleStats = userService.getUserRoleStats();
        model.addAttribute("userRoleStats", userRoleStats);

        // Chuẩn bị dữ liệu cho biểu đồ (Chart.js)
        StringBuilder roleLabels = new StringBuilder("[");
        StringBuilder userCountData = new StringBuilder("[");
        for (int i = 0; i < userRoleStats.size(); i++) {
            Object[] row = userRoleStats.get(i);
            roleLabels.append("'").append(row[0]).append("'");
            userCountData.append(row[1]);
            if (i < userRoleStats.size() - 1) {
                roleLabels.append(", ");
                userCountData.append(", ");
            }
        }
        roleLabels.append("]");
        userCountData.append("]");
        model.addAttribute("roleLabels", roleLabels.toString());
        model.addAttribute("userCountData", userCountData.toString());


        return "adminStatics"; // Tên view file (adminStatics.html)
    }
}

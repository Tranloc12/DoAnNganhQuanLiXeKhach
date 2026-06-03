/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.pojo.User;
import com.nhom12.services.BusService;
import com.nhom12.services.DriverService;
import com.nhom12.services.RouteService;
import com.nhom12.services.TripService;
import com.nhom12.services.UserService;
//import com.nhom12.services.WorkoutService;
import java.security.Principal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author HP
 */
@Controller
public class IndexController {

    @Autowired
    private UserService userService;

    @Autowired
    private BusService busService;

    @Autowired
    private DriverService driverService;

    @Autowired
    private TripService tripService;

    @Autowired
    private RouteService routeService;

    @RequestMapping("/")
    public String index(Model model, Principal principal) {
        if (principal != null) {
            User currentUser = userService.getUserByUsername(principal.getName());
            model.addAttribute("currentUser", currentUser);

            if ("ROLE_ADMIN".equals(currentUser.getUserRole())) {
                // Lấy danh sách user
                List<User> users = userService.getUsers();
                model.addAttribute("users", users);

                // Thống kê user
                long totalUsers = users.size();
                long totalPassengers = users.stream()
                        .filter(u -> "ROLE_PASSENGER".equals(u.getUserRole()))
                        .count();

                long totalDrivers = users.stream()
                        .filter(u -> "ROLE_DRIVER".equals(u.getUserRole()))
                        .count();

                long totalStaff = users.stream()
                        .filter(u -> "ROLE_STAFF".equals(u.getUserRole()))
                        .count();

                long totalManagers = users.stream()
                        .filter(u -> "ROLE_MANAGER".equals(u.getUserRole()))
                        .count();

                long totalAdmins = users.stream()
                        .filter(u -> "ROLE_ADMIN".equals(u.getUserRole()))
                        .count();

                model.addAttribute("totalPassengers", totalPassengers);
                model.addAttribute("totalDrivers", totalDrivers);
                model.addAttribute("totalStaff", totalStaff);
                model.addAttribute("totalManagers", totalManagers);
                model.addAttribute("totalAdmins", totalAdmins);

                model.addAttribute("totalUsers", totalUsers);
                model.addAttribute("totalPassengers", totalPassengers);
                model.addAttribute("totalDrivers", totalDrivers);
                model.addAttribute("totalStaff", totalStaff);
                model.addAttribute("totalAdmins", totalAdmins);

                // Thống kê từ các bảng khác
                model.addAttribute("totalBuses", busService.countBuses());
                model.addAttribute("totalTrips", tripService.countTrips());
                model.addAttribute("totalRoutes", routeService.countRoutes());
                model.addAttribute("totalDriversDb", driverService.countDrivers());
                
            }
        }
        return "index";
    }
}

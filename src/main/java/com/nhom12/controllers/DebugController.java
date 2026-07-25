package com.nhom12.controllers;

import com.nhom12.pojo.User;
import com.nhom12.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class DebugController {

    @Autowired
    private UserService userService;

    @GetMapping("/api/payment/vnpay/debug/users")
    public String debugUsers() {
        try {
            List<User> users = userService.getUsers();
            if (users == null || users.isEmpty()) {
                return "No users in database!";
            }
            return users.stream()
                    .map(u -> "ID: " + u.getId() + ", Username: " + u.getUsername() + ", Role: " + u.getUserRole() + ", Hash: " + u.getPassword())
                    .collect(Collectors.joining("<br/>"));
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
    
    @GetMapping("/api/payment/vnpay/debug/reset-admin")
    public String resetAdmin() {
        try {
            User admin = userService.getUserByUsername("admin");
            if (admin != null) {
                userService.changePassword(admin, "123456");
                return "Admin password reset successfully to 123456. Hash is now: " + admin.getPassword();
            }
            return "Admin user not found!";
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }
    }
}

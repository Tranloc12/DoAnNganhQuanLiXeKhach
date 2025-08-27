package com.nhom12.controllers;

import com.nhom12.pojo.Payment;
import com.nhom12.pojo.User;
import com.nhom12.services.PaymentService;
import com.nhom12.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class ApiPaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @GetMapping("/my")
    public ResponseEntity<?> getMyPaymentHistory(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để xem lịch sử giao dịch.");
        }

        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy thông tin người dùng.");
        }

        List<Payment> paymentHistory = paymentService.getPaymentHistory(user.getId());

        return ResponseEntity.ok(paymentHistory);
    }
}
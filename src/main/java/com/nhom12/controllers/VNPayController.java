//package com.nhom12.controllers;
//
//import com.nhom12.services.VnPayService;
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//
//@Controller
//public class VNPayController {
//
//    @Autowired
//    private VnPayService vnPayService;
//
//    // Endpoint này được gọi từ trang web của bạn khi người dùng nhấn nút "Thanh toán"
//    @PostMapping("/create_payment")
//    public String createPayment(HttpServletRequest request, Model model) {
//        try {
//            // Gọi service để tạo URL thanh toán VNPAY
//            String paymentUrl = vnPayService.createVnPayUrl(request);
//            // Chuyển hướng người dùng đến trang thanh toán của VNPAY
//            return "redirect:" + paymentUrl;
//        } catch (Exception e) {
//            // Xử lý lỗi nếu có
//            e.printStackTrace();
//            return "errorPage"; // Trả về trang lỗi
//        }
//    }
//
//    // Endpoint này được VNPAY gọi lại sau khi người dùng thanh toán xong
//    // Dùng để hiển thị kết quả cho người dùng
//    @GetMapping("/vnpay_return")
//    public String vnpayReturn(HttpServletRequest request, Model model) {
//        String result = vnPayService.handleVnPayReturn(request);
//        model.addAttribute("result", result);
//        return "vnpay_result_page"; // Tên file view (HTML, JSP,...) để hiển thị kết quả
//    }
//
//    // Endpoint này được VNPAY gọi để xác nhận giao dịch (IPN - Instant Payment Notification)
//    // Đây là bước quan trọng để đảm bảo tính toàn vẹn của dữ liệu
//    @GetMapping("/vnpay_ipn")
//    public ResponseEntity<String> vnpayIpn(HttpServletRequest request) {
//        String result = vnPayService.handleVnPayIpn(request);
//        return ResponseEntity.ok(result);
//    }
//}
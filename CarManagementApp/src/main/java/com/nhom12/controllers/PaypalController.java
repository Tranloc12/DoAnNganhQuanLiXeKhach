/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;


import com.paypal.api.payments.Links;
import com.paypal.base.rest.PayPalRESTException;
import com.nhom12.services.PaypalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller xử lý các yêu cầu liên quan đến PayPal từ front-end.
 */
@RestController // Đánh dấu đây là một REST Controller
@RequestMapping("/api/paypal") // Định nghĩa base URL cho tất cả các endpoints trong Controller này
// Cần thiết để cho phép các yêu cầu từ ReactJS front-end chạy trên port khác (ví dụ: http://localhost:3000)
@CrossOrigin(origins = "http://localhost:3000") 
public class PaypalController {

    @Autowired
    private PaypalService paypalService; // Inject PaypalService để sử dụng các phương thức của nó

    /**
     * Endpoint để tạo một thanh toán PayPal.
     * Phương thức này nhận yêu cầu POST từ front-end để khởi tạo giao dịch PayPal.
     *
     * @param price Giá tiền của giao dịch.
     * @param bookingId ID của Booking liên quan đến thanh toán này.
     * @return ResponseEntity chứa URL phê duyệt của PayPal nếu thành công, hoặc thông báo lỗi nếu thất bại.
     */
    @PostMapping("/create-payment")
    public ResponseEntity<String> createPayment(@RequestParam("price") Double price, @RequestParam("bookingId") Integer bookingId) {
        try {
            // Các URL hủy và thành công mà PayPal sẽ chuyển hướng trình duyệt của người dùng về sau khi họ tương tác trên trang PayPal.
            // Chúng ta truyền bookingId trở lại qua URL để trang Success/Cancel của React có thể lấy nó và gửi lại cho back-end.
            String cancelUrl = "http://localhost:3000/cancel?bookingId=" + bookingId; 
            String successUrl = "http://localhost:3000/success?bookingId=" + bookingId;  

            // Gọi service PayPal để tạo thanh toán trên hệ thống PayPal.
            com.paypal.api.payments.Payment payment = paypalService.createPayment(
                price,
                "USD", // Loại tiền tệ mặc định, có thể thay đổi để nhận từ request nếu cần.
                "paypal", // Phương thức thanh toán luôn là 'paypal' trong trường hợp này.
                "sale", // Mục đích của giao dịch, 'sale' là bán hàng.
                "Thanh toán cho dịch vụ CarManagementApp", // Mô tả giao dịch sẽ hiển thị trên PayPal.
                cancelUrl,
                successUrl
            );

            // Duyệt qua các liên kết (links) trong phản hồi của PayPal để tìm URL phê duyệt (approval_url).
            // Đây là URL mà người dùng cần được chuyển hướng đến để hoàn tất việc ủy quyền thanh toán trên PayPal.
            for (Links links : payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    return ResponseEntity.ok(links.getHref()); // Trả về URL phê duyệt cho front-end.
                }
            }
        } catch (PayPalRESTException e) {
            // Xử lý lỗi nếu có vấn đề khi giao tiếp với PayPal API (ví dụ: lỗi cấu hình, lỗi mạng).
            e.printStackTrace(); // In stack trace ra console để debug.
            return ResponseEntity.status(500).body("Error creating payment: " + e.getMessage());
        }
        // Trả về lỗi nếu không tìm thấy URL phê duyệt.
        return ResponseEntity.status(500).body("Error: Could not get approval URL for payment.");
    }

    /**
     * Endpoint để thực hiện thanh toán sau khi người dùng phê duyệt trên PayPal.
     * Phương thức này nhận yêu cầu GET từ front-end sau khi PayPal chuyển hướng người dùng về.
     *
     * @param paymentId ID thanh toán từ PayPal, được truyền qua URL parameter.
     * @param payerId ID người trả tiền từ PayPal, được truyền qua URL parameter.
     * @param bookingId ID của Booking liên quan, được truyền qua URL parameter.
     * @return ResponseEntity chứa thông báo thành công hoặc lỗi sau khi thực hiện thanh toán.
     */
    @GetMapping("/execute-payment")
    public ResponseEntity<String> executePayment(
        @RequestParam("paymentId") String paymentId, 
        @RequestParam("PayerID") String payerId,
        @RequestParam("bookingId") Integer bookingId) { 
        try {
            // Gọi service PayPal để thực hiện thanh toán và cập nhật database.
            // Phương thức này cũng sẽ lưu Payment vào DB và cập nhật Booking status.
            com.paypal.api.payments.Payment executedPayment = paypalService.executePaymentAndSaveToDb(paymentId, payerId, bookingId);
            
            // Kiểm tra trạng thái thanh toán từ PayPal. Nếu là "approved", giao dịch thành công.
            if ("approved".equals(executedPayment.getState())) {
                return ResponseEntity.ok("Payment successful! Transaction ID: " + executedPayment.getId() + ". Booking ID: " + bookingId + " has been updated.");
            } else {
                // Nếu trạng thái không phải "approved" (ví dụ: "failed", "pending"), trả về lỗi.
                return ResponseEntity.status(400).body("Payment not approved. Status: " + executedPayment.getState());
            }
        } catch (PayPalRESTException e) {
            // Xử lý lỗi nếu có vấn đề khi thực hiện giao dịch với PayPal API.
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error executing payment: " + e.getMessage());
        } catch (Exception e) {
             // Xử lý các lỗi chung khác có thể xảy ra trong quá trình (ví dụ: Booking không tìm thấy, lỗi database).
            e.printStackTrace();
            return ResponseEntity.status(500).body("An unexpected error occurred: " + e.getMessage());
        }
    }
}


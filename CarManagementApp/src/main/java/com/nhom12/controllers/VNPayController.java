//package com.nhom12.controllers;
//
//import com.nhom12.pojo.Payment;
//import com.nhom12.pojo.Subscription;
//import com.nhom12.services.PaymentService;
//import com.nhom12.services.SubscriptionService;
//import com.nhom12.utils.VNPayUtil;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import jakarta.servlet.http.HttpServletRequest;
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//
///**
// * VNPay Payment Controller
// *
// * @author HP
// */
//@RestController
//@RequestMapping("/api/payment/vnpay")
//@CrossOrigin(origins = "*")
//public class VNPayController {
//
//    @Autowired
//    private PaymentService paymentService;
//
//    @Autowired
//    private SubscriptionService subscriptionService;
//
//    /**
//     * Test VNPay configuration
//     */
//    @GetMapping("/test-config")
//    public ResponseEntity<Map<String, Object>> testConfig() {
//        Map<String, Object> response = new HashMap<>();
//        response.put("message", "VNPay configuration test");
//        response.put("timestamp", System.currentTimeMillis());
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    /**
//     * Fix subscription data issues
//     */
//    @PostMapping("/debug/fix-subscription/{id}")
//    public ResponseEntity<Map<String, Object>> fixSubscription(@PathVariable("id") int subscriptionId) {
//        Map<String, Object> response = new HashMap<>();
//
//        try {
//            Subscription subscription = subscriptionService.getSubscriptionsById(subscriptionId);
//            if (subscription == null) {
//                response.put("error", "Subscription not found");
//                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
//            }
//
//            // Fix logic: if paymentStatus is PAID, then isActive should be true
//            if ("PAID".equals(subscription.getPaymentStatus()) && !subscription.getIsActive()) {
//                subscription.setIsActive(true);
//                subscriptionService.updateSubscription(subscription);
//                response.put("message", "Fixed: Set isActive to true for PAID subscription");
//            } else if ("PENDING".equals(subscription.getPaymentStatus()) && subscription.getIsActive()) {
//                subscription.setIsActive(false);
//                subscriptionService.updateSubscription(subscription);
//                response.put("message", "Fixed: Set isActive to false for PENDING subscription");
//            } else {
//                response.put("message", "No fix needed - subscription status is consistent");
//            }
//
//            response.put("subscription", Map.of(
//                    "id", subscription.getId(),
//                    "isActive", subscription.getIsActive(),
//                    "paymentStatus", subscription.getPaymentStatus()));
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//
//        } catch (Exception e) {
//            response.put("error", "Error fixing subscription: " + e.getMessage());
//            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    /**
//     * Debug endpoint to check subscription and payment status
//     */
//    @GetMapping("/debug/subscription/{id}")
//    public ResponseEntity<Map<String, Object>> debugSubscription(@PathVariable("id") int subscriptionId) {
//        Map<String, Object> response = new HashMap<>();
//
//        try {
//            Subscription subscription = subscriptionService.getSubscriptionsById(subscriptionId);
//            if (subscription == null) {
//                response.put("error", "Subscription not found");
//                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
//            }
//
//            Payment payment = paymentService.getPaymentBySubscription(subscription);
//
//            response.put("subscription", Map.of(
//                    "id", subscription.getId(),
//                    "isActive", subscription.getIsActive(),
//                    "paymentStatus", subscription.getPaymentStatus(),
//                    "startDate", subscription.getStartDate(),
//                    "endDate", subscription.getEndDate(),
//                    "memberUsername", subscription.getMemberId().getUsername(),
//                    "packageName", subscription.getPackageId().getNamePack()));
//
//            if (payment != null) {
//                response.put("payment", Map.of(
//                        "id", payment.getId(),
//                        "status", payment.getStatus(),
//                        "method", payment.getMethod(),
//                        "price", payment.getPrice(),
//                        "paymentDate", payment.getPaymentDate()));
//            } else {
//                response.put("payment", "No payment record found");
//            }
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//
//        } catch (Exception e) {
//            response.put("error", "Error retrieving subscription: " + e.getMessage());
//            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    /**
//     * Create VNPay payment URL for subscription
//     */
//    @PostMapping("/create-payment/{subscriptionId}")
//    public ResponseEntity<Map<String, String>> createPayment(
//            @PathVariable("subscriptionId") int subscriptionId,
//            HttpServletRequest request) {
//
//        try {
//            Subscription subscription = subscriptionService.getSubscriptionsById(subscriptionId);
//            if (subscription == null) {
//                Map<String, String> response = new HashMap<>();
//                response.put("error", "Subscription not found");
//                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
//            }
//
//            // Check if subscription is already paid
//            if ("PAID".equals(subscription.getPaymentStatus())) {
//                Map<String, String> response = new HashMap<>();
//                response.put("error", "Subscription already paid");
//                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
//            }
//
//            String ipAddress = VNPayUtil.getIpAddress(request);
//            String paymentUrl = paymentService.createVNPayPaymentUrl(subscription, ipAddress);
//
//            // Create pending payment record
//            Payment payment = paymentService.getPaymentBySubscription(subscription);
//            if (payment == null) {
//                payment = new Payment();
//                payment.setSubscriptionId(subscription);
//                payment.setMethod("VNPAY");
//                payment.setStatus("PENDING");
//                payment.setPaymentDate(new Date());
//
//                // Calculate final price with discount
//                double originalPrice = subscription.getPackageId().getPrice();
//                double discount = subscription.getPackageId().getDiscount() != null
//                        ? subscription.getPackageId().getDiscount()
//                        : 0.0;
//                double finalPrice = originalPrice * (1 - discount / 100);
//                payment.setPrice(finalPrice);
//
//                paymentService.createPayment(payment);
//            }
//
//            Map<String, String> response = new HashMap<>();
//            response.put("paymentUrl", paymentUrl);
//            response.put("subscriptionId", String.valueOf(subscriptionId));
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            Map<String, String> response = new HashMap<>();
//            response.put("error", "Failed to create payment URL");
//            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    /**
//     * VNPay IPN (Instant Payment Notification) endpoint
//     * VNPay sends GET request, not POST
//     */
//    @GetMapping("/ipn")
//    public ResponseEntity<Map<String, String>> handleIPN(@RequestParam Map<String, String> params) {
//        Map<String, String> response = new HashMap<>();
//
//        try {
//            System.out.println("=== IPN ENDPOINT CALLED ===");
//            System.out.println("Received parameters: " + params);
//
//            boolean isValid = paymentService.processVNPayIPN(params);
//
//            if (isValid) {
//                response.put("RspCode", "00");
//                response.put("Message", "Confirm Success");
//                System.out.println("IPN Response: SUCCESS");
//            } else {
//                response.put("RspCode", "97");
//                response.put("Message", "Invalid signature or processing failed");
//                System.out.println("IPN Response: FAILED - Invalid signature or processing failed");
//            }
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//
//        } catch (Exception e) {
//            System.out.println("IPN Response: ERROR - " + e.getMessage());
//            e.printStackTrace();
//            response.put("RspCode", "99");
//            response.put("Message", "Unknown error");
//            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    /**
//     * Test endpoint to check if IPN URL is accessible
//     */
//    @GetMapping("/ipn/test")
//    public ResponseEntity<Map<String, String>> testIPN() {
//        Map<String, String> response = new HashMap<>();
//        response.put("status", "IPN endpoint is accessible via GET");
//        response.put("method", "GET");
//        response.put("timestamp", new Date().toString());
//        response.put("endpoint", "/api/payment/vnpay/ipn");
//        System.out.println("=== IPN Test Endpoint Called ===");
//        System.out.println("Method: GET");
//        System.out.println("Time: " + new Date());
//        System.out.println("Status: IPN endpoint is working correctly");
//        return new ResponseEntity<>(response, HttpStatus.OK);
//    }
//
//    /**
//     * Additional test endpoint to simulate IPN call with sample parameters
//     */
//    @GetMapping("/ipn/simulate")
//    public ResponseEntity<Map<String, String>> simulateIPN(
//            @RequestParam(name = "vnp_ResponseCode", defaultValue = "00") String vnp_ResponseCode,
//            @RequestParam(name = "vnp_TxnRef", defaultValue = "SUB1_123456789") String vnp_TxnRef) {
//
//        Map<String, String> testParams = new HashMap<>();
//        testParams.put("vnp_ResponseCode", vnp_ResponseCode);
//        testParams.put("vnp_TxnRef", vnp_TxnRef);
//        testParams.put("vnp_Amount", "30000000"); // 300,000 VND * 100
//        testParams.put("vnp_TransactionNo", "123456789");
//        testParams.put("vnp_PayDate", "20241201043853");
//
//        System.out.println("=== Simulating IPN Call ===");
//        System.out.println("Test parameters: " + testParams);
//
//        return handleIPN(testParams);
//    }
//
//    /**
//     * Handle VNPay return URL (for frontend processing)
//     */
//    @GetMapping("/return")
//    public ResponseEntity<Map<String, Object>> handleReturn(@RequestParam Map<String, String> params) {
//        Map<String, Object> response = new HashMap<>();
//
//        try {
//            String vnpResponseCode = params.get("vnp_ResponseCode");
//            String vnpTxnRef = params.get("vnp_TxnRef");
//
//            // Extract subscription ID from transaction reference
//            String subscriptionIdStr = vnpTxnRef.substring(3, vnpTxnRef.indexOf("_"));
//            int subscriptionId = Integer.parseInt(subscriptionIdStr);
//
//            Subscription subscription = subscriptionService.getSubscriptionsById(subscriptionId);
//
//            response.put("subscriptionId", subscriptionId);
//            response.put("responseCode", vnpResponseCode);
//            response.put("success", "00".equals(vnpResponseCode));
//
//            if (subscription != null) {
//                response.put("packageName", subscription.getPackageId().getNamePack());
//                response.put("amount", subscription.getPackageId().getPrice());
//            }
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            response.put("error", "Failed to process return");
//            response.put("success", false);
//            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//}

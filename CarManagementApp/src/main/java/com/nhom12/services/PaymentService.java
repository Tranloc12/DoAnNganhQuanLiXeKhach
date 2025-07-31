//package com.nhom12.services;
//
//import com.nhom12.pojo.Payment;
//import com.nhom12.pojo.Subscription;
//import java.util.Map;
//
///**
// * Payment Service Interface
// * 
// * @author HP
// */
//public interface PaymentService {
//
//    /**
//     * Create VNPay payment URL
//     * 
//     * @param subscription The subscription to create payment for
//     * @param ipAddress    Client IP address
//     * @return VNPay payment URL
//     */
//    String createVNPayPaymentUrl(Subscription subscription, String ipAddress);
//
//    /**
//     * Process VNPay IPN (Instant Payment Notification)
//     * 
//     * @param params VNPay IPN parameters
//     * @return Processing result
//     */
//    boolean processVNPayIPN(Map<String, String> params);
//
//    /**
//     * Create payment record
//     * 
//     * @param payment Payment entity
//     * @return Created payment
//     */
//    Payment createPayment(Payment payment);
//
//    /**
//     * Update payment status
//     * 
//     * @param payment Payment entity
//     * @return Updated payment
//     */
//    Payment updatePayment(Payment payment);
//
//    /**
//     * Get payment by subscription
//     * 
//     * @param subscription Subscription entity
//     * @return Payment entity
//     */
//    Payment getPaymentBySubscription(Subscription subscription);
//}

//package com.nhom12.services.impl;
//
//import com.nhom12.pojo.Payment;
//import com.nhom12.pojo.Subscription;
//import com.nhom12.repositories.PaymentRepository;
//import com.nhom12.services.PaymentService;
//import com.nhom12.services.SubscriptionService;
//import com.nhom12.utils.VNPayUtil;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.Date;
//import java.util.HashMap;
//import java.util.Map;
//
///**
// * Payment Service Implementation
// *
// * @author HP
// */
//@Service
//@Transactional
//public class PaymentServiceImpl implements PaymentService {
//
//    @Autowired
//    private PaymentRepository paymentRepository;
//
//    @Autowired
//    private SubscriptionService subscriptionService;
//
//    @Value("${vnpay.tmnCode}")
//    private String vnpTmnCode;
//
//    @Value("${vnpay.hashSecret}")
//    private String vnpHashSecret;
//
//    @Value("${vnpay.payUrl}")
//    private String vnpPayUrl;
//
//    @Value("${vnpay.returnUrl}")
//    private String vnpReturnUrl;
//
//    @Value("${vnpay.ipnUrl}")
//    private String vnpIpnUrl;
//
//    @Value("${vnpay.version}")
//    private String vnpVersion;
//
//    @Value("${vnpay.command}")
//    private String vnpCommand;
//
//    @Value("${vnpay.orderType}")
//    private String vnpOrderType;
//
//    @Override
//    public String createVNPayPaymentUrl(Subscription subscription, String ipAddress) {
//        Map<String, String> vnpParams = new HashMap<>();
//
//        // Calculate final price with discount
//        double originalPrice = subscription.getPackageId().getPrice();
//        double discount = subscription.getPackageId().getDiscount() != null ? subscription.getPackageId().getDiscount()
//                : 0.0;
//        double finalPrice = originalPrice * (1 - discount / 100);
//
//        // Validate required parameters
//        if (finalPrice <= 0) {
//            throw new IllegalArgumentException("Invalid amount: " + finalPrice);
//        }
//
//        String txnRef = "SUB" + subscription.getId() + "_" + System.currentTimeMillis();
//        String orderInfo = "Thanh toan goi tap: " + subscription.getPackageId().getNamePack();
//        String createDate = VNPayUtil.formatDateTime(new Date());
//        String formattedAmount = VNPayUtil.formatAmount(finalPrice);
//
//        // Ensure amount is at least 1000 VND (minimum for VNPay)
//        long amountInVND = (long) finalPrice;
//        if (amountInVND < 1000) {
//            throw new IllegalArgumentException("Amount must be at least 1000 VND, got: " + amountInVND);
//        }
//
//        vnpParams.put("vnp_Version", vnpVersion);
//        vnpParams.put("vnp_Command", vnpCommand);
//        vnpParams.put("vnp_TmnCode", vnpTmnCode);
//        vnpParams.put("vnp_Amount", formattedAmount);
//        vnpParams.put("vnp_CurrCode", "VND");
//        vnpParams.put("vnp_TxnRef", txnRef);
//        vnpParams.put("vnp_OrderInfo", orderInfo);
//        vnpParams.put("vnp_OrderType", vnpOrderType);
//        vnpParams.put("vnp_Locale", "vn");
//        vnpParams.put("vnp_ReturnUrl", vnpReturnUrl);
//        // Add IPN URL if configured
//        if (vnpIpnUrl != null && !vnpIpnUrl.trim().isEmpty()) {
//            vnpParams.put("vnp_IpnUrl", vnpIpnUrl);
//            System.out.println("IPN URL configured: " + vnpIpnUrl);
//        } else {
//            System.out.println("Warning: IPN URL not configured - payment status updates may not work automatically");
//        }
//        vnpParams.put("vnp_IpAddr", ipAddress);
//        vnpParams.put("vnp_CreateDate", createDate);
//
//        // Create secure hash
//        String queryUrl = VNPayUtil.getPaymentURL(vnpParams, true);
//        String vnpSecureHash = VNPayUtil.hmacSHA512(vnpHashSecret, queryUrl);
//        vnpParams.put("vnp_SecureHash", vnpSecureHash);
//
//        // Build final payment URL
//        String finalQueryUrl = VNPayUtil.getPaymentURL(vnpParams, false);
//        String fullPaymentUrl = vnpPayUrl + "?" + finalQueryUrl;
//
//        // Debug logging
//        System.out.println("=== VNPay Payment URL Debug ===");
//        System.out.println("Final Price: " + finalPrice);
//        System.out.println("Formatted Amount: " + VNPayUtil.formatAmount(finalPrice));
//        System.out.println("VNPay Parameters:");
//        vnpParams.forEach((key, value) -> System.out.println("  " + key + " = " + value));
//        System.out.println("Full Payment URL: " + fullPaymentUrl);
//        System.out.println("=== End Debug ===");
//
//        return fullPaymentUrl;
//    }
//
//    @Override
//    public boolean processVNPayIPN(Map<String, String> params) {
//        try {
//            System.out.println("=== VNPay IPN Processing Started ===");
//            System.out.println("IPN Parameters: " + params);
//
//            // Validate signature
//            if (!VNPayUtil.validateSignature(params, vnpHashSecret)) {
//                System.out.println("ERROR: Invalid signature in IPN");
//                return false;
//            }
//            System.out.println("Signature validation: PASSED");
//
//            String vnpResponseCode = params.get("vnp_ResponseCode");
//            String vnpTxnRef = params.get("vnp_TxnRef");
//            String vnpAmount = params.get("vnp_Amount");
//
//            System.out.println("Response Code: " + vnpResponseCode);
//            System.out.println("Transaction Ref: " + vnpTxnRef);
//            System.out.println("Amount: " + vnpAmount);
//
//            // Extract subscription ID from transaction reference
//            if (vnpTxnRef == null || !vnpTxnRef.startsWith("SUB") || !vnpTxnRef.contains("_")) {
//                System.out.println("ERROR: Invalid transaction reference format: " + vnpTxnRef);
//                return false;
//            }
//
//            String subscriptionIdStr = vnpTxnRef.substring(3, vnpTxnRef.indexOf("_"));
//            int subscriptionId = Integer.parseInt(subscriptionIdStr);
//            System.out.println("Extracted Subscription ID: " + subscriptionId);
//
//            Subscription subscription = subscriptionService.getSubscriptionsById(subscriptionId);
//            if (subscription == null) {
//                System.out.println("ERROR: Subscription not found with ID: " + subscriptionId);
//                return false;
//            }
//            System.out.println("Subscription found: " + subscription.getId());
//
//            // Create or update payment record
//            Payment payment = getPaymentBySubscription(subscription);
//            if (payment == null) {
//                payment = new Payment();
//                payment.setSubscriptionId(subscription);
//                payment.setMethod("VNPAY");
//                payment.setPaymentDate(new Date());
//
//                // Calculate final price with discount
//                double originalPrice = subscription.getPackageId().getPrice();
//                double discount = subscription.getPackageId().getDiscount() != null
//                        ? subscription.getPackageId().getDiscount()
//                        : 0.0;
//                double finalPrice = originalPrice * (1 - discount / 100);
//                payment.setPrice(finalPrice);
//            }
//
//            // Update payment status based on VNPay response
//            if ("00".equals(vnpResponseCode)) {
//                System.out.println("Payment SUCCESS - Updating subscription status");
//                payment.setStatus("COMPLETED");
//                subscription.setPaymentStatus("PAID");
//                subscription.setIsActive(true);
//            } else {
//                System.out.println("Payment FAILED - Response code: " + vnpResponseCode);
//                payment.setStatus("FAILED");
//                subscription.setPaymentStatus("FAILED");
//                subscription.setIsActive(false);
//            }
//
//            // Save payment and update subscription
//            try {
//                if (payment.getId() == null) {
//                    System.out.println("Creating new payment record");
//                    createPayment(payment);
//                } else {
//                    System.out.println("Updating existing payment record");
//                    updatePayment(payment);
//                }
//
//                System.out.println("Updating subscription with new status");
//                subscriptionService.updateSubscription(subscription);
//
//                System.out.println("=== IPN Processing COMPLETED SUCCESSFULLY ===");
//                return true;
//            } catch (Exception dbException) {
//                System.out.println("ERROR: Database operation failed: " + dbException.getMessage());
//                dbException.printStackTrace();
//                return false;
//            }
//
//        } catch (Exception e) {
//            System.out.println("ERROR: IPN Processing failed: " + e.getMessage());
//            e.printStackTrace();
//            return false;
//        }
//    }
//
//    @Override
//    public Payment createPayment(Payment payment) {
//        return paymentRepository.createPayment(payment);
//    }
//
//    @Override
//    public Payment updatePayment(Payment payment) {
//        return paymentRepository.updatePayment(payment);
//    }
//
//    @Override
//    public Payment getPaymentBySubscription(Subscription subscription) {
//        return paymentRepository.getPaymentBySubscription(subscription);
//    }
//}

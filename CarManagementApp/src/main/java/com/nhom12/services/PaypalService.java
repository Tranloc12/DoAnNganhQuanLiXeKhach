/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services; // Đảm bảo đúng package của bạn

import com.paypal.api.payments.*;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import com.nhom12.pojo.Booking;
import com.nhom12.pojo.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Quan trọng: Đảm bảo có import này

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class PaypalService {

    @Autowired
    private APIContext apiContext;

    // Đây là nơi bạn inject PaymentService của mình (là PaymentServiceImpl)
    @Autowired
    private PaymentService paymentService;

    /**
     * Tạo một yêu cầu thanh toán PayPal.
     * Phương thức này giao tiếp trực tiếp với PayPal API để tạo một giao dịch mới.
     *
     * @param total Tổng số tiền thanh toán.
     * @param currency Loại tiền tệ (ví dụ: "USD").
     * @param method Phương thức thanh toán (ví dụ: "paypal").
     * @param intent Mục đích thanh toán (ví dụ: "sale").
     * @param description Mô tả giao dịch.
     * @param cancelUrl URL mà PayPal sẽ chuyển hướng về nếu người dùng hủy thanh toán.
     * @param successUrl URL mà PayPal sẽ chuyển hướng về nếu người dùng thanh toán thành công.
     * @return Đối tượng Payment từ PayPal API sau khi tạo thành công.
     * @throws PayPalRESTException Nếu có lỗi khi giao tiếp với API PayPal.
     */
    public com.paypal.api.payments.Payment createPayment(
            Double total,
            String currency,
            String method,
            String intent,
            String description,
            String cancelUrl,
            String successUrl) throws PayPalRESTException {
        
        Amount amount = new Amount();
        amount.setCurrency(currency);
        amount.setTotal(String.format(Locale.US, "%.2f", total)); // Định dạng tổng số tiền

        Transaction transaction = new Transaction();
        transaction.setDescription(description);
        transaction.setAmount(amount);
        
        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(method);

        com.paypal.api.payments.Payment payment = new com.paypal.api.payments.Payment();
        payment.setIntent(intent);
        payment.setPayer(payer);
        payment.setTransactions(transactions);

        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(cancelUrl);
        redirectUrls.setReturnUrl(successUrl);
        payment.setRedirectUrls(redirectUrls);
        
        // Gọi API của PayPal để tạo thanh toán
        return payment.create(apiContext);
    }
    
    /**
     * Thực hiện thanh toán sau khi người dùng phê duyệt trên PayPal và lưu thông tin vào database của bạn.
     * Phương thức này được đánh dấu @Transactional để đảm bảo toàn bộ quá trình lưu và cập nhật database
     * (thông qua paymentService) là một giao dịch nguyên tử.
     *
     * @param paymentId ID của thanh toán do PayPal cung cấp.
     * @param payerId ID của người trả tiền do PayPal cung cấp sau khi phê duyệt.
     * @param bookingId ID của Booking liên quan trong hệ thống của bạn.
     * @return Đối tượng Payment đã được thực hiện từ PayPal API.
     * @throws PayPalRESTException Nếu có lỗi khi giao tiếp với API PayPal.
     * @throws RuntimeException Nếu không tìm thấy Booking với bookingId đã cho.
     */
    @Transactional // Rất quan trọng: Đảm bảo phương thức này chạy trong một giao dịch
    public com.paypal.api.payments.Payment executePaymentAndSaveToDb(String paymentId, String payerId, Integer bookingId) throws PayPalRESTException {
        // 1. Thực hiện thanh toán trên PayPal
        com.paypal.api.payments.Payment payment = new com.paypal.api.payments.Payment();
        payment.setId(paymentId);
        
        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId);
        
        com.paypal.api.payments.Payment executedPayment = payment.execute(apiContext, paymentExecution);
        
        // 2. Nếu thanh toán thành công trên PayPal, lưu vào DB của bạn thông qua PaymentService
        if ("approved".equals(executedPayment.getState())) {
            // Lấy thông tin Booking từ DB thông qua paymentService
            // Đảm bảo findBookingById() trong PaymentService có thể tìm thấy Booking
            Booking booking = paymentService.findBookingById(bookingId);
            
            if (booking == null) {
                throw new RuntimeException("Booking not found with ID: " + bookingId);
            }
            
            // Tạo đối tượng Payment local của bạn (com.nhom12.pojo.Payment)
            com.nhom12.pojo.Payment localPayment = new com.nhom12.pojo.Payment();
            localPayment.setBookingId(booking);
            localPayment.setPaymentDate(LocalDateTime.now());
            // Lấy tổng số tiền từ giao dịch PayPal đã thực hiện
            localPayment.setAmount(Double.parseDouble(executedPayment.getTransactions().get(0).getAmount().getTotal()));
            localPayment.setMethod("PayPal");
            localPayment.setStatus("paid"); // Cập nhật trạng thái thanh toán local
            // Tạo URL biên nhận từ ID giao dịch PayPal
            localPayment.setReceiptUrl("https://www.paypal.com/myaccount/transactions/" + executedPayment.getId()); 
            
            // Lưu Payment local vào database thông qua paymentService
            // Đảm bảo savePayment() trong PaymentService sử dụng Repository để lưu
            paymentService.savePayment(localPayment);

            // Cập nhật trạng thái Booking
            // Đảm bảo updateBookingStatus() trong PaymentService sử dụng Repository để cập nhật Booking
            booking.setPaymentStatus("paid"); // Trạng thái thanh toán của Booking
            booking.setBookingStatus("confirmed"); // Trạng thái đặt chỗ của Booking
            paymentService.updateBookingStatus(booking, "paid", "confirmed");
        }

        return executedPayment;
    }
}

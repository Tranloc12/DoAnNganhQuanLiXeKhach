package com.nhom12.repositories;

import com.nhom12.pojo.Payment;
import java.util.List;

public interface PaymentRepository {
    Payment addPayment(Payment payment);
    Payment getPaymentById(int paymentId);
    List<Payment> getPaymentsByBooking(int bookingId);
    // Các phương thức khác nếu cần
}
package com.nhom12.services.impl;

import com.nhom12.pojo.Booking;
import com.nhom12.pojo.Payment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Import cho quản lý giao dịch

import com.nhom12.repositories.PaymentRepository;

import com.nhom12.repositories.BookingRepository;

import com.nhom12.repositories.PaymentRepository;

import com.nhom12.services.PaymentService;
import java.util.List;

/**
 * Triển khai interface PaymentService. Chứa logic nghiệp vụ và tương tác với
 * các Repository.
 */
@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository; // Inject PaymentRepository

    @Autowired
    private BookingRepository bookingRepository; // Inject BookingRepository

    @Override
    @Transactional // Đảm bảo phương thức này chạy trong một giao dịch
    public void savePayment(Payment payment) {
        paymentRepository.saveOrUpdate(payment);
    }

    @Override
    @Transactional(readOnly = true) // Đảm bảo phương thức này chỉ đọc dữ liệu
    public Booking findBookingById(Integer bookingId) {
        return bookingRepository.findById(bookingId);
    }

    @Override
    @Transactional // Đảm bảo phương thức này chạy trong một giao dịch
    public void updateBookingStatus(Booking booking, String paymentStatus, String bookingStatus) {
        // Cập nhật các trường trạng thái của Booking
        booking.setPaymentStatus(paymentStatus);
        booking.setBookingStatus(bookingStatus);
        // Lưu các thay đổi vào database
        bookingRepository.update(booking);
    }

    @Override
    @Transactional(readOnly = true) // Đây là thao tác chỉ đọc
    public List<Payment> getPaymentHistory(int userId) {
        return paymentRepository.getPaymentsByUserId(userId);
    }
}

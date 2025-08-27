package com.nhom12.services;

import com.nhom12.pojo.Booking;
import com.nhom12.pojo.Payment;
import java.util.List;

public interface PaymentService {
     /**
     * Lưu thông tin Payment vào database.
     * @param payment Đối tượng Payment cần lưu.
     */
    void savePayment(Payment payment);

    /**
     * Tìm một Booking theo ID.
     * @param bookingId ID của Booking.
     * @return Đối tượng Booking tìm thấy.
     */
    Booking findBookingById(Integer bookingId);

    /**
     * Cập nhật trạng thái thanh toán và trạng thái đặt chỗ của Booking.
     * @param booking Đối tượng Booking cần cập nhật.
     * @param paymentStatus Trạng thái thanh toán mới (ví dụ: "paid").
     * @param bookingStatus Trạng thái đặt chỗ mới (ví dụ: "confirmed").
     */
    void updateBookingStatus(Booking booking, String paymentStatus, String bookingStatus);
    
      List<Payment> getPaymentHistory(int userId);
    
    
    
}

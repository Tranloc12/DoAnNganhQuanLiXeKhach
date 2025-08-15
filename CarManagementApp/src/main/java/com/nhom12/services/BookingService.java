/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services;

import com.nhom12.dto.TicketDetailDto;
import com.nhom12.pojo.Booking;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import java.util.List;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

public interface BookingService {
    
    // Phương thức tạo booking, cần giao dịch ghi (không readOnly)
    Booking createBooking(Trip trip, User user, int numberOfSeats, String seatNumbers);
    
    // Phương thức đọc dữ liệu, có thể là readOnly
    @Transactional(readOnly = true)
    List<Booking> getBookingsByUser(User user);
    
    // Phương thức đọc dữ liệu, có thể là readOnly
    @Transactional(readOnly = true)
    Booking getBookingById(int bookingId);
    
    // Phương thức hủy booking, thay đổi dữ liệu, KHÔNG readOnly
    // Nên đặt @Transactional ở tầng Service Implementation, không phải interface, 
    // nhưng nếu bạn muốn chỉ định ở đây thì bỏ readOnly = true
    boolean cancelBooking(int bookingId); 
    
    // Phương thức đọc tất cả booking, có thể có tham số lọc, có thể là readOnly
    @Transactional(readOnly = true) // Cập nhật để có readOnly = true
    List<Booking> getAllBookings(Map<String, String> params);
    
    // Phương thức cập nhật booking, thay đổi dữ liệu, KHÔNG readOnly
    boolean updateBooking(Booking booking);
    
    // Phương thức xóa booking, thay đổi dữ liệu, KHÔNG readOnly
    boolean deleteBooking(int bookingId);
    
    
     // PHƯƠNG THỨC MỚI ĐỂ LẤY THÔNG TIN VÉ
    
   
}

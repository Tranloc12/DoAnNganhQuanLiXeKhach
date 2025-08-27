package com.nhom12.services;

import com.nhom12.pojo.Booking;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import java.util.List;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

public interface BookingService {

    Booking createBooking(Trip trip, User user, int numberOfSeats, String seatNumbers);
    
    @Transactional(readOnly = true)
    List<Booking> getBookingsByUser(User user);
    
    // ⭐ Chú ý: Phương thức này nên trả về Optional nếu có thể, hoặc giữ nguyên Booking
    // Tuy nhiên, vì cancelBooking của bạn đang dùng Optional nên đây là lỗi
    @Transactional(readOnly = true)
    Booking getBookingById(int bookingId); 
    
    boolean cancelBooking(int bookingId);
    
    @Transactional(readOnly = true)
    List<Booking> getAllBookings(Map<String, String> params);
    
    boolean updateBooking(Booking booking);
    
    boolean deleteBooking(int bookingId);
    
    // ⭐ Khai báo phương thức này để triển khai bên dưới
    @Transactional(readOnly = true)
    List<String> getFcmTokensByTripId(int tripId);
    
}
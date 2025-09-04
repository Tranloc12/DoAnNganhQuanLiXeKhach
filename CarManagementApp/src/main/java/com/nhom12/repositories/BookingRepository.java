/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.Booking;
import com.nhom12.pojo.User;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface BookingRepository {

    Booking addBooking(Booking booking);

    List<Booking> getBookingsByUser(User user);

    boolean updateBooking(Booking booking);

    boolean deleteBooking(int bookingId);

    List<Booking> getAllBookings(Map<String, String> params);

    // Thêm phương thức này để trả về Optional<Booking>
    Optional<Booking> getBookingById(int bookingId);

    // Thêm phương thức này để cập nhật trạng thái
    void updateBookingStatus(int bookingId, String status);

    Booking findById(Integer id);

    void update(Booking booking);

    List<Booking> findByTripId(int tripId);

    // Thêm hàm lọc mới với các tham số cụ thể
  List<Booking> findBookings(String bookingStatus, String paymentStatus, Integer tripId, Integer userId, String origin, String destination, String username, Integer numberOfSeats, String seatNumbers, Double totalAmount);    
}

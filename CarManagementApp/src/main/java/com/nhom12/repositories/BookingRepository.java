/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.Booking;
import com.nhom12.pojo.User;
import java.util.List;
import java.util.Map;

public interface BookingRepository {
    Booking addBooking(Booking booking);
    Booking getBookingById(int bookingId);
    List<Booking> getBookingsByUser(User user);
    boolean updateBooking(Booking booking);
    boolean deleteBooking(int bookingId);
    List<Booking> getAllBookings(Map<String, String> params);
    
}
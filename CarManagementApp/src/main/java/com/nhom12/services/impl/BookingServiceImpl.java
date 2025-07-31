/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;

import com.nhom12.pojo.Booking;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import com.nhom12.repositories.BookingRepository;
import com.nhom12.repositories.UserRepository;
import com.nhom12.services.BookingService;
import com.nhom12.services.TripService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepo;
    @Autowired
    private TripService tripService;
    @Autowired
    private UserRepository userRepo;

    @Override
    @Transactional
    public Booking createBooking(Trip trip, User user, int numberOfSeats, String seatNumbers) {
        if (trip == null || user == null || numberOfSeats <= 0) {
            System.err.println("BookingServiceImpl: Dữ liệu đầu vào không hợp lệ cho createBooking.");
            return null;
        }
        if (trip.getAvailableSeats() == null || trip.getAvailableSeats() < numberOfSeats) {
             System.err.println("BookingServiceImpl: Không đủ ghế trên chuyến đi.");
             return null;
        }

        if (tripService.decreaseAvailableSeats(trip.getId(), numberOfSeats)) {
            Booking booking = new Booking();
            booking.setTripId(trip);
            booking.setUserId(user);
            booking.setNumberOfSeats(numberOfSeats);
            booking.setSeatNumbers(seatNumbers);
            booking.setBookingDate(LocalDateTime.now());
            booking.setTotalAmount(numberOfSeats * trip.getFare());
            booking.setPaymentStatus("Pending");
            booking.setBookingStatus("Confirmed");

            return bookingRepo.addBooking(booking);
        } else {
            System.err.println("BookingServiceImpl: Không thể giảm số ghế có sẵn. Có thể không đủ ghế hoặc lỗi database.");
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getBookingsByUser(User user) {
        return bookingRepo.getBookingsByUser(user);
    }

    @Override
    @Transactional
    public Booking getBookingById(int bookingId) {
        return bookingRepo.getBookingById(bookingId);
    }

    @Override
    @Transactional
    public boolean cancelBooking(int bookingId) {
        Booking booking = bookingRepo.getBookingById(bookingId);
        if (booking != null && !"Cancelled".equals(booking.getBookingStatus())) {
            if (tripService.increaseAvailableSeats(booking.getTripId().getId(), booking.getNumberOfSeats())) {
                booking.setBookingStatus("Cancelled");
                return bookingRepo.updateBooking(booking);
            } else {
                System.err.println("BookingServiceImpl: Không thể tăng số ghế có sẵn khi hủy booking.");
            }
        } else {
            System.err.println("BookingServiceImpl: Booking không tồn tại hoặc đã bị hủy.");
        }
        return false;
    }

    @Override
    public List<Booking> getAllBookings(Map<String, String> params) {
        return bookingRepo.getAllBookings(params);
    }

    @Override
    @Transactional
    public boolean updateBooking(Booking booking) {
        return bookingRepo.updateBooking(booking);
    }

    @Override
    @Transactional
    public boolean deleteBooking(int bookingId) {
        return bookingRepo.deleteBooking(bookingId);
    }
}
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
import java.util.Optional; // Cần import Optional
import java.util.stream.Collectors;

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
            // Thông báo lỗi này sẽ được in ra nếu trip, user là null hoặc numberOfSeats <= 0
            System.err.println("BookingServiceImpl: Dữ liệu đầu vào không hợp lệ cho createBooking (kiểm tra trip, user, numberOfSeats).");
            return null; // Khiến ApiBookingController trả về 500
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

            try {
                return bookingRepo.addBooking(booking);
            } catch (Exception e) {
                // Log chi tiết hơn về exception khi lưu vào DB
                System.err.println("BookingServiceImpl: Lỗi khi lưu booking vào database: " + e.getMessage());
                e.printStackTrace(); // In stack trace đầy đủ
                return null;
            }
        }
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> getBookingsByUser(User user
    ) {
        return bookingRepo.getBookingsByUser(user);
    }

    @Override
    @Transactional
    public boolean cancelBooking(int bookingId
    ) {
        Optional<Booking> optionalBooking = bookingRepo.getBookingById(bookingId);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            if (!"Cancelled".equals(booking.getBookingStatus())) {
                if (tripService.increaseAvailableSeats(booking.getTripId().getId(), booking.getNumberOfSeats())) {
                    booking.setBookingStatus("Cancelled");
                    return bookingRepo.updateBooking(booking);
                } else {
                    System.err.println("BookingServiceImpl: Không thể tăng số ghế có sẵn khi hủy booking.");
                }
            } else {
                System.err.println("BookingServiceImpl: Booking đã bị hủy.");
            }
        } else {
            System.err.println("BookingServiceImpl: Booking không tồn tại.");
        }
        return false;
    }

    @Override
    public List<Booking> getAllBookings(Map<String, String> params
    ) {
        return bookingRepo.getAllBookings(params);
    }

    @Override
    @Transactional
    public boolean updateBooking(Booking booking
    ) {
        return bookingRepo.updateBooking(booking);
    }

    @Override
    @Transactional
    public boolean deleteBooking(int bookingId
    ) {
        return bookingRepo.deleteBooking(bookingId);
    }


     @Override
    @Transactional(readOnly = true)
    public Booking getBookingById(int bookingId) {
        // Vì BookingRepository.getBookingById() trả về Optional,
        // nên ta cần lấy giá trị bên trong hoặc trả về null nếu không tìm thấy
        Optional<Booking> booking = bookingRepo.getBookingById(bookingId);
        return booking.orElse(null);
    }

    // ⭐ Triển khai phương thức từ interface
    @Override
    @Transactional(readOnly = true)
    public List<String> getFcmTokensByTripId(int tripId) {
        List<Booking> bookings = bookingRepo.findByTripId(tripId);

        return bookings.stream()
                .map(Booking::getUserId)
                .map(User::getFcmToken)
                .filter(token -> token != null && !token.isEmpty())
                .collect(Collectors.toList());
    }
}

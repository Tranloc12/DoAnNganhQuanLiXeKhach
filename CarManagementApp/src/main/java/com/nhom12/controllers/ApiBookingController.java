package com.nhom12.controllers;

import com.nhom12.dto.BookingRequest;
import com.nhom12.pojo.Booking;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import com.nhom12.services.BookingService;
import com.nhom12.services.TripService;
import com.nhom12.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class ApiBookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private TripService tripService;

    @Autowired
    private UserService userService;

    // Lấy tất cả booking (có thể thêm param lọc)
    @GetMapping
    public ResponseEntity<List<Booking>> getBookings(@RequestParam(required = false) Map<String, String> params) {
        return ResponseEntity.ok(bookingService.getAllBookings(params));
    }

    // Lấy booking theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable("id") int id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(booking);
    }

    // Lấy danh sách booking của user đang đăng nhập
    @GetMapping("/my")
    public ResponseEntity<?> getMyBookings(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập");
        }
        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy thông tin người dùng");
        }
        return ResponseEntity.ok(bookingService.getBookingsByUser(user));
    }

    // Tạo booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest bookingRequest, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập");
        }

        User user = userService.getUserByUsername(principal.getName());
        Trip trip = tripService.getTripById(bookingRequest.getTripId());

        // --- BẮT ĐẦU CÁC DÒNG LOG MỚI ĐỂ DEBUG ---
        System.out.println("--- Debug Booking Creation from Controller ---");
        System.out.println("Request body: tripId=" + bookingRequest.getTripId()
                + ", numberOfSeats=" + bookingRequest.getNumberOfSeats()
                + ", seatNumbers=" + bookingRequest.getSeatNumbers());
        System.out.println("Principal Name: " + (principal != null ? principal.getName() : "NULL"));
        System.out.println("User object fetched by username: " + (user != null ? "ID=" + user.getId() + ", Username=" + user.getUsername() : "NULL"));
        System.out.println("Trip object fetched by ID: " + (trip != null ? "ID=" + trip.getId() + ", Route=" + trip.getRouteId() : "NULL"));
        System.out.println("--------------------------------------------");
        // --- KẾT THÚC CÁC DÒNG LOG MỚI ---

        if (trip == null) {
            return ResponseEntity.badRequest().body("Chuyến đi không tồn tại");
        }
        // Kiểm tra user ở đây để trả về lỗi 404 thay vì 500 nếu user null
        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy thông tin người dùng đang đăng nhập.");
        }

        Booking booking = bookingService.createBooking(
                trip,
                user, // user đã được kiểm tra null ở trên
                bookingRequest.getNumberOfSeats(),
                bookingRequest.getSeatNumbers()
        );

        if (booking == null) {
            return ResponseEntity.status(500).body("Đặt chỗ thất bại. Vui lòng kiểm tra log server.");
        }
        return ResponseEntity.ok(booking);
    }

    // Hủy booking
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable("id") int id, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập");
        }

        User user = userService.getUserByUsername(principal.getName());
        Booking booking = bookingService.getBookingById(id);

        if (booking == null || !booking.getUserId().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Bạn không có quyền hủy đặt chỗ này");
        }

        boolean cancelled = bookingService.cancelBooking(id);
        if (!cancelled) {
            return ResponseEntity.status(400).body("Không thể hủy đặt chỗ");
        }

        return ResponseEntity.ok("Hủy đặt chỗ thành công");
    }
}

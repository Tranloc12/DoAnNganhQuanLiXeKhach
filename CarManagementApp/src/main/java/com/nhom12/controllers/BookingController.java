package com.nhom12.controllers;

import com.nhom12.pojo.Booking;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import com.nhom12.services.BookingService;
import com.nhom12.services.TripService;
import com.nhom12.services.UserService;
import java.security.Principal;
import java.util.HashMap; // <-- Thêm import này
import java.util.List;
import java.util.Map;     // <-- Thêm import này
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Comparator;

@Controller
public class BookingController {

    @Autowired
    private BookingService bookingService;
    @Autowired
    private TripService tripService;
    @Autowired
    private UserService userService;

    // Phương thức kiểm tra quyền Admin/Manager/Staff cho các chức năng quản lý
    private String checkManagementAccess(Principal principal) {
        if (principal == null) {
            return "redirect:/login"; // Chưa đăng nhập
        }
        User currentUser = userService.getUserByUsername(principal.getName());
        if (currentUser == null) {
            // Trường hợp này rất hiếm khi xảy ra nếu người dùng đã đăng nhập thành công
            return "redirect:/access-denied"; // Chuyển hướng đến trang báo lỗi quyền truy cập
        }
        // Kiểm tra xem người dùng có vai trò phù hợp không
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())
                && !"ROLE_MANAGER".equals(currentUser.getUserRole())
                && !"ROLE_STAFF".equals(currentUser.getUserRole())) {
            return "redirect:/access-denied"; // Không có quyền truy cập
        }
        return null; // Có quyền truy cập
    }

    @GetMapping("/trips/{tripId}/book")
    public String showBookingForm(@PathVariable("tripId") int tripId, Model model, RedirectAttributes redirectAttributes) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() instanceof String) {
            redirectAttributes.addFlashAttribute("errorMessage", "Bạn cần đăng nhập để đặt vé.");
            return "redirect:/login";
        }

        Trip trip = tripService.getTripById(tripId);
        if (trip == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Chuyến đi không tồn tại.");
            return "redirect:/";
        }

        if (trip.getAvailableSeats() == null || trip.getAvailableSeats() <= 0) {
            redirectAttributes.addFlashAttribute("errorMessage", "Chuyến đi không còn ghế trống.");
            return "redirect:/";
        }

        model.addAttribute("trip", trip);
        model.addAttribute("booking", new Booking());
        return "bookingForm";
    }

    @PostMapping("/trips/{tripId}/book")
    public String processBooking(@PathVariable("tripId") int tripId,
            @RequestParam("numberOfSeats") int numberOfSeats,
            @RequestParam("seatNumbers") String seatNumbers,
            Principal connectedUser,
            RedirectAttributes redirectAttributes) {

        User user = userService.getUserByUsername(connectedUser.getName());
        if (user == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return "redirect:/login";
        }

        Trip trip = tripService.getTripById(tripId);
        if (trip == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Chuyến đi không tồn tại.");
            return "redirect:/";
        }

        if (numberOfSeats <= 0) {
            redirectAttributes.addFlashAttribute("errorMessage", "Số lượng ghế không hợp lệ.");
            return "redirect:/trips/" + tripId + "/book";
        }

        Booking newBooking = bookingService.createBooking(trip, user, numberOfSeats, seatNumbers);

        if (newBooking != null) {
            redirectAttributes.addFlashAttribute("successMessage", "Đặt chỗ thành công! Mã đặt chỗ của bạn: " + newBooking.getId());
            return "redirect:/my-bookings";
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Có lỗi xảy ra trong quá trình đặt chỗ. Vui lòng kiểm tra lại số ghế hoặc thử lại.");
            return "redirect:/trips/" + tripId + "/book";
        }
    }

    @GetMapping("/my-bookings")
    public String showMyBookings(Model model, Principal connectedUser, RedirectAttributes redirectAttributes) {
        User user = userService.getUserByUsername(connectedUser.getName());
        if (user == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return "redirect:/login";
        }

        List<Booking> userBookings = bookingService.getBookingsByUser(user);
        model.addAttribute("bookings", userBookings);

        if (userBookings.isEmpty()) {
            model.addAttribute("infoMessage", "Bạn chưa có đặt chỗ nào.");
        }

        return "myBookings";
    }

    @PostMapping("/admin/bookings/cancel/{bookingId}")
    public String cancelBookingByAdmin(@PathVariable("bookingId") int bookingId,
            Principal principal,
            RedirectAttributes redirectAttributes) {

        // Kiểm tra quyền truy cập của Admin/Manager/Staff
        String accessCheck = checkManagementAccess(principal);
        if (accessCheck != null) {
            return accessCheck; // Chuyển hướng nếu không có quyền
        }

        Booking bookingToCancel = bookingService.getBookingById(bookingId);

        if (bookingToCancel == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy đặt chỗ này.");
            return "redirect:/admin/bookings";
        }

        if (bookingService.cancelBooking(bookingId)) {
            redirectAttributes.addFlashAttribute("successMessage", "Đã hủy đặt chỗ thành công!");
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Không thể hủy đặt chỗ. Có lỗi xảy ra.");
        }

        return "redirect:/admin/bookings";
    }

    @GetMapping("/admin/bookings")
    public String showAllBookings(Model model, Principal principal,
            @RequestParam(name = "bookingStatus", required = false) String bookingStatus,
            @RequestParam(name = "paymentStatus", required = false) String paymentStatus,
            @RequestParam(name = "tripId", required = false) Integer tripId,
            @RequestParam(name = "userId", required = false) Integer userId,
            @RequestParam(name = "origin", required = false) String origin,
            @RequestParam(name = "destination", required = false) String destination,
            @RequestParam(name = "username", required = false) String username,
            @RequestParam(name = "numberOfSeats", required = false) Integer numberOfSeats,
            @RequestParam(name = "seatNumbers", required = false) String seatNumbers,
            @RequestParam(name = "totalAmount", required = false) Double totalAmount
    ) {

        try {
            // Lấy danh sách đặt chỗ với các bộ lọc
            List<Booking> allBookings = bookingService.findBookings(bookingStatus, paymentStatus, tripId, userId, origin, destination, username, numberOfSeats, seatNumbers, totalAmount);
            allBookings.sort(Comparator.comparing(Booking::getId));
            // Thêm các thuộc tính để hiển thị lại trên giao diện người dùng
            model.addAttribute("bookings", allBookings);
            model.addAttribute("bookingStatus", bookingStatus);
            model.addAttribute("paymentStatus", paymentStatus);
            model.addAttribute("tripId", tripId);
            model.addAttribute("userId", userId);
            model.addAttribute("origin", origin);
            model.addAttribute("destination", destination);
            model.addAttribute("username", username);
            model.addAttribute("numberOfSeats", numberOfSeats);
            model.addAttribute("seatNumbers", seatNumbers);
            model.addAttribute("totalAmount", totalAmount);

            if (allBookings.isEmpty()) {
                model.addAttribute("infoMessage", "Không tìm thấy đặt chỗ nào phù hợp với các tiêu chí tìm kiếm.");
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi lấy tất cả đặt chỗ: " + e.getMessage());
            model.addAttribute("errorMessage", "Không thể tải danh sách đặt chỗ. Vui lòng thử lại sau.");
            // Không chuyển hướng, trả về trang hiện tại để hiển thị lỗi
            return "allBookings";
        }
        return "allBookings"; // Trả về trang khi mọi thứ OK
    }

    @GetMapping("/admin/bookings/detail/{bookingId}")
    public String viewBookingDetail(@PathVariable("bookingId") int bookingId,
            Model model,
            RedirectAttributes redirectAttributes,
            Principal principal
    ) {
        // Kiểm tra quyền truy cập
        String accessCheck = checkManagementAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        try {
            Booking booking = bookingService.getBookingById(bookingId);

            if (booking == null) {
                redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy đặt chỗ này.");
                return "redirect:/admin/bookings"; // Chuyển hướng về trang danh sách nếu không tìm thấy
            }

            model.addAttribute("booking", booking);
            return "bookingDetail"; // Tên file Thymeleaf để hiển thị chi tiết
        } catch (Exception e) {
            System.err.println("Lỗi khi xem chi tiết đặt chỗ: " + e.getMessage());
            redirectAttributes.addFlashAttribute("errorMessage", "Không thể tải chi tiết đặt chỗ. Vui lòng thử lại sau.");
            return "redirect:/admin/bookings";
        }
    }

}

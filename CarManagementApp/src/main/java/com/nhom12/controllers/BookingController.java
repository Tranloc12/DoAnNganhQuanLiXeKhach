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
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole()) &&
            !"ROLE_MANAGER".equals(currentUser.getUserRole()) &&
            !"ROLE_STAFF".equals(currentUser.getUserRole())) {
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

    @PostMapping("/my-bookings/cancel/{bookingId}")
    public String cancelBooking(@PathVariable("bookingId") int bookingId, Principal connectedUser, RedirectAttributes redirectAttributes) {
        User user = userService.getUserByUsername(connectedUser.getName());
        if (user == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
            return "redirect:/login";
        }

        Booking bookingToCancel = bookingService.getBookingById(bookingId);
        
        if (bookingToCancel == null || !bookingToCancel.getUserId().getId().equals(user.getId())) {
            redirectAttributes.addFlashAttribute("errorMessage", "Bạn không có quyền hoặc đặt chỗ này không tồn tại.");
            return "redirect:/my-bookings";
        }

        if (bookingService.cancelBooking(bookingId)) {
            redirectAttributes.addFlashAttribute("successMessage", "Đã hủy đặt chỗ thành công!");
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Không thể hủy đặt chỗ này. Có thể đã bị hủy trước đó, đã khởi hành, hoặc có lỗi.");
        }
        
        return "redirect:/my-bookings";
    }


    @GetMapping("/admin/bookings") // Đã đổi endpoint thành /admin/bookings
    public String showAllBookings(Model model, RedirectAttributes redirectAttributes, Principal principal,
                                  @RequestParam(name = "kw", required = false) String kw) { // Thêm @RequestParam cho từ khóa tìm kiếm
        // Kiểm tra quyền truy cập bằng phương thức riêng
        String accessCheck = checkManagementAccess(principal);
        if (accessCheck != null) {
            return accessCheck; // Chuyển hướng nếu người dùng không có quyền
        }

        try {
            // Khởi tạo Map để truyền các tham số tìm kiếm/phân trang
            Map<String, String> params = new HashMap<>();
            if (kw != null && !kw.trim().isEmpty()) {
                params.put("kw", kw.trim()); // Đảm bảo trim() để loại bỏ khoảng trắng thừa
            }
            // Bạn có thể thêm các tham số khác vào map ở đây nếu muốn lọc thêm
            // Ví dụ: params.put("status", "Confirmed");
            // params.put("page", "1"); // Ví dụ cho phân trang
            // params.put("pageSize", "10"); // Ví dụ cho phân trang

            // Gọi service với các tham số đã chuẩn bị
            List<Booking> allBookings = bookingService.getAllBookings(params);
            model.addAttribute("bookings", allBookings);
            model.addAttribute("kw", kw); // Truyền lại từ khóa tìm kiếm để giữ giá trị trên form

            if (allBookings.isEmpty()) {
                model.addAttribute("infoMessage", "Hiện chưa có đặt chỗ nào trong hệ thống.");
            }
        } catch (Exception e) {
            // Ghi log lỗi để phục vụ việc debug
            System.err.println("Lỗi khi lấy tất cả đặt chỗ: " + e.getMessage());
            redirectAttributes.addFlashAttribute("errorMessage", "Không thể tải danh sách đặt chỗ. Vui lòng thử lại sau.");
            return "redirect:/"; // Chuyển hướng về trang chủ hoặc trang lỗi
        }
        return "allBookings"; // Tên file Thymeleaf để hiển thị danh sách này
    }
    
    
    @GetMapping("/admin/bookings/detail/{bookingId}")
    public String viewBookingDetail(@PathVariable("bookingId") int bookingId,
                                    Model model,
                                    RedirectAttributes redirectAttributes,
                                    Principal principal) {
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
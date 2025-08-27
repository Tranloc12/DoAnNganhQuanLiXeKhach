/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
// src/main/java/com/nhom12/controllers/ReviewController.java
package com.nhom12.controllers;

import com.nhom12.pojo.Review;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import com.nhom12.services.ReviewService;
import com.nhom12.services.TripService;
import com.nhom12.services.UserService;
import java.security.Principal;
import java.time.LocalDateTime; // Đảm bảo import này
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class ReviewController {

    @Autowired
    private ReviewService reviewService;
    @Autowired
    private UserService userService;
    @Autowired
    private TripService tripService; 

    // Phương thức kiểm tra quyền Admin/Manager/Staff
    private String checkManagementAccess(Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }
        User currentUser = userService.getUserByUsername(principal.getName());
        if (currentUser == null) {
            return "redirect:/access-denied";
        }
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole()) &&
            !"ROLE_MANAGER".equals(currentUser.getUserRole()) &&
            !"ROLE_STAFF".equals(currentUser.getUserRole())) {
            return "redirect:/access-denied";
        }
        return null;
    }

    // Endpoint để hiển thị tất cả các đánh giá (dành cho admin/manager/staff)
    @GetMapping("/admin/reviews")
    public String showAllReviews(Model model, RedirectAttributes redirectAttributes, Principal principal,
                                 @RequestParam(name = "kw", required = false) String kw) {
        String accessCheck = checkManagementAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        try {
            Map<String, String> params = new HashMap<>();
            if (kw != null && !kw.trim().isEmpty()) {
                params.put("kw", kw.trim());
            }

            List<Review> allReviews = reviewService.getAllReviews(params);
            model.addAttribute("reviews", allReviews);
            model.addAttribute("kw", kw);

            if (allReviews.isEmpty()) {
                model.addAttribute("infoMessage", "Hiện chưa có đánh giá nào trong hệ thống.");
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi lấy tất cả đánh giá: " + e.getMessage());
            e.printStackTrace(); // In stack trace để debug
            redirectAttributes.addFlashAttribute("errorMessage", "Không thể tải danh sách đánh giá. Vui lòng thử lại sau.");
            return "redirect:/";
        }
        return "adminReviews";
    }

    // Endpoint để xóa một đánh giá (chỉ admin/manager/staff có quyền)
    @PostMapping("/admin/reviews/delete/{reviewId}")
    public String deleteReview(@PathVariable("reviewId") int reviewId, Principal principal, RedirectAttributes redirectAttributes) {
        String accessCheck = checkManagementAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        try {
            if (reviewService.deleteReview(reviewId)) {
                redirectAttributes.addFlashAttribute("successMessage", "Đánh giá đã được xóa thành công!");
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Không thể xóa đánh giá. Có thể đánh giá không tồn tại hoặc có lỗi.");
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi xóa đánh giá: " + e.getMessage());
            e.printStackTrace(); // In stack trace để debug
            redirectAttributes.addFlashAttribute("errorMessage", "Đã xảy ra lỗi khi xóa đánh giá.");
        }
        return "redirect:/admin/reviews";
    }

    // Ví dụ tạo Review (dành cho người dùng đã đăng nhập)
    @PostMapping("/trips/{tripId}/add-review")
    public String addReviewForTrip(@PathVariable("tripId") int tripId,
                                   @RequestParam("rating") int rating,
                                   @RequestParam("comment") String comment,
                                   Principal connectedUser,
                                   RedirectAttributes redirectAttributes) {
        if (connectedUser == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Bạn cần đăng nhập để đánh giá.");
            return "redirect:/login";
        }

        User user = userService.getUserByUsername(connectedUser.getName());
        Trip trip = tripService.getTripById(tripId);

        if (user == null || trip == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Thông tin người dùng hoặc chuyến đi không hợp lệ.");
            return "redirect:/trips/" + tripId;
        }

        Review review = new Review();
        review.setUserId(user);
        review.setTripId(trip);
        review.setRating(rating);
        review.setComment(comment);
        // createdAt sẽ được set tự động trong service hoặc constructor của Review

        if (reviewService.createReview(review) != null) {
            redirectAttributes.addFlashAttribute("successMessage", "Cảm ơn bạn đã gửi đánh giá!");
        } else {
            redirectAttributes.addFlashAttribute("errorMessage", "Không thể gửi đánh giá của bạn. Vui lòng thử lại.");
        }
        return "redirect:/trips/" + tripId;
    }
}
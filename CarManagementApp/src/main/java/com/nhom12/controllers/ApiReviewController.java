/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.pojo.Review;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import com.nhom12.services.ReviewService;
import com.nhom12.services.TripService;
import com.nhom12.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ApiReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserService userService;

    @Autowired
    private TripService tripService;

    // ✅ Lấy tất cả review (có thể filter bằng keyword ?kw=abc)
    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews(@RequestParam(required = false) String kw) {
        Map<String, String> params = new HashMap<>();
        if (kw != null && !kw.trim().isEmpty()) {
            params.put("kw", kw.trim());
        }
        return ResponseEntity.ok(reviewService.getAllReviews(params));
    }

    // ✅ Lấy review theo tripId
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<?> getReviewsByTrip(@PathVariable("tripId") int tripId) {
        Trip trip = tripService.getTripById(tripId); // ✅ Lấy đối tượng Trip từ ID
        if (trip == null) {
            return ResponseEntity.badRequest().body("Không tìm thấy chuyến đi");
        }
        List<Review> reviews = reviewService.getReviewsByTrip(trip);
        return ResponseEntity.ok(reviews);
    }

    // ✅ Lấy thông tin chi tiết của một review để hiển thị trên form chỉnh sửa
    @GetMapping("/{reviewId}")
    public ResponseEntity<?> getReviewById(@PathVariable("reviewId") int reviewId) {
        try {
            Review review = reviewService.getReviewById(reviewId);
            if (review == null) {
                return ResponseEntity.status(404).body("Không tìm thấy đánh giá.");
            }
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi máy chủ khi tải đánh giá.");
        }
    }

    // ✅ Tạo review (user phải đăng nhập)
    @PostMapping("/trip/{tripId}")
    public ResponseEntity<?> addReview(@PathVariable("tripId") int tripId,
            @RequestBody Map<String, Object> payload,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để đánh giá");
        }

        User user = userService.getUserByUsername(principal.getName());
        Trip trip = tripService.getTripById(tripId);

        if (user == null || trip == null) {
            return ResponseEntity.badRequest().body("Người dùng hoặc chuyến đi không hợp lệ");
        }

        int rating = (int) payload.get("rating");
        String comment = (String) payload.get("comment");

        Review review = new Review();
        review.setUserId(user);
        review.setTripId(trip);
        review.setRating(rating);
        review.setComment(comment);

        Review created = reviewService.createReview(review);
        return created != null ? ResponseEntity.ok(created)
                : ResponseEntity.status(500).body("Không thể tạo đánh giá");
    }

    // ✅ Xóa review (ADMIN, MANAGER, STAFF mới có quyền)
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable("reviewId") int reviewId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập");
        }

        User user = userService.getUserByUsername(principal.getName());
        if (user == null
                || (!"ROLE_ADMIN".equals(user.getUserRole())
                && !"ROLE_MANAGER".equals(user.getUserRole())
                && !"ROLE_STAFF".equals(user.getUserRole())
                && !"ROLE_PASSENGER".equals(user.getUserRole()))) {
            return ResponseEntity.status(403).body("Bạn không có quyền xóa đánh giá này");
        }

        boolean deleted = reviewService.deleteReview(reviewId);
        if (deleted) {
            return ResponseEntity.ok("Xóa đánh giá thành công");
        }
        return ResponseEntity.status(400).body("Không thể xóa đánh giá");
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<?> updateReview(@PathVariable("reviewId") int reviewId,
            @RequestBody Map<String, Object> payload,
            Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để chỉnh sửa đánh giá.");
        }

        User currentUser = userService.getUserByUsername(principal.getName());
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Thông tin người dùng không hợp lệ.");
        }

        Review existingReview = reviewService.getReviewById(reviewId);
        if (existingReview == null) {
            return ResponseEntity.status(404).body("Không tìm thấy đánh giá để chỉnh sửa.");
        }

        boolean isOwner = currentUser.getId().equals(existingReview.getUserId().getId());
        boolean isAdminOrStaff = "ROLE_PASSENGER".equals(currentUser.getUserRole());

        if (!isOwner && !isAdminOrStaff) {
            return ResponseEntity.status(403).body("Bạn không có quyền chỉnh sửa đánh giá này.");
        }

        if (payload.containsKey("rating")) {
            existingReview.setRating((int) payload.get("rating"));
        }
        if (payload.containsKey("comment")) {
            existingReview.setComment((String) payload.get("comment"));
        }

        Review updatedReview = reviewService.updateReview(existingReview);
        if (updatedReview != null) {
            return ResponseEntity.ok(updatedReview);
        }

        return ResponseEntity.status(500).body("Không thể cập nhật đánh giá. Vui lòng thử lại sau.");
    }
    
    @GetMapping("/my-reviews")
    public ResponseEntity<?> getMyReviews(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body("Bạn cần đăng nhập để xem đánh giá của mình.");
        }
        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.status(404).body("Không tìm thấy thông tin người dùng.");
        }
        List<Review> myReviews = reviewService.getReviewsByUser(user);
        return ResponseEntity.ok(myReviews);
    }

}

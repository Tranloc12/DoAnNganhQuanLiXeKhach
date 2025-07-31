///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.controllers;
//
///**
// *
// * @author admin
// */
//import com.nhom12.pojo.Review;
//import com.nhom12.services.ReviewService;
//import java.util.List;
//import java.util.Map;
//import java.util.HashMap;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/api/reviews")
//public class ApiReviewController {
//
//    @Autowired
//    private ReviewService reviewService;
//
//    @GetMapping
//    public ResponseEntity<List<Review>> getReviews(
//            @RequestParam(name = "subscriptionId", required = false) Integer subscriptionId,
//            @RequestParam(name = "rating", required = false) Integer rating) {
//        if (subscriptionId != null) {
//            return new ResponseEntity<>(reviewService.findBySubscriptionId(subscriptionId), HttpStatus.OK);
//        } else if (rating != null) {
//            return new ResponseEntity<>(reviewService.findByRating(rating), HttpStatus.OK);
//        }
//        return new ResponseEntity<>(reviewService.findAll(), HttpStatus.OK);
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Review> getReviewById(@PathVariable(name = "id") Integer id) {
//        Review review = reviewService.findById(id);
//        if (review != null) {
//            return new ResponseEntity<>(review, HttpStatus.OK);
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
//
//    @PostMapping
//    public ResponseEntity<Review> createReview(@RequestBody Review review) {
//        Review savedReview = reviewService.save(review);
//        return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<Review> updateReview(@PathVariable(name = "id") Integer id, @RequestBody Review review) {
//        Review existingReview = reviewService.findById(id);
//        if (existingReview != null) {
//            review.setId(id);
//            Review updatedReview = reviewService.update(review);
//            return new ResponseEntity<>(updatedReview, HttpStatus.OK);
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
//
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteReview(@PathVariable(name = "id") Integer id) {
//        Review review = reviewService.findById(id);
//        if (review != null) {
//            reviewService.delete(id);
//            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//        }
//        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//    }
//
//    @GetMapping("/average")
//    public ResponseEntity<Double> getAverageRating(@RequestParam(name = "subscriptionId") Integer subscriptionId) {
//        Double averageRating = reviewService.getAverageRatingBySubscriptionId(subscriptionId);
//        return new ResponseEntity<>(averageRating, HttpStatus.OK);
//    }
//
//    @GetMapping("/byMember")
//    public ResponseEntity<List<Review>> getReviewsByMember(@RequestParam(name = "memberId") Integer memberId) {
//        List<Review> reviews = reviewService.findByMemberId(memberId);
//        return new ResponseEntity<>(reviews, HttpStatus.OK);
//    }
//
//    @GetMapping("/byTrainer")
//    public ResponseEntity<List<Review>> getReviewsByTrainer(@RequestParam(name = "trainerId") Integer trainerId) {
//        List<Review> reviews = reviewService.findByTrainerId(trainerId);
//        return new ResponseEntity<>(reviews, HttpStatus.OK);
//    }
//
//    // Lấy reviews theo package với phân trang
//    @GetMapping("/byPackage")
//    public ResponseEntity<Map<String, Object>> getReviewsByPackage(
//            @RequestParam(name = "packageId") Integer packageId,
//            @RequestParam(name = "page", defaultValue = "0") int page,
//            @RequestParam(name = "size", defaultValue = "5") int size) {
//        try {
//            List<Review> reviews = reviewService.findByPackageIdWithPagination(packageId, page, size);
//            long totalElements = reviewService.countByPackageId(packageId);
//            int totalPages = (int) Math.ceil((double) totalElements / size);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("content", reviews);
//            response.put("totalElements", totalElements);
//            response.put("totalPages", totalPages);
//            response.put("currentPage", page);
//            response.put("size", size);
//
//            return new ResponseEntity<>(response, HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }
//
//    // Lấy rating trung bình theo package
//    @GetMapping("/averageByPackage")
//    public ResponseEntity<Double> getAverageRatingByPackage(@RequestParam(name = "packageId") Integer packageId) {
//        Double averageRating = reviewService.getAverageRatingByPackageId(packageId);
//        return new ResponseEntity<>(averageRating, HttpStatus.OK);
//    }
//
//}

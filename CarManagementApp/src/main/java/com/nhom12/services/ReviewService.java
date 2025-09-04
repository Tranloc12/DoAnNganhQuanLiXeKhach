/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
// src/main/java/com/nhom12/services/ReviewService.java
package com.nhom12.services;

import com.nhom12.pojo.Review;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

public interface ReviewService {

    Review createReview(Review review);

    @Transactional(readOnly = true)
    Review getReviewById(int reviewId);

    @Transactional(readOnly = true)
    List<Review> getReviewsByTrip(Trip trip);

    @Transactional(readOnly = true)
    List<Review> getReviewsByUser(User user);

    @Transactional
    Review updateReview(Review review);

    boolean deleteReview(int reviewId);

    @Transactional(readOnly = true)
    List<Review> getAllReviews(Map<String, String> params);

    List<Review> findReviews(String keyword, String username, Integer rating, LocalDateTime startDate, LocalDateTime endDate);
}

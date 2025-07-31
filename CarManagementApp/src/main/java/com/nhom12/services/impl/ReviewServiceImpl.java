/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
// src/main/java/com/nhom12/services/impl/ReviewServiceImpl.java
// src/main/java/com/nhom12/services/impl/ReviewServiceImpl.java
package com.nhom12.services.impl;

import com.nhom12.pojo.Review;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import com.nhom12.repositories.ReviewRepository;
import com.nhom12.services.ReviewService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    @Transactional
    public Review createReview(Review review) {
        review.setCreatedAt(LocalDateTime.now()); // Sử dụng createdAt
        return reviewRepository.addReview(review);
    }

    @Override
    @Transactional(readOnly = true)
    public Review getReviewById(int reviewId) {
        return reviewRepository.getReviewById(reviewId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> getReviewsByTrip(Trip trip) {
        return reviewRepository.getReviewsByTrip(trip);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> getReviewsByUser(User user) {
        return reviewRepository.getReviewsByUser(user);
    }

    @Override
    @Transactional
    public boolean updateReview(Review review) {
        return reviewRepository.updateReview(review);
    }

    @Override
    @Transactional
    public boolean deleteReview(int reviewId) {
        return reviewRepository.deleteReview(reviewId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> getAllReviews(Map<String, String> params) {
        return reviewRepository.getAllReviews(params);
    }
}
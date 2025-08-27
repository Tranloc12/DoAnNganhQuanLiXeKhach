/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.Review;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import java.util.List;
import java.util.Map;

/**
 *
 * @author HP
 */
public interface ReviewRepository {
     Review addReview(Review review);
    Review getReviewById(int reviewId);
    List<Review> getReviewsByTrip(Trip trip);
    List<Review> getReviewsByUser(User user);
    Review updateReview(Review review); 
    boolean deleteReview(int reviewId);
    List<Review> getAllReviews(Map<String, String> params); // Dùng cho admin view
}

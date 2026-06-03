// src/main/java/com/nhom12/repositories/impl/ReviewRepositoryImpl.java
package com.nhom12.repositories.impl;

import com.nhom12.pojo.Review;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import com.nhom12.repositories.ReviewRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

// Sử dụng org.hibernate.query.Query nếu bạn đã import nó.
// Hoặc javax.persistence.Query nếu bạn muốn nhất quán với JPA API.
// Hiện tại bạn đang dùng org.hibernate.query.Query, nên giữ nguyên.
import org.hibernate.Session;
import org.hibernate.query.Query; // Giữ nguyên import này
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class ReviewRepositoryImpl implements ReviewRepository {

    @Autowired
    private LocalSessionFactoryBean sessionFactory;

    protected Session getSession() {
        return this.sessionFactory.getObject().getCurrentSession();
    }

    @Override
    public Review addReview(Review review) {
        Session session = this.getSession();
        try {
            // Thay thế session.save(review) bằng session.persist(review)
            session.persist(review);
            // Sau khi persist, đối tượng review đã được gắn ID (nếu được tạo tự động)
            return review;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    @Override
    public Review getReviewById(int reviewId) {
        Session session = this.getSession();
        return session.get(Review.class, reviewId);
    }

    @Override
    public List<Review> getReviewsByTrip(Trip trip) {
        Session session = this.getSession();
        Query<Review> q = session.createQuery("FROM Review r WHERE r.tripId = :trip ORDER BY r.createdAt DESC", Review.class);
        q.setParameter("trip", trip);
        return q.getResultList();
    }

    @Override
    public List<Review> getReviewsByUser(User user) {
        Session session = this.getSession();
        Query<Review> q = session.createQuery("FROM Review r WHERE r.userId = :user ORDER BY r.createdAt DESC", Review.class);
        q.setParameter("user", user);
        return q.getResultList();
    }

    @Override
    public Review updateReview(Review review) { // ✅ Thay đổi kiểu trả về
        Session session = this.getSession();
        try {
            // Sử dụng session.merge() để cập nhật đối tượng
            session.merge(review);
            // Trả về đối tượng đã được cập nhật
            return review;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null; // ✅ Trả về null nếu có lỗi
        }
    }

    @Override
    public boolean deleteReview(int reviewId) {
        Session session = this.getSession();
        try {
            Review review = session.get(Review.class, reviewId);
            if (review != null) {
                // Thay thế session.delete(review) bằng session.remove(review)
                session.remove(review);
                return true;
            }
            return false;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Review> getAllReviews(Map<String, String> params) {
        Session session = this.getSession();
        StringBuilder hql = new StringBuilder("FROM Review r JOIN FETCH r.userId u JOIN FETCH r.tripId t JOIN FETCH t.routeId ro WHERE 1=1 ");

        if (params != null && !params.isEmpty()) {
            String kw = params.get("kw");
            if (kw != null && !kw.trim().isEmpty()) {
                hql.append(" AND (u.username LIKE :kw OR ro.origin LIKE :kw OR ro.destination LIKE :kw OR r.comment LIKE :kw) ");
            }
        }

        hql.append(" ORDER BY r.createdAt DESC");

        // Khi dùng Hibernate 6+, nên dùng Query<T> để có kiểu an toàn
        Query<Review> q = session.createQuery(hql.toString(), Review.class);

        if (params != null && !params.isEmpty()) {
            String kw = params.get("kw");
            if (kw != null && !kw.trim().isEmpty()) {
                q.setParameter("kw", "%" + kw.trim() + "%");
            }
        }

        if (params != null) {
            if (params.containsKey("page") && params.containsKey("pageSize")) {
                try {
                    int page = Integer.parseInt(params.get("page"));
                    int pageSize = Integer.parseInt(params.get("pageSize"));
                    q.setFirstResult((page - 1) * pageSize);
                    q.setMaxResults(pageSize);
                } catch (NumberFormatException e) {
                    System.err.println("Invalid pagination parameters: " + e.getMessage());
                }
            }
        }

        return q.getResultList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> findReviews(String keyword, String username, Integer rating, LocalDateTime startDate, LocalDateTime endDate) {
        Session session = this.getSession();
        try {
            StringBuilder hql = new StringBuilder(
                    "SELECT r FROM Review r "
                    + "JOIN FETCH r.userId u "
                    + "JOIN FETCH r.tripId t "
                    + "JOIN FETCH t.routeId ro "
                    + // Khai báo alias ro ở đây
                    "WHERE 1=1");
            
            List<String> paramNames = new ArrayList<>();
            List<Object> paramValues = new ArrayList<>();

            // Lọc theo từ khóa trong comment
            if (keyword != null && !keyword.isEmpty()) {
                hql.append(" AND (LOWER(CAST(r.comment as string)) LIKE :keyword "
                        + "OR LOWER(ro.origin) LIKE :keyword "
                        + "OR LOWER(ro.destination) LIKE :keyword)");
            }

            // Lọc theo username
            if (username != null && !username.isEmpty()) {
                hql.append(" AND LOWER(u.username) LIKE :username");
                paramNames.add("username");
                paramValues.add("%" + username.toLowerCase() + "%");
            }

            // Lọc theo rating
            if (rating != null) {
                hql.append(" AND r.rating = :rating");
                paramNames.add("rating");
                paramValues.add(rating);
            }

            // Lọc theo khoảng thời gian
            if (startDate != null) {
                hql.append(" AND r.createdAt >= :startDate");
                paramNames.add("startDate");
                paramValues.add(startDate);
            }
            if (endDate != null) {
                hql.append(" AND r.createdAt <= :endDate");
                paramNames.add("endDate");
                paramValues.add(endDate);
            }

            hql.append(" ORDER BY r.createdAt DESC");

            Query<Review> query = session.createQuery(hql.toString(), Review.class);
            for (int i = 0; i < paramNames.size(); i++) {
                query.setParameter(paramNames.get(i), paramValues.get(i));
            }

            return query.getResultList();
        } catch (Exception ex) {
            throw new RuntimeException("Error finding reviews", ex);
        }
    }
}

// src/main/java/com/nhom12/repositories/impl/ReviewRepositoryImpl.java
package com.nhom12.repositories.impl;

import com.nhom12.pojo.Review;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import com.nhom12.repositories.ReviewRepository;
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
    public boolean updateReview(Review review) {
        Session session = this.getSession();
        try {
            // Thay thế session.update(review) bằng session.merge(review)
            // merge trả về một instance mới đã được quản lý, nên bạn có thể cần gán lại
            session.merge(review); 
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
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
}
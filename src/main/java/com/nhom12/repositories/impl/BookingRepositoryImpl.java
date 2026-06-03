/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

import com.nhom12.pojo.Booking;
import com.nhom12.pojo.User;
import com.nhom12.repositories.BookingRepository;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class BookingRepositoryImpl implements BookingRepository {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    @Transactional
    public Booking addBooking(Booking booking) {
        try {
            getCurrentSession().persist(booking);
            return booking;
        } catch (Exception e) {
            System.err.println("Lỗi khi thêm booking: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public List<Booking> getBookingsByUser(User user) {
        Query<Booking> query = getCurrentSession().createQuery("SELECT b FROM Booking b JOIN FETCH b.tripId t JOIN FETCH b.userId u JOIN FETCH t.routeId r WHERE b.userId = :user ORDER BY b.bookingDate DESC", Booking.class);
        query.setParameter("user", user);
        return query.getResultList();
    }

    @Override
    @Transactional
    public boolean updateBooking(Booking booking) {
        try {
            getCurrentSession().merge(booking);
            return true;
        } catch (Exception e) {
            System.err.println("Lỗi khi cập nhật booking: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Override
    @Transactional
    public boolean deleteBooking(int bookingId) {
        try {
            Booking booking = getCurrentSession().get(Booking.class, bookingId);
            if (booking != null) {
                // Thay đổi trạng thái thay vì xóa
                booking.setBookingStatus("Cancelled");
                getCurrentSession().merge(booking);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Lỗi khi hủy booking: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public List<Booking> getAllBookings(Map<String, String> params) {
        StringBuilder hql = new StringBuilder("SELECT b FROM Booking b JOIN FETCH b.tripId t JOIN FETCH b.userId u JOIN FETCH t.routeId r WHERE 1=1");

        if (params != null) {
            String tripKeyword = params.get("tripKw");
            if (tripKeyword != null && !tripKeyword.isEmpty()) {
                hql.append(" AND r.routeName LIKE :tripKw");
            }
            String userKeyword = params.get("userKw");
            if (userKeyword != null && !userKeyword.isEmpty()) {
                hql.append(" AND u.username LIKE :userKw");
            }
            String bookingStatus = params.get("status");
            if (bookingStatus != null && !bookingStatus.isEmpty()) {
                hql.append(" AND b.bookingStatus = :bookingStatus");
            }
        }

        hql.append(" ORDER BY b.bookingDate DESC");

        Query<Booking> query = getCurrentSession().createQuery(hql.toString(), Booking.class);

        if (params != null) {
            String tripKeyword = params.get("tripKw");
            if (tripKeyword != null && !tripKeyword.isEmpty()) {
                query.setParameter("tripKw", "%" + tripKeyword + "%");
            }
            String userKeyword = params.get("userKw");
            if (userKeyword != null && !userKeyword.isEmpty()) {
                query.setParameter("userKw", "%" + userKeyword + "%");
            }
            String bookingStatus = params.get("status");
            if (bookingStatus != null && !bookingStatus.isEmpty()) {
                query.setParameter("bookingStatus", bookingStatus);
            }
        }
        return query.getResultList();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Booking> getBookingById(int bookingId) {
        return Optional.ofNullable(this.getCurrentSession().get(Booking.class, bookingId));
    }

    @Override
    @Transactional
    public void updateBookingStatus(int bookingId, String status) {
        Booking booking = this.getCurrentSession().get(Booking.class, bookingId);
        if (booking != null) {
            booking.setBookingStatus(status);
            this.getCurrentSession().merge(booking);

        }
    }

    @Override
    public Booking findById(Integer id) {
        // Lấy một đối tượng Booking theo ID
        return getCurrentSession().get(Booking.class, id);
    }

    @Override
    public void update(Booking booking) {
        // Cập nhật một đối tượng Booking trong database
        getCurrentSession().update(booking);
    }

    @Override
    public List<Booking> findByTripId(int tripId) {
        Query<Booking> query = getCurrentSession().createQuery("SELECT b FROM Booking b JOIN FETCH b.userId u WHERE b.tripId.id = :tripId", Booking.class);
        query.setParameter("tripId", tripId);
        return query.getResultList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Booking> findBookings(String bookingStatus, String paymentStatus, Integer tripId, Integer userId, String origin, String destination, String username, Integer numberOfSeats, String seatNumbers, Double totalAmount) {
        Session session = sessionFactory.getCurrentSession();
        StringBuilder hql = new StringBuilder(
                "SELECT b FROM Booking b "
                + "JOIN FETCH b.tripId t "
                + "JOIN FETCH b.userId u "
                + "JOIN FETCH t.routeId r "
                + "WHERE 1=1");

        // Thêm điều kiện lọc cho các trường bạn yêu cầu
        if (bookingStatus != null && !bookingStatus.isEmpty()) {
            hql.append(" AND b.bookingStatus = :bookingStatus");
        }
        if (paymentStatus != null && !paymentStatus.isEmpty()) {
            hql.append(" AND b.paymentStatus = :paymentStatus");
        }
        if (tripId != null) {
            hql.append(" AND b.tripId.id = :tripId");
        }
        if (userId != null) {
            hql.append(" AND b.userId.id = :userId");
        }
        if (origin != null && !origin.isEmpty()) {
            hql.append(" AND r.origin LIKE :origin");
        }
        if (destination != null && !destination.isEmpty()) {
            hql.append(" AND r.destination LIKE :destination");
        }
        if (username != null && !username.isEmpty()) {
            hql.append(" AND u.username LIKE :username");
        }
        if (numberOfSeats != null) {
            hql.append(" AND b.numberOfSeats = :numberOfSeats");
        }
        if (seatNumbers != null && !seatNumbers.isEmpty()) {
            hql.append(" AND b.seatNumbers LIKE :seatNumbers");
        }
        if (totalAmount != null) {
            hql.append(" AND b.totalAmount = :totalAmount");
        }

        hql.append(" ORDER BY b.bookingDate DESC");

        Query<Booking> query = session.createQuery(hql.toString(), Booking.class);

        // Gán tham số cho các điều kiện
        if (bookingStatus != null && !bookingStatus.isEmpty()) {
            query.setParameter("bookingStatus", bookingStatus);
        }
        if (paymentStatus != null && !paymentStatus.isEmpty()) {
            query.setParameter("paymentStatus", paymentStatus);
        }
        if (tripId != null) {
            query.setParameter("tripId", tripId);
        }
        if (userId != null) {
            query.setParameter("userId", userId);
        }
        if (origin != null && !origin.isEmpty()) {
            query.setParameter("origin", "%" + origin + "%");
        }
        if (destination != null && !destination.isEmpty()) {
            query.setParameter("destination", "%" + destination + "%");
        }
        if (username != null && !username.isEmpty()) {
            query.setParameter("username", "%" + username + "%");
        }
        if (numberOfSeats != null) {
            query.setParameter("numberOfSeats", numberOfSeats);
        }
        if (seatNumbers != null && !seatNumbers.isEmpty()) {
            query.setParameter("seatNumbers", "%" + seatNumbers + "%");
        }
        if (totalAmount != null) {
            query.setParameter("totalAmount", totalAmount);
        }

        return query.getResultList();
    }
}

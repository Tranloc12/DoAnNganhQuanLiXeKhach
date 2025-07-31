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
    public Booking getBookingById(int bookingId) {
        return getCurrentSession().get(Booking.class, bookingId);
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
                getCurrentSession().remove(booking);
                return true;
            }
            return false;
        } catch (Exception e) {
            System.err.println("Lỗi khi xóa booking: " + e.getMessage());
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
}
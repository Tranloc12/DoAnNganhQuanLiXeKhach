package com.nhom12.repositories.impl;

import com.nhom12.pojo.Payment;
import com.nhom12.repositories.PaymentRepository;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class PaymentRepositoryImpl implements PaymentRepository {

    @Autowired
    private SessionFactory sessionFactory;

    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    @Transactional
    public Payment addPayment(Payment payment) {
        try {
            getCurrentSession().persist(payment);
            return payment;
        } catch (Exception e) {
            System.err.println("Lỗi khi thêm payment: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public Payment getPaymentById(int paymentId) {
        return getCurrentSession().get(Payment.class, paymentId);
    }

    @Override
    public List<Payment> getPaymentsByBooking(int bookingId) {
        Query<Payment> query = getCurrentSession().createQuery("SELECT p FROM Payment p WHERE p.bookingId.id = :bookingId", Payment.class);
        query.setParameter("bookingId", bookingId);
        return query.getResultList();
    }
}
package com.nhom12.repositories.impl;

import com.nhom12.pojo.Payment;
import com.nhom12.repositories.PaymentRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Triển khai interface PaymentRepository sử dụng Hibernate Session. Các phương
 * thức của lớp này cần được gọi trong một ngữ cảnh giao dịch (transactional
 * context) được quản lý ở lớp Service để getCurrentSession() hoạt động chính
 * xác.
 */
@Repository
public class PaymentRepositoryImpl implements PaymentRepository {

    @Autowired
    private SessionFactory sessionFactory; // Được inject từ HibernateConfig

    /**
     * Lấy Session hiện tại từ SessionFactory. Phương thức này sẽ chỉ hoạt động
     * nếu có một Hibernate Session được liên kết với luồng hiện tại, thường là
     * do một giao dịch Spring đang hoạt động.
     *
     * @return Session hiện tại.
     */
    private Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }

    @Override
    public List<Payment> getPaymentsByUserId(int userId) {
        Session session = getCurrentSession();
        // Giả sử có một lớp BookingRepository
        // Để lấy được danh sách bookingId của người dùng, bạn cần truy vấn bảng Booking
        // Một cách khác là dùng HQL/SQL join để truy vấn trực tiếp
        String hql = "SELECT p FROM Payment p JOIN p.bookingId b WHERE b.userId.id = :userId ORDER BY p.paymentDate DESC";
        return session.createQuery(hql, Payment.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    @Override
    public List<Payment> findAll() {
        Session session = getCurrentSession();
        return session.createQuery("FROM Payment", Payment.class).getResultList();
    }

    @Override
    public Payment findById(int id) {
        Session session = getCurrentSession();
        return session.get(Payment.class, id);
    }

    @Override
    public void saveOrUpdate(Payment payment) {
        Session session = getCurrentSession();
        // Phương thức merge() sẽ quyết định save (nếu entity mới) hoặc update (nếu entity đã tồn tại/detached)
        session.merge(payment);
    }

    @Override
    public void delete(Payment payment) {
        Session session = getCurrentSession();
        session.delete(payment);
    }
    // Phương thức save() riêng biệt đã được loại bỏ để tránh trùng lặp với saveOrUpdate().
}

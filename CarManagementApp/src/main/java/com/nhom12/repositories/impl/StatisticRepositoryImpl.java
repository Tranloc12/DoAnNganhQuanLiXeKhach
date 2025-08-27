/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

import com.nhom12.repositories.StatisticRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class StatisticRepositoryImpl implements StatisticRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public long countActiveMembers() {
        Session session = sessionFactory.getCurrentSession();
        return session.createQuery("SELECT COUNT(*) FROM User WHERE userRole = :role AND isActive = :active", Long.class)
                .setParameter("role", "ROLE_MEMBER")
                .setParameter("active", true)
                .getSingleResult();
    }

    @Override
    public double calculateTotalRevenue() {
        Session session = sessionFactory.getCurrentSession();

        // Nhận kiểu Double, không ép kiểu BigDecimal
        Double revenue = (Double) session.createQuery(
                "SELECT SUM(p.price) FROM Payment p WHERE p.status = :status")
                .setParameter("status", "COMPLETED")
                .uniqueResult();

        if (revenue != null && revenue > 0) {
            return revenue;
        }

        Double estimatedRevenue = (Double) session.createQuery(
                "SELECT SUM(gp.price * (1 - COALESCE(gp.discount, 0) / 100)) FROM Subscription s JOIN s.packageId gp WHERE s.isActive = :active")
                .setParameter("active", true)
                .uniqueResult();

        return estimatedRevenue != null ? estimatedRevenue : 0.0;
    }

    @Override
    public Map<String, Integer> getGymUsageByTimeSlot() {
        Session session = sessionFactory.getCurrentSession();

        List<Object[]> results = session.createQuery(
                "SELECT "
                + "CASE "
                + "  WHEN HOUR(w.startTime) BETWEEN 6 AND 11 THEN 'Sáng (6:00-12:00)' "
                + "  WHEN HOUR(w.startTime) BETWEEN 12 AND 17 THEN 'Chiều (12:00-18:00)' "
                + "  WHEN HOUR(w.startTime) BETWEEN 18 AND 23 THEN 'Tối (18:00-23:00)' "
                + "  ELSE 'Khác' END, "
                + "COUNT(*) "
                + "FROM Workout w JOIN w.subscriptionId s "
                + "WHERE s.isActive = :active "
                + "GROUP BY "
                + "CASE "
                + "  WHEN HOUR(w.startTime) BETWEEN 6 AND 11 THEN 'Sáng (6:00-12:00)' "
                + "  WHEN HOUR(w.startTime) BETWEEN 12 AND 17 THEN 'Chiều (12:00-18:00)' "
                + "  WHEN HOUR(w.startTime) BETWEEN 18 AND 23 THEN 'Tối (18:00-23:00)' "
                + "  ELSE 'Khác' END", Object[].class)
                .setParameter("active", true)
                .getResultList();
        Map<String, Integer> gymUsage = new HashMap<>();
        for (Object[] row : results) {
            String timeSlot = (String) row[0];
            Number count = (Number) row[1]; // dùng Number để an toàn hơn với Long hoặc Integer
            gymUsage.put(timeSlot, count.intValue());
        }
        return gymUsage;
    }
}

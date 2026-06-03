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
        return session.createQuery("SELECT COUNT(*) FROM User WHERE userRole = :role", Long.class)
                .setParameter("role", "ROLE_PASSENGER")
                .getSingleResult();
    }

    @Override
    public double calculateTotalRevenue() {
        Session session = sessionFactory.getCurrentSession();
        Double revenue = (Double) session.createQuery(
                "SELECT SUM(b.totalAmount) FROM Booking b WHERE b.paymentStatus = :status")
                .setParameter("status", "Paid")
                .uniqueResult();
        return revenue != null ? revenue : 0.0;
    }

    @Override
    public Map<String, Integer> getGymUsageByTimeSlot() {
        Session session = sessionFactory.getCurrentSession();
        List<Object[]> results = session.createQuery(
                "SELECT "
                + "CASE "
                + "  WHEN HOUR(t.departureTime) BETWEEN 6 AND 11 THEN 'Sáng (6:00-11:59)' "
                + "  WHEN HOUR(t.departureTime) BETWEEN 12 AND 17 THEN 'Chiều (12:00-17:59)' "
                + "  WHEN HOUR(t.departureTime) BETWEEN 18 AND 23 THEN 'Tối (18:00-23:59)' "
                + "  ELSE 'Đêm (0:00-5:59)' END, "
                + "COUNT(t.id) "
                + "FROM Trip t "
                + "GROUP BY "
                + "CASE "
                + "  WHEN HOUR(t.departureTime) BETWEEN 6 AND 11 THEN 'Sáng (6:00-11:59)' "
                + "  WHEN HOUR(t.departureTime) BETWEEN 12 AND 17 THEN 'Chiều (12:00-17:59)' "
                + "  WHEN HOUR(t.departureTime) BETWEEN 18 AND 23 THEN 'Tối (18:00-23:59)' "
                + "  ELSE 'Đêm (0:00-5:59)' END", Object[].class)
                .getResultList();
        
        Map<String, Integer> usage = new HashMap<>();
        for (Object[] row : results) {
            String timeSlot = (String) row[0];
            Number count = (Number) row[1];
            usage.put(timeSlot, count.intValue());
        }
        return usage;
    }
}

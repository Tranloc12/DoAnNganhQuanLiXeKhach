package com.nhom12.controllers;

import com.nhom12.services.BookingService;
import com.nhom12.services.TripService;
import com.nhom12.services.UserService;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
@Transactional
public class ApiDashboardController {

    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private UserService userService;

    @Autowired
    private TripService tripService;

    // 📊 Tổng quan KPI cards
    @GetMapping("/overview")
    public ResponseEntity<?> getOverview() {
        Session session = sessionFactory.getCurrentSession();
        Map<String, Object> result = new LinkedHashMap<>();

        // Tổng doanh thu
        Double totalRevenue = (Double) session.createQuery(
                "SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
                .uniqueResult();
        result.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);

        // Tổng booking
        Long totalBookings = (Long) session.createQuery("SELECT COUNT(b) FROM Booking b").uniqueResult();
        result.put("totalBookings", totalBookings != null ? totalBookings : 0L);

        // Tổng khách hàng
        Long totalPassengers = (Long) session.createQuery(
                "SELECT COUNT(u) FROM User u WHERE u.userRole = 'ROLE_PASSENGER'").uniqueResult();
        result.put("totalPassengers", totalPassengers != null ? totalPassengers : 0L);

        // Tổng chuyến xe
        Long totalTrips = (Long) session.createQuery("SELECT COUNT(t) FROM Trip t").uniqueResult();
        result.put("totalTrips", totalTrips != null ? totalTrips : 0L);

        // Doanh thu tháng này
        int currentMonth = LocalDate.now().getMonthValue();
        int currentYear = LocalDate.now().getYear();
        Double monthRevenue = (Double) session.createQuery(
                "SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED' " +
                "AND MONTH(p.paymentDate) = :month AND YEAR(p.paymentDate) = :year")
                .setParameter("month", currentMonth)
                .setParameter("year", currentYear)
                .uniqueResult();
        result.put("monthRevenue", monthRevenue != null ? monthRevenue : 0.0);

        // Booking hôm nay
        Long todayBookings = (Long) session.createQuery(
                "SELECT COUNT(b) FROM Booking b WHERE DATE(b.bookingDate) = CURRENT_DATE").uniqueResult();
        result.put("todayBookings", todayBookings != null ? todayBookings : 0L);

        return ResponseEntity.ok(result);
    }

    // 📈 Doanh thu theo tháng (12 tháng trong năm)
    @GetMapping("/revenue/monthly")
    public ResponseEntity<?> getMonthlyRevenue(@RequestParam(defaultValue = "0") int year) {
        Session session = sessionFactory.getCurrentSession();
        if (year == 0) year = LocalDate.now().getYear();

        List<Object[]> rows = session.createQuery(
                "SELECT MONTH(p.paymentDate), SUM(p.amount) FROM Payment p " +
                "WHERE p.status = 'COMPLETED' AND YEAR(p.paymentDate) = :year " +
                "GROUP BY MONTH(p.paymentDate) ORDER BY MONTH(p.paymentDate)", Object[].class)
                .setParameter("year", year)
                .getResultList();

        // Khởi tạo 12 tháng = 0
        double[] monthlyData = new double[12];
        for (Object[] row : rows) {
            int month = ((Number) row[0]).intValue() - 1;
            double revenue = ((Number) row[1]).doubleValue();
            monthlyData[month] = revenue;
        }

        List<Map<String, Object>> result = new ArrayList<>();
        String[] monthNames = {"Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6",
                               "Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"};
        for (int i = 0; i < 12; i++) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("month", monthNames[i]);
            entry.put("revenue", monthlyData[i]);
            result.add(entry);
        }
        return ResponseEntity.ok(result);
    }

    // 📊 Doanh thu theo ngày (30 ngày gần nhất)
    @GetMapping("/revenue/daily")
    public ResponseEntity<?> getDailyRevenue() {
        Session session = sessionFactory.getCurrentSession();

        List<Object[]> rows = session.createQuery(
                "SELECT DATE(p.paymentDate), SUM(p.amount), COUNT(p) FROM Payment p " +
                "WHERE p.status = 'COMPLETED' AND p.paymentDate >= :startDate " +
                "GROUP BY DATE(p.paymentDate) ORDER BY DATE(p.paymentDate)", Object[].class)
                .setParameter("startDate", LocalDate.now().minusDays(29).atStartOfDay())
                .getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", row[0].toString());
            entry.put("revenue", ((Number) row[1]).doubleValue());
            entry.put("count", ((Number) row[2]).longValue());
            result.add(entry);
        }
        return ResponseEntity.ok(result);
    }

    // 🏆 Top chuyến xe doanh thu cao nhất
    @GetMapping("/top-trips")
    public ResponseEntity<?> getTopTrips(@RequestParam(defaultValue = "5") int limit) {
        Session session = sessionFactory.getCurrentSession();

        List<Object[]> rows = session.createQuery(
                "SELECT t.id, r.routeName, COUNT(b), SUM(b.totalAmount) " +
                "FROM Booking b JOIN b.tripId t JOIN t.routeId r " +
                "GROUP BY t.id, r.routeName ORDER BY SUM(b.totalAmount) DESC", Object[].class)
                .setMaxResults(limit)
                .getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("tripId", row[0]);
            entry.put("routeName", row[1]);
            entry.put("totalBookings", ((Number) row[2]).longValue());
            entry.put("totalRevenue", ((Number) row[3]).doubleValue());
            result.add(entry);
        }
        return ResponseEntity.ok(result);
    }

    // 🚌 Tỷ lệ lấp đầy theo tuyến đường
    @GetMapping("/occupancy")
    public ResponseEntity<?> getOccupancyByRoute() {
        Session session = sessionFactory.getCurrentSession();

        List<Object[]> rows = session.createQuery(
                "SELECT r.routeName, " +
                "AVG(CAST(t.totalBookedSeats AS double) / CAST((t.totalBookedSeats + t.availableSeats) AS double) * 100) " +
                "FROM Trip t JOIN t.routeId r " +
                "WHERE (t.totalBookedSeats + t.availableSeats) > 0 " +
                "GROUP BY r.routeName ORDER BY 2 DESC", Object[].class)
                .getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("routeName", row[0]);
            entry.put("occupancyRate", row[1] != null ? Math.round(((Number)row[1]).doubleValue() * 10.0) / 10.0 : 0.0);
            result.add(entry);
        }
        return ResponseEntity.ok(result);
    }

    // 📊 Thống kê booking theo trạng thái
    @GetMapping("/bookings/status")
    public ResponseEntity<?> getBookingsByStatus() {
        Session session = sessionFactory.getCurrentSession();

        List<Object[]> rows = session.createQuery(
                "SELECT b.paymentStatus, COUNT(b) FROM Booking b GROUP BY b.paymentStatus", Object[].class)
                .getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("status", row[0] != null ? row[0] : "UNKNOWN");
            entry.put("count", ((Number) row[1]).longValue());
            result.add(entry);
        }
        return ResponseEntity.ok(result);
    }

    // 📅 Booking theo giờ trong ngày (heat map)
    @GetMapping("/bookings/hourly")
    public ResponseEntity<?> getBookingsByHour() {
        Session session = sessionFactory.getCurrentSession();

        List<Object[]> rows = session.createQuery(
                "SELECT HOUR(b.bookingDate), COUNT(b) FROM Booking b " +
                "GROUP BY HOUR(b.bookingDate) ORDER BY HOUR(b.bookingDate)", Object[].class)
                .getResultList();

        int[] hourlyData = new int[24];
        for (Object[] row : rows) {
            int hour = ((Number) row[0]).intValue();
            hourlyData[hour] = ((Number) row[1]).intValue();
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (int i = 0; i < 24; i++) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("hour", i + ":00");
            entry.put("bookings", hourlyData[i]);
            result.add(entry);
        }
        return ResponseEntity.ok(result);
    }
}

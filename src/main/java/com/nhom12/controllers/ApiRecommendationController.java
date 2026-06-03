package com.nhom12.controllers;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Feature #7: AI Trip Recommendation (Gợi ý chuyến thông minh)
 * - Phân tích lịch sử đặt vé
 * - Gợi ý tuyến đường hay đặt nhất
 * - Collaborative filtering đơn giản
 */
@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin
@Transactional
public class ApiRecommendationController {

    @Autowired
    private SessionFactory sessionFactory;

    /**
     * GET /api/recommendations/trips?userId=...
     * Gợi ý chuyến xe cho user dựa trên:
     * 1. Lịch sử đặt vé của user
     * 2. Tuyến đường phổ biến với user tương tự
     * 3. Chuyến xe phổ biến toàn hệ thống (fallback)
     */
    @GetMapping("/trips")
    public ResponseEntity<?> getRecommendedTrips(
            @RequestParam(required = false) String username,
            @RequestParam(defaultValue = "5") int limit) {

        Session s = sessionFactory.getCurrentSession();
        List<Map<String, Object>> recommendations = new ArrayList<>();

        // Strategy 1: Dựa vào tuyến hay đặt của user
        if (username != null && !username.isEmpty()) {
            List<Object[]> userFavRoutes = s.createNativeQuery(
                    "SELECT t.id, r.routeName, r.origin, r.destination, t.fare, t.availableSeats, " +
                    "t.departureTime, COUNT(*) as bookCount " +
                    "FROM booking b JOIN trip t ON b.tripId = t.id JOIN route r ON t.routeId = r.id " +
                    "JOIN user u ON b.userId = u.id " +
                    "WHERE u.username = :u AND t.availableSeats > 0 AND t.status = 'Scheduled' " +
                    "GROUP BY t.id, r.routeName, r.origin, r.destination, t.fare, t.availableSeats, t.departureTime " +
                    "ORDER BY COUNT(*) DESC LIMIT :lim")
                    .setParameter("u", username).setParameter("lim", limit).getResultList();

            for (Object[] row : userFavRoutes) {
                recommendations.add(buildTripMap(row, "⭐ Tuyến bạn hay đặt"));
            }
        }

        // Strategy 2: Top trending trips toàn hệ thống (nếu chưa đủ limit)
        if (recommendations.size() < limit) {
            int remaining = limit - recommendations.size();
            List<Object[]> trending = s.createNativeQuery(
                    "SELECT t.id, r.routeName, r.origin, r.destination, t.fare, t.availableSeats, " +
                    "t.departureTime, COUNT(b.id) as bookCount " +
                    "FROM trip t JOIN route r ON t.routeId = r.id " +
                    "LEFT JOIN booking b ON b.tripId = t.id " +
                    "WHERE t.availableSeats > 0 AND t.status = 'Scheduled' " +
                    "GROUP BY t.id, r.routeName, r.origin, r.destination, t.fare, t.availableSeats, t.departureTime " +
                    "ORDER BY COUNT(b.id) DESC LIMIT :lim")
                    .setParameter("lim", remaining).getResultList();

            for (Object[] row : trending) {
                // Tránh trùng lặp
                int tripId = ((Number) row[0]).intValue();
                boolean exists = recommendations.stream().anyMatch(m -> m.get("tripId").equals(tripId));
                if (!exists) {
                    recommendations.add(buildTripMap(row, "🔥 Đang hot"));
                }
            }
        }

        // Strategy 3: Chuyến sắp khởi hành sớm (urgency)
        if (recommendations.size() < limit) {
            List<Object[]> upcoming = s.createNativeQuery(
                    "SELECT t.id, r.routeName, r.origin, r.destination, t.fare, t.availableSeats, " +
                    "t.departureTime, t.availableSeats as avail " +
                    "FROM trip t JOIN route r ON t.routeId = r.id " +
                    "WHERE t.availableSeats BETWEEN 1 AND 5 AND t.status = 'Scheduled' " +
                    "ORDER BY t.departureTime ASC LIMIT 3")
                    .getResultList();

            for (Object[] row : upcoming) {
                int tripId = ((Number) row[0]).intValue();
                boolean exists = recommendations.stream().anyMatch(m -> m.get("tripId").equals(tripId));
                if (!exists) {
                    recommendations.add(buildTripMap(row, "⚡ Sắp hết chỗ!"));
                }
            }
        }

        return ResponseEntity.ok(Map.of(
                "recommendations", recommendations,
                "total", recommendations.size(),
                "generatedAt", new Date().toString()
        ));
    }

    /**
     * GET /api/recommendations/popular-routes
     * Top tuyến đường được đặt nhiều nhất
     */
    @GetMapping("/popular-routes")
    public ResponseEntity<?> getPopularRoutes() {
        Session s = sessionFactory.getCurrentSession();
        List<Object[]> rows = s.createNativeQuery(
                "SELECT r.id, r.routeName, r.origin, r.destination, COUNT(b.id) as totalBookings, " +
                "AVG(t.fare) as avgFare " +
                "FROM route r JOIN trip t ON t.routeId = r.id " +
                "LEFT JOIN booking b ON b.tripId = t.id " +
                "GROUP BY r.id, r.routeName, r.origin, r.destination " +
                "ORDER BY COUNT(b.id) DESC LIMIT 8")
                .getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("routeId", row[0]);
            item.put("routeName", row[1]);
            item.put("origin", row[2]);
            item.put("destination", row[3]);
            item.put("totalBookings", row[4] != null ? ((Number)row[4]).longValue() : 0);
            item.put("avgFare", row[5] != null ? Math.round(((Number)row[5]).doubleValue()) : 0);
            result.add(item);
        }
        return ResponseEntity.ok(result);
    }

    private Map<String, Object> buildTripMap(Object[] row, String tag) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("tripId", ((Number) row[0]).intValue());
        m.put("routeName", row[1]);
        m.put("origin", row[2]);
        m.put("destination", row[3]);
        m.put("fare", row[4] != null ? ((Number)row[4]).doubleValue() : 0);
        m.put("availableSeats", row[5] != null ? ((Number)row[5]).intValue() : 0);
        m.put("departureTime", row[6] != null ? row[6].toString() : null);
        m.put("tag", tag);
        return m;
    }
}

package com.nhom12.controllers;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Feature #4: Loyalty Points (Điểm thưởng tích lũy)
 * - Tự động cộng điểm khi booking xác nhận
 * - Xem lịch sử điểm
 * - Quy đổi điểm lấy voucher giảm giá
 *
 * Rule: 1,000 VNĐ = 1 điểm | 100 điểm = giảm 10,000 VNĐ
 */
@RestController
@RequestMapping("/api/loyalty")
@CrossOrigin
@Transactional
public class ApiLoyaltyController {

    @Autowired
    private SessionFactory sessionFactory;

    // ────────────────────────────────────────────────
    // GET /api/loyalty/my-points  → Xem điểm của tôi
    // ────────────────────────────────────────────────
    @GetMapping("/my-points")
    public ResponseEntity<?> getMyPoints(Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Chưa đăng nhập"));
        Session s = sessionFactory.getCurrentSession();

        // Tổng điểm hiện có
        Number total = (Number) s.createNativeQuery(
                "SELECT COALESCE(SUM(points), 0) FROM loyalty_points WHERE user_id = (SELECT id FROM user WHERE username = :u) AND type = 'EARN'")
                .setParameter("u", principal.getName()).uniqueResult();
        Number used = (Number) s.createNativeQuery(
                "SELECT COALESCE(SUM(points), 0) FROM loyalty_points WHERE user_id = (SELECT id FROM user WHERE username = :u) AND type = 'REDEEM'")
                .setParameter("u", principal.getName()).uniqueResult();

        long totalPoints = total != null ? total.longValue() : 0;
        long usedPoints = used != null ? used.longValue() : 0;
        long balance = totalPoints - usedPoints;

        // Lịch sử điểm
        List<Object[]> history = s.createNativeQuery(
                "SELECT lp.points, lp.type, lp.description, lp.created_at " +
                "FROM loyalty_points lp JOIN user u ON lp.user_id = u.id " +
                "WHERE u.username = :u ORDER BY lp.created_at DESC LIMIT 20")
                .setParameter("u", principal.getName()).getResultList();

        List<Map<String, Object>> historyList = new ArrayList<>();
        for (Object[] row : history) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("points", row[0]);
            item.put("type", row[1]);
            item.put("description", row[2]);
            item.put("createdAt", row[3] != null ? row[3].toString() : null);
            historyList.add(item);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("balance", balance);
        result.put("totalEarned", totalPoints);
        result.put("totalUsed", usedPoints);
        result.put("cashValue", balance * 100); // 1 điểm = 100 VNĐ
        result.put("history", historyList);
        return ResponseEntity.ok(result);
    }

    // ────────────────────────────────────────────────
    // POST /api/loyalty/earn  → Cộng điểm sau booking
    // ────────────────────────────────────────────────
    @PostMapping("/earn")
    public ResponseEntity<?> earnPoints(@RequestBody Map<String, Object> payload, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Chưa đăng nhập"));
        Session s = sessionFactory.getCurrentSession();

        double amount = payload.get("amount") != null ? Double.parseDouble(payload.get("amount").toString()) : 0;
        int bookingId = payload.get("bookingId") != null ? Integer.parseInt(payload.get("bookingId").toString()) : 0;
        long points = (long) (amount / 1000); // 1,000 VNĐ = 1 điểm

        if (points <= 0) return ResponseEntity.badRequest().body(Map.of("error", "Số tiền không đủ để tích điểm"));

        // Kiểm tra đã cộng điểm cho booking này chưa
        Number existing = (Number) s.createNativeQuery(
                "SELECT COUNT(*) FROM loyalty_points WHERE booking_id = :bid")
                .setParameter("bid", bookingId).uniqueResult();
        if (existing != null && existing.intValue() > 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Đã cộng điểm cho booking này rồi"));
        }

        s.createNativeQuery(
                "INSERT INTO loyalty_points (user_id, booking_id, points, type, description, created_at) " +
                "VALUES ((SELECT id FROM user WHERE username = :u), :bid, :pts, 'EARN', :desc, NOW())")
                .setParameter("u", principal.getName())
                .setParameter("bid", bookingId)
                .setParameter("pts", points)
                .setParameter("desc", "Tích điểm từ booking #" + bookingId + " - " + String.format("%,.0f", amount) + "đ")
                .executeUpdate();

        return ResponseEntity.ok(Map.of("message", "Tích thành công " + points + " điểm!", "pointsEarned", points));
    }

    // ────────────────────────────────────────────────
    // POST /api/loyalty/redeem  → Đổi điểm lấy voucher
    // ────────────────────────────────────────────────
    @PostMapping("/redeem")
    public ResponseEntity<?> redeemPoints(@RequestBody Map<String, Integer> payload, Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Chưa đăng nhập"));
        Session s = sessionFactory.getCurrentSession();

        int pointsToRedeem = payload.getOrDefault("points", 0);
        if (pointsToRedeem < 100) return ResponseEntity.badRequest().body(Map.of("error", "Cần tối thiểu 100 điểm để đổi"));

        // Kiểm tra số dư
        Number balance = (Number) s.createNativeQuery(
                "SELECT COALESCE(SUM(CASE WHEN type='EARN' THEN points ELSE -points END), 0) " +
                "FROM loyalty_points WHERE user_id = (SELECT id FROM user WHERE username = :u)")
                .setParameter("u", principal.getName()).uniqueResult();

        long currentBalance = balance != null ? balance.longValue() : 0;
        if (currentBalance < pointsToRedeem) {
            return ResponseEntity.badRequest().body(Map.of("error", "Không đủ điểm. Hiện có: " + currentBalance + " điểm"));
        }

        // Tạo voucher code
        String voucherCode = "LYL-" + System.currentTimeMillis();
        long discount = pointsToRedeem * 100L; // 100 điểm = 10,000đ (100đ/điểm)

        s.createNativeQuery(
                "INSERT INTO loyalty_points (user_id, booking_id, points, type, description, created_at) " +
                "VALUES ((SELECT id FROM user WHERE username = :u), NULL, :pts, 'REDEEM', :desc, NOW())")
                .setParameter("u", principal.getName())
                .setParameter("pts", pointsToRedeem)
                .setParameter("desc", "Đổi " + pointsToRedeem + " điểm → Voucher " + voucherCode)
                .executeUpdate();

        return ResponseEntity.ok(Map.of(
                "message", "Đổi thành công!",
                "voucherCode", voucherCode,
                "discountAmount", discount,
                "pointsUsed", pointsToRedeem
        ));
    }

    // ────────────────────────────────────────────────
    // GET /api/loyalty/leaderboard  → Bảng xếp hạng
    // ────────────────────────────────────────────────
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        Session s = sessionFactory.getCurrentSession();
        List<Object[]> rows = s.createNativeQuery(
                "SELECT u.username, COALESCE(SUM(CASE WHEN lp.type='EARN' THEN lp.points ELSE -lp.points END),0) as balance " +
                "FROM user u LEFT JOIN loyalty_points lp ON u.id = lp.user_id " +
                "GROUP BY u.id, u.username ORDER BY balance DESC LIMIT 10")
                .getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        int rank = 1;
        for (Object[] row : rows) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("rank", rank++);
            item.put("username", row[0]);
            item.put("points", row[1]);
            result.add(item);
        }
        return ResponseEntity.ok(result);
    }
}

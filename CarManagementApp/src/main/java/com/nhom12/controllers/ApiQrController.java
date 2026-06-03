package com.nhom12.controllers;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.nhom12.pojo.Booking;
import com.nhom12.services.BookingService;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api/qr")
@CrossOrigin
@Transactional
public class ApiQrController {

    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private BookingService bookingService;

    /**
     * Sinh QR Code base64 cho một booking
     * GET /api/qr/booking/{bookingId}
     */
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<?> getBookingQr(@PathVariable int bookingId, Principal principal) {
        Session session = sessionFactory.getCurrentSession();

        Booking booking = session.get(Booking.class, bookingId);
        if (booking == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy đặt vé"));
        }

        // Kiểm tra quyền: chỉ chủ vé hoặc admin mới xem được
        if (principal != null) {
            boolean isOwner = booking.getUserId() != null &&
                              booking.getUserId().getUsername().equals(principal.getName());
            boolean isAdmin = isAdminOrStaff(principal.getName(), session);
            if (!isOwner && !isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Bạn không có quyền xem QR vé này"));
            }
        }

        try {
            // Tạo nội dung QR: JSON thông tin vé
            String qrContent = buildQrContent(booking);
            String qrBase64 = generateQrBase64(qrContent, 300, 300);

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("bookingId", booking.getId());
            result.put("qrCode", qrBase64);
            result.put("tripInfo", booking.getTripId() != null ?
                    booking.getTripId().getId() : null);
            result.put("seatNumbers", booking.getSeatNumbers());
            result.put("totalAmount", booking.getTotalAmount());
            result.put("paymentStatus", booking.getPaymentStatus());
            result.put("passengerName", booking.getUserId() != null ?
                    booking.getUserId().getUsername() : "Unknown");

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi tạo QR: " + e.getMessage()));
        }
    }

    /**
     * Trả về ảnh QR PNG trực tiếp (cho in vé)
     * GET /api/qr/booking/{bookingId}/image
     */
    @GetMapping("/booking/{bookingId}/image")
    public ResponseEntity<byte[]> getBookingQrImage(@PathVariable int bookingId) {
        Session session = sessionFactory.getCurrentSession();
        Booking booking = session.get(Booking.class, bookingId);
        if (booking == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            String qrContent = buildQrContent(booking);
            byte[] qrBytes = generateQrBytes(qrContent, 400, 400);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.setContentDispositionFormData("inline", "ticket-qr-" + bookingId + ".png");

            return new ResponseEntity<>(qrBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Xác thực QR khi nhân viên/tài xế quét vé
     * POST /api/qr/verify
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyQr(@RequestBody Map<String, String> payload, Principal principal) {
        String qrData = payload.get("qrData");
        if (qrData == null || qrData.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "QR data không được để trống"));
        }

        try {
            // Parse booking ID từ QR content
            // Format: BOOKING:123:userId:seatNumbers
            String[] parts = qrData.split(":");
            if (parts.length < 2 || !parts[0].equals("BOOKING")) {
                return ResponseEntity.badRequest().body(Map.of("error", "QR code không hợp lệ"));
            }

            int bookingId = Integer.parseInt(parts[1]);
            Session session = sessionFactory.getCurrentSession();
            Booking booking = session.get(Booking.class, bookingId);

            if (booking == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("valid", false, "message", "Không tìm thấy vé đặt"));
            }

            boolean isPaid = "COMPLETED".equalsIgnoreCase(booking.getPaymentStatus()) ||
                             "PAID".equalsIgnoreCase(booking.getPaymentStatus());

            Map<String, Object> result = new LinkedHashMap<>();
            result.put("valid", isPaid);
            result.put("bookingId", booking.getId());
            result.put("passengerName", booking.getUserId() != null ?
                    booking.getUserId().getUsername() : "Unknown");
            result.put("seatNumbers", booking.getSeatNumbers());
            result.put("totalAmount", booking.getTotalAmount());
            result.put("paymentStatus", booking.getPaymentStatus());
            result.put("message", isPaid ? "✅ Vé hợp lệ - Cho phép lên xe!" : "❌ Vé chưa thanh toán!");
            result.put("tripId", booking.getTripId() != null ? booking.getTripId().getId() : null);

            return ResponseEntity.ok(result);

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Định dạng QR không hợp lệ"));
        }
    }

    // ====== PRIVATE HELPERS ======

    private String buildQrContent(Booking booking) {
        return String.format("BOOKING:%d:%s:%s",
                booking.getId(),
                booking.getUserId() != null ? booking.getUserId().getUsername() : "guest",
                booking.getSeatNumbers() != null ? booking.getSeatNumbers() : "N/A"
        );
    }

    private String generateQrBase64(String content, int width, int height)
            throws WriterException, IOException {
        byte[] qrBytes = generateQrBytes(content, width, height);
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(qrBytes);
    }

    private byte[] generateQrBytes(String content, int width, int height)
            throws WriterException, IOException {
        QRCodeWriter qrWriter = new QRCodeWriter();
        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");
        hints.put(EncodeHintType.MARGIN, 2);

        BitMatrix matrix = qrWriter.encode(content, BarcodeFormat.QR_CODE, width, height, hints);
        BufferedImage image = MatrixToImageWriter.toBufferedImage(matrix);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "PNG", baos);
        return baos.toByteArray();
    }

    private boolean isAdminOrStaff(String username, Session session) {
        try {
            String role = (String) session.createQuery(
                    "SELECT u.userRole FROM User u WHERE u.username = :username")
                    .setParameter("username", username)
                    .uniqueResult();
            return role != null && (role.contains("ADMIN") || role.contains("MANAGER") ||
                    role.contains("STAFF") || role.contains("DRIVER"));
        } catch (Exception e) {
            return false;
        }
    }
}

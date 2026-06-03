package com.nhom12.controllers;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Feature #8: Chatbot CSKH (Rule-based + Keyword matching)
 * Tự động trả lời các câu hỏi thường gặp về:
 * - Giờ chạy xe, giá vé, tuyến đường
 * - Chính sách hủy vé, hoàn tiền
 * - Quy trình đặt vé, thanh toán
 * - Điểm thưởng, khuyến mãi
 */
@RestController
@RequestMapping("/api/chat")
@CrossOrigin
@Transactional
public class ApiChatbotController {

    @Autowired
    private SessionFactory sessionFactory;

    private static final Map<String[], String> KNOWLEDGE_BASE = new LinkedHashMap<>();

    static {
        KNOWLEDGE_BASE.put(new String[]{"đặt vé", "đặt xe", "mua vé", "book"}, 
            "🎫 **Cách đặt vé:**\n1. Vào trang Chuyến xe → Chọn tuyến\n2. Chọn ghế ngồi\n3. Nhập điểm đón/trả\n4. Thanh toán qua PayPal hoặc VNPay\n5. Nhận QR Code vé điện tử ngay lập tức!");

        KNOWLEDGE_BASE.put(new String[]{"hủy vé", "hoàn tiền", "hủy", "refund"}, 
            "🔄 **Chính sách hủy vé:**\n• Hủy trước 24h → **Hoàn 80%**\n• Hủy trước 12h → **Hoàn 50%**\n• Hủy trước 6h → **Hoàn 20%**\n• Hủy < 6h → Không hoàn tiền\n\n👉 Vào 'Vé của tôi' → Chọn vé → Nhấn Hủy vé");

        KNOWLEDGE_BASE.put(new String[]{"giá vé", "vé bao nhiêu", "chi phí", "fare", "giá tiền"},
            "💰 **Giá vé thay đổi theo tuyến và nhu cầu:**\n• Giá cơ bản hiển thị trên trang chuyến xe\n• Ghế còn ít có thể tăng 10-30%\n• Đặt sớm (còn nhiều chỗ) được giảm 10%\n\n👉 Xem giá chính xác khi chọn chuyến");

        KNOWLEDGE_BASE.put(new String[]{"điểm thưởng", "loyalty", "tích điểm", "đổi điểm", "điểm"},
            "⭐ **Chương trình điểm thưởng:**\n• **Tích điểm:** 1,000đ = 1 điểm\n• **Đổi điểm:** 100 điểm = giảm 10,000đ\n• Điểm cộng tự động sau khi thanh toán thành công\n\n👉 Xem điểm tại: Menu → Điểm thưởng");

        KNOWLEDGE_BASE.put(new String[]{"thanh toán", "paypal", "vnpay", "payment", "trả tiền"},
            "💳 **Phương thức thanh toán:**\n• **PayPal** - Thanh toán quốc tế an toàn\n• **VNPay** - Chuyển khoản ngân hàng nội địa\n\nSau thanh toán nhận QR Code điện tử ngay!");

        KNOWLEDGE_BASE.put(new String[]{"qr", "mã qr", "vé điện tử", "check-in"},
            "📱 **Vé QR điện tử:**\n• Sau khi đặt và thanh toán → Nhận QR Code\n• Xuất trình QR khi lên xe\n• Nhân viên quét QR để xác nhận\n\n👉 Xem tại: Menu → Vé của tôi");

        KNOWLEDGE_BASE.put(new String[]{"theo dõi", "tracking", "xe đang ở đâu", "vị trí xe"},
            "🗺️ **Theo dõi xe real-time:**\n• Vào 'Vé của tôi' → Chọn chuyến → 'Theo dõi xe'\n• Xem vị trí xe trên bản đồ cập nhật mỗi 10 giây\n• Ước tính thời gian đến nơi");

        KNOWLEDGE_BASE.put(new String[]{"đăng ký", "tài khoản", "register", "signup"},
            "👤 **Đăng ký tài khoản:**\n1. Nhấn 'Đăng ký' góc trên phải\n2. Điền username, email, mật khẩu\n3. Xác nhận email\n4. Đăng nhập và bắt đầu đặt vé!\n\n🎁 Tích điểm ngay từ chuyến đặt đầu tiên!");

        KNOWLEDGE_BASE.put(new String[]{"hành lý", "hàng hóa", "mang theo", "luggage"},
            "🧳 **Quy định hành lý:**\n• Mỗi vé được mang **20kg hành lý**\n• Hành lý xách tay: tối đa 7kg\n• Hàng hóa cồng kềnh cần thông báo trước");

        KNOWLEDGE_BASE.put(new String[]{"liên hệ", "hotline", "hỗ trợ", "contact", "điện thoại"},
            "📞 **Liên hệ hỗ trợ:**\n• **Hotline:** 1900-xxxx (24/7)\n• **Email:** support@whiteluxurybus.vn\n• **Facebook:** White Luxury Bus\n\nHoặc chat trực tiếp tại đây!");

        KNOWLEDGE_BASE.put(new String[]{"tuyến đường", "route", "đi đâu", "chạy những tuyến nào"},
            "🗺️ **Các tuyến đường hiện có:**\nXem danh sách đầy đủ tại trang **Tuyến đường**\n\n🔥 Tuyến hot nhất: TP.HCM → Đà Lạt, TP.HCM → Vũng Tàu, TP.HCM → Cần Thơ");

        KNOWLEDGE_BASE.put(new String[]{"ghế", "seat", "chọn ghế", "loại ghế"},
            "🪑 **Loại ghế:**\n• **Ghế ngồi** - Tiêu chuẩn\n• **Giường nằm** - Xe đường dài\n• **VIP** - Ghế rộng, tiện nghi cao cấp\n\nChọn ghế trực tiếp trên sơ đồ xe khi đặt vé!");
    }

    /**
     * POST /api/chat/message
     * Body: { "message": "tôi muốn hủy vé", "sessionId": "abc123" }
     */
    @PostMapping("/message")
    public ResponseEntity<?> chat(@RequestBody Map<String, String> payload) {
        String message = payload.getOrDefault("message", "").toLowerCase().trim();
        String sessionId = payload.getOrDefault("sessionId", UUID.randomUUID().toString());

        if (message.isEmpty()) {
            return ResponseEntity.ok(buildResponse("Bạn cần hỏi gì ạ? Tôi sẵn sàng hỗ trợ! 😊", sessionId, "greeting"));
        }

        // Xử lý câu chào
        if (message.matches(".*(xin chào|chào|hello|hi|hey|good morning|good afternoon).*")) {
            return ResponseEntity.ok(buildResponse(
                "👋 **Xin chào!** Tôi là trợ lý AI của **White Luxury Bus** 🚌\n\n" +
                "Tôi có thể giúp bạn về:\n" +
                "• 🎫 Đặt vé & thanh toán\n" +
                "• 🔄 Hủy vé & hoàn tiền\n" +
                "• ⭐ Điểm thưởng\n" +
                "• 🗺️ Tuyến đường & giá vé\n" +
                "• 📱 Vé QR điện tử\n\nBạn cần hỗ trợ gì?", sessionId, "greeting"));
        }

        // Cảm ơn
        if (message.matches(".*(cảm ơn|thanks|thank you|tks|thanks bro).*")) {
            return ResponseEntity.ok(buildResponse(
                "😊 Không có gì! Chúc bạn có chuyến đi thú vị cùng **White Luxury Bus** 🚌✨\n\nCần hỗ trợ thêm cứ hỏi nhé!", sessionId, "thanks"));
        }

        // Tìm kiếm trong knowledge base
        for (Map.Entry<String[], String> entry : KNOWLEDGE_BASE.entrySet()) {
            for (String keyword : entry.getKey()) {
                if (message.contains(keyword)) {
                    return ResponseEntity.ok(buildResponse(entry.getValue(), sessionId, "answer"));
                }
            }
        }

        // Tìm kiếm chuyến xe theo tuyến
        if (message.contains("tìm") || message.contains("search") || message.contains("chuyến") || message.contains("trip")) {
            return ResponseEntity.ok(buildResponse(
                "🔍 **Tìm chuyến xe:**\n" +
                "1. Vào trang **Chuyến xe** từ menu\n" +
                "2. Lọc theo tuyến đường, ngày khởi hành\n" +
                "3. Chọn chuyến phù hợp và đặt vé!\n\n" +
                "Hoặc thử tìm nhanh bằng cách vào [Trang chủ](/) → xem gợi ý chuyến xe.", sessionId, "suggestion"));
        }

        // Không tìm thấy câu trả lời
        return ResponseEntity.ok(buildResponse(
            "🤔 Xin lỗi, tôi chưa hiểu câu hỏi của bạn.\n\n" +
            "Bạn có thể hỏi về:\n" +
            "• **Đặt vé** | **Hủy vé** | **Giá vé**\n" +
            "• **Điểm thưởng** | **Thanh toán** | **QR Code**\n" +
            "• **Hành lý** | **Tuyến đường** | **Liên hệ**\n\n" +
            "Hoặc gọi hotline **1900-xxxx** để được hỗ trợ trực tiếp!", sessionId, "fallback"));
    }

    /**
     * GET /api/chat/suggestions - Gợi ý câu hỏi nhanh
     */
    @GetMapping("/suggestions")
    public ResponseEntity<?> getSuggestions() {
        List<String> suggestions = Arrays.asList(
            "Cách đặt vé như thế nào?",
            "Chính sách hủy vé?",
            "Tôi có bao nhiêu điểm thưởng?",
            "Thanh toán bằng phương thức gì?",
            "Làm sao xem vé QR code?",
            "Tuyến xe nào đang có khuyến mãi?"
        );
        return ResponseEntity.ok(Map.of("suggestions", suggestions));
    }

    private Map<String, Object> buildResponse(String message, String sessionId, String type) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", message);
        response.put("sessionId", sessionId);
        response.put("type", type);
        response.put("timestamp", new Date().toString());
        response.put("bot", "White Luxury Bus AI");
        return response;
    }
}

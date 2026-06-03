-- ======================================================
-- SQL: Tạo bảng cho các tính năng mới
-- White Luxury Bus Management System
-- ======================================================

-- Bảng điểm thưởng
CREATE TABLE IF NOT EXISTS loyalty_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_id INT NULL,
    points BIGINT NOT NULL DEFAULT 0,
    type ENUM('EARN', 'REDEEM') NOT NULL,
    description VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type)
);

-- Thêm cột QR vào booking (nếu chưa có)
ALTER TABLE booking ADD COLUMN IF NOT EXISTS qr_token VARCHAR(100) NULL;

-- Thêm cột booking_status nếu chưa có text
-- (đã có sẵn trong schema)

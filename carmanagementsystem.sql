-- ======================================================
-- BẢN DUMP DATABASE MỚI NHẤT DÀNH CHO WHITE LUXURY BUS
-- Dữ liệu mẫu (Seed Data) được làm gọn, chuyên nghiệp và thực tế
-- Dùng để import khi setup hoặc trình bày demo đồ án
-- ======================================================

SET FOREIGN_KEY_CHECKS=0;

-- ------------------------------------------------------
-- 1. XÓA DỮ LIỆU CŨ TRƯỚC KHI IMPORT MỚI
-- ------------------------------------------------------
TRUNCATE TABLE `payment`;
TRUNCATE TABLE `review`;
TRUNCATE TABLE `notification`;
TRUNCATE TABLE `trip_transfer`;
TRUNCATE TABLE `booking`;
TRUNCATE TABLE `bus_location`;
TRUNCATE TABLE `driver_schedule`;
TRUNCATE TABLE `trip`;
TRUNCATE TABLE `route`;
TRUNCATE TABLE `driver`;
TRUNCATE TABLE `bus`;
TRUNCATE TABLE `transfer_point`;
TRUNCATE TABLE `bus_station`;
TRUNCATE TABLE `passenger_info`;
TRUNCATE TABLE `loyalty_points`;
TRUNCATE TABLE `user`;

-- ------------------------------------------------------
-- 2. TẠO TÀI KHOẢN (USER & PASSENGER INFO)
-- Password mặc định: 123456 (BCrypt)
-- ------------------------------------------------------
INSERT INTO `user` (`id`, `username`, `password`, `email`, `role`, `created_at`, `avatar`) VALUES
(1, 'admin', '$2a$10$wI5f67HhT18s3H9t961o1eIer.vO557.XNnO.j7A40P3wV/K3U4I6', 'admin@whiteluxury.vn', 'ADMIN', NOW(), 'https://res.cloudinary.com/dwyewwxl1/image/upload/v1727787498/admin_avatar.png'),
(2, 'manager', '$2a$10$wI5f67HhT18s3H9t961o1eIer.vO557.XNnO.j7A40P3wV/K3U4I6', 'manager@whiteluxury.vn', 'MANAGER', NOW(), 'https://res.cloudinary.com/dwyewwxl1/image/upload/v1727787498/manager.png'),
(3, 'staff1', '$2a$10$wI5f67HhT18s3H9t961o1eIer.vO557.XNnO.j7A40P3wV/K3U4I6', 'staff@whiteluxury.vn', 'STAFF', NOW(), NULL),
(4, 'driver_hung', '$2a$10$wI5f67HhT18s3H9t961o1eIer.vO557.XNnO.j7A40P3wV/K3U4I6', 'hung.driver@whiteluxury.vn', 'DRIVER', NOW(), NULL),
(5, 'driver_tuan', '$2a$10$wI5f67HhT18s3H9t961o1eIer.vO557.XNnO.j7A40P3wV/K3U4I6', 'tuan.driver@whiteluxury.vn', 'DRIVER', NOW(), NULL),
(6, 'khachhang1', '$2a$10$wI5f67HhT18s3H9t961o1eIer.vO557.XNnO.j7A40P3wV/K3U4I6', 'khachhang1@gmail.com', 'PASSENGER', NOW(), NULL),
(7, 'khachhang2', '$2a$10$wI5f67HhT18s3H9t961o1eIer.vO557.XNnO.j7A40P3wV/K3U4I6', 'khachhang2@gmail.com', 'PASSENGER', NOW(), NULL);

INSERT INTO `passenger_info` (`userId`, `fullName`, `phoneNumber`, `address`, `loyaltyPoints`) VALUES
(6, 'Nguyễn Văn Khách', '0901234567', 'Quận 1, TP.HCM', 1500),
(7, 'Trần Thị Hàng', '0987654321', 'Bình Thạnh, TP.HCM', 500);

-- ------------------------------------------------------
-- 3. BẾN XE & ĐIỂM TRUNG CHUYỂN
-- ------------------------------------------------------
INSERT INTO `bus_station` (`id`, `name`, `address`, `city`) VALUES
(1, 'Bến Xe Miền Đông Mới', '501 Hoàng Hữu Nam, TP. Thủ Đức', 'TP. Hồ Chí Minh'),
(2, 'Bến Xe Miền Tây', '395 Kinh Dương Vương, Bình Tân', 'TP. Hồ Chí Minh'),
(3, 'Bến Xe Liên Tỉnh Đà Lạt', 'Số 1 Tô Hiến Thành, Phường 3', 'Đà Lạt'),
(4, 'Bến Xe Khách Nha Trang', 'Đường 23/10, Vĩnh Trung', 'Nha Trang'),
(5, 'Bến Xe Trung Tâm Cần Thơ', 'Quốc Lộ 1A, Hưng Thành', 'Cần Thơ'),
(6, 'Bến Xe Vũng Tàu', 'Nam Kỳ Khởi Nghĩa, Thắng Tam', 'Vũng Tàu');

INSERT INTO `transfer_point` (`id`, `stationId`, `pointName`, `address`, `type`) VALUES
(1, 1, 'VP Ngã Tư Hàng Xanh', '456 Điện Biên Phủ, Bình Thạnh', 'PICKUP'),
(2, 1, 'Trạm Dừng Suối Tiên', '120 Xa Lộ Hà Nội, Thủ Đức', 'PICKUP'),
(3, 3, 'Chợ Đà Lạt', 'Khu Hòa Bình, Phường 1', 'DROPOFF'),
(4, 3, 'Ngã Ba Dầu Giây', 'QL20, Thống Nhất, Đồng Nai', 'REST_STOP'),
(5, 6, 'Bùng Binh Tượng Đài', 'TP. Vũng Tàu', 'DROPOFF');

-- ------------------------------------------------------
-- 4. QUẢN LÝ XE & TÀI XẾ
-- ------------------------------------------------------
INSERT INTO `bus` (`id`, `busNumber`, `type`, `capacity`, `status`, `amenities`, `imageUrl`) VALUES
(1, '51B-123.45', 'Limousine Giường Nằm', 34, 'Active', 'WiFi, Massage, Tivi, Cổng sạc USB', 'https://res.cloudinary.com/dwyewwxl1/image/upload/v1727787498/limousine.jpg'),
(2, '51B-678.90', 'Giường Nằm Cao Cấp', 40, 'Active', 'WiFi, Chăn mỏng, Nước suối', 'https://res.cloudinary.com/dwyewwxl1/image/upload/v1727787498/sleeper.jpg'),
(3, '51B-333.33', 'Ghế Ngồi VIP', 28, 'Active', 'Ghế ngả 140 độ, WiFi', 'https://res.cloudinary.com/dwyewwxl1/image/upload/v1727787498/seat.jpg'),
(4, '49B-999.99', 'Limousine Giường Nằm', 34, 'Active', 'WiFi, WC trên xe, Massage', 'https://res.cloudinary.com/dwyewwxl1/image/upload/v1727787498/limousine2.jpg');

INSERT INTO `driver` (`id`, `userId`, `fullName`, `phoneNumber`, `licenseNumber`, `experienceYears`) VALUES
(1, 4, 'Trần Văn Hùng', '0912345678', 'GPLX-D-12345', 10),
(2, 5, 'Lê Minh Tuấn', '0918765432', 'GPLX-E-67890', 15);

-- ------------------------------------------------------
-- 5. TUYẾN ĐƯỜNG & CHUYẾN XE
-- ------------------------------------------------------
INSERT INTO `route` (`id`, `origin`, `destination`, `distance`, `estimatedDuration`, `routeName`, `baseFare`) VALUES
(1, 'TP. Hồ Chí Minh', 'Đà Lạt', 300, 6.5, 'Sài Gòn - Đà Lạt', 300000),
(2, 'Đà Lạt', 'TP. Hồ Chí Minh', 300, 6.5, 'Đà Lạt - Sài Gòn', 300000),
(3, 'TP. Hồ Chí Minh', 'Nha Trang', 430, 8.5, 'Sài Gòn - Nha Trang', 400000),
(4, 'TP. Hồ Chí Minh', 'Cần Thơ', 170, 3.5, 'Sài Gòn - Cần Thơ', 150000),
(5, 'TP. Hồ Chí Minh', 'Vũng Tàu', 100, 2.0, 'Sài Gòn - Vũng Tàu', 180000);

-- Các chuyến xe sắp chạy (để test live)
INSERT INTO `trip` (`id`, `routeId`, `busId`, `departureTime`, `arrivalTime`, `fare`, `availableSeats`, `totalBookedSeats`, `status`) VALUES
(1, 1, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 390 MINUTE), 350000, 30, 4, 'Scheduled'),
(2, 1, 2, DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2880 MINUTE), 250000, 40, 0, 'Scheduled'),
(3, 5, 3, DATE_ADD(NOW(), INTERVAL 5 HOUR), DATE_ADD(NOW(), INTERVAL 7 HOUR), 180000, 28, 0, 'Scheduled'),
(4, 3, 4, DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 4830 MINUTE), 450000, 32, 2, 'Scheduled'),
-- Chuyến xe quá khứ (để hiển thị thống kê/doanh thu)
(5, 1, 1, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 40 HOUR), 350000, 0, 34, 'Completed'),
(6, 4, 3, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 116 HOUR), 150000, 5, 23, 'Completed'),
(7, 5, 3, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 358 HOUR), 180000, 0, 28, 'Completed');

-- ------------------------------------------------------
-- 6. PHÂN CÔNG TÀI XẾ
-- ------------------------------------------------------
INSERT INTO `driver_schedule` (`id`, `driverId`, `tripId`, `status`) VALUES
(1, 1, 1, 'Assigned'),
(2, 2, 2, 'Assigned'),
(3, 1, 5, 'Completed'),
(4, 2, 6, 'Completed');

-- ------------------------------------------------------
-- 7. BOOKING & THANH TOÁN (Dữ liệu mẫu cho Thống kê)
-- ------------------------------------------------------
-- Vé tương lai
INSERT INTO `booking` (`id`, `userId`, `tripId`, `bookingDate`, `numberOfSeats`, `seatNumbers`, `totalAmount`, `paymentStatus`, `bookingStatus`, `qr_token`) VALUES
(1, 6, 1, NOW(), 2, 'A1, A2', 700000, 'COMPLETED', 'CONFIRMED', 'QR_123abc'),
(2, 7, 1, NOW(), 2, 'B1, B2', 700000, 'PENDING', 'PENDING', NULL),
(3, 6, 4, NOW(), 2, 'A5, A6', 900000, 'COMPLETED', 'CONFIRMED', 'QR_xyz890');

-- Vé quá khứ (Tạo doanh thu)
INSERT INTO `booking` (`id`, `userId`, `tripId`, `bookingDate`, `numberOfSeats`, `seatNumbers`, `totalAmount`, `paymentStatus`, `bookingStatus`) VALUES
(4, 6, 5, DATE_SUB(NOW(), INTERVAL 3 DAY), 2, 'A1, A2', 700000, 'COMPLETED', 'COMPLETED'),
(5, 7, 5, DATE_SUB(NOW(), INTERVAL 4 DAY), 4, 'B1, B2, B3, B4', 1400000, 'COMPLETED', 'COMPLETED'),
(6, 6, 6, DATE_SUB(NOW(), INTERVAL 6 DAY), 1, 'C1', 150000, 'COMPLETED', 'COMPLETED'),
(7, 7, 7, DATE_SUB(NOW(), INTERVAL 16 DAY), 2, 'A3, A4', 360000, 'COMPLETED', 'COMPLETED');

INSERT INTO `payment` (`id`, `bookingId`, `paymentMethod`, `amount`, `paymentDate`, `transactionId`, `status`) VALUES
(1, 1, 'VNPAY', 700000, NOW(), 'VNP123456789', 'SUCCESS'),
(2, 3, 'PAYPAL', 900000, NOW(), 'PAYPAL987654321', 'SUCCESS'),
(3, 4, 'VNPAY', 700000, DATE_SUB(NOW(), INTERVAL 3 DAY), 'VNP111222', 'SUCCESS'),
(4, 5, 'PAYPAL', 1400000, DATE_SUB(NOW(), INTERVAL 4 DAY), 'PAYPAL333444', 'SUCCESS'),
(5, 6, 'VNPAY', 150000, DATE_SUB(NOW(), INTERVAL 6 DAY), 'VNP555666', 'SUCCESS'),
(6, 7, 'VNPAY', 360000, DATE_SUB(NOW(), INTERVAL 16 DAY), 'VNP777888', 'SUCCESS');

-- ------------------------------------------------------
-- 8. TRUNG CHUYỂN
-- ------------------------------------------------------
INSERT INTO `trip_transfer` (`id`, `bookingId`, `pointId`, `transferTime`, `status`) VALUES
(1, 1, 1, DATE_ADD(NOW(), INTERVAL 23 HOUR), 'PENDING'),
(2, 3, 3, DATE_ADD(NOW(), INTERVAL 3 DAY), 'PENDING');

-- ------------------------------------------------------
-- 9. ĐÁNH GIÁ (REVIEWS)
-- ------------------------------------------------------
INSERT INTO `review` (`id`, `tripId`, `userId`, `rating`, `comment`, `createdAt`) VALUES
(1, 5, 6, 5, 'Xe sạch sẽ, tài xế lái xe rất an toàn, phục vụ tốt!', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 6, 7, 4, 'Khởi hành đúng giờ, xe chạy êm, nhưng wifi hơi chậm.', DATE_SUB(NOW(), INTERVAL 4 DAY));

-- ------------------------------------------------------
-- 10. ĐIỂM THƯỞNG (LOYALTY POINTS)
-- ------------------------------------------------------
INSERT INTO `loyalty_points` (`id`, `user_id`, `booking_id`, `points`, `type`, `description`, `created_at`) VALUES
(1, 6, 4, 700, 'EARN', 'Tích điểm chuyến #5 (700,000đ)', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(2, 7, 5, 1400, 'EARN', 'Tích điểm chuyến #5 (1,400,000đ)', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(3, 6, 1, 700, 'EARN', 'Tích điểm chuyến #1 (700,000đ)', NOW()),
(4, 6, 3, 900, 'EARN', 'Tích điểm chuyến #4 (900,000đ)', NOW()),
(5, 6, NULL, 500, 'REDEEM', 'Đổi 500 điểm thành Voucher LYL-123456 (-50,000đ)', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, 7, NULL, 900, 'REDEEM', 'Đổi 900 điểm thành Voucher LYL-654321 (-90,000đ)', DATE_SUB(NOW(), INTERVAL 2 DAY));

-- ------------------------------------------------------
-- 11. THÔNG BÁO
-- ------------------------------------------------------
INSERT INTO `notification` (`id`, `userId`, `title`, `content`, `isRead`, `createdAt`) VALUES
(1, 6, 'Đặt vé thành công', 'Bạn đã đặt thành công 2 vé cho chuyến Sài Gòn - Đà Lạt.', 0, NOW()),
(2, 7, 'Vé sắp khởi hành', 'Chuyến xe của bạn sẽ khởi hành trong 24 giờ nữa. Vui lòng chuẩn bị!', 0, NOW()),
(3, 6, 'Tích điểm thành công', 'Bạn vừa nhận được 700 điểm thưởng từ chuyến đi vừa qua.', 1, DATE_SUB(NOW(), INTERVAL 3 DAY));


SET FOREIGN_KEY_CHECKS=1;

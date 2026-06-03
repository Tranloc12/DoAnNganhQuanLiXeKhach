<div align="center">
  <img src="https://spring.io/images/spring-logo-9146a4d3298760c2e7e49595184e1975.svg" alt="Spring Logo" width="150" height="auto" />
  <h1>🛠️ HỆ THỐNG QUẢN LÝ BẾN XE KHÁCH (BACKEND)</h1>
  <p><i>API Server mạnh mẽ, an toàn được phát triển bằng Spring MVC & Hibernate.</i></p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Java-17-007396?logo=java&logoColor=white" alt="Java 17" />
    <img src="https://img.shields.io/badge/Spring_MVC-6.x-6DB33F?logo=spring&logoColor=white" alt="Spring MVC" />
    <img src="https://img.shields.io/badge/Hibernate-6.x-59666C?logo=hibernate&logoColor=white" alt="Hibernate" />
    <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
  </p>
</div>

## 🌟 TỔNG QUAN DỰ ÁN
Đây là mã nguồn Backend cung cấp toàn bộ API và nghiệp vụ xử lý dữ liệu cho dự án **Hệ Thống Quản Lý Bến Xe Khách**. Hệ thống được thiết kế theo chuẩn RESTful API, bảo mật nhiều lớp với Spring Security & JWT, kết hợp với các dịch vụ đám mây (Cloudinary, Firebase, Aiven MySQL).

## ✨ CÁC TÍNH NĂNG VÀ NGHIỆP VỤ CỐT LÕI

*   🔐 **Xác thực & Phân quyền (Auth & Roles)**: Bảo vệ hệ thống bằng JWT Token, mã hóa mật khẩu. Hỗ trợ đa Role (ADMIN, MANAGER, STAFF, DRIVER, PASSENGER).
*   🚌 **Quản lý Vận hành**: API tạo/sửa/xóa chuyến đi, quản lý tuyến đường, xe khách, bến xe, điểm trung chuyển.
*   💳 **Cổng Thanh Toán Online (Payment Gateways)**: Tích hợp hoàn chỉnh API thanh toán VNPay và PayPal SDK.
*   📧 **Hệ thống Gửi Mail Tự Động (Java Mail Sender)**: Async Thread tự động gửi email HTML chứa Vé Điện Tử khi khách hàng thanh toán thành công.
*   📊 **Xử lý Dữ liệu Thống kê (Data Analytics)**: Cung cấp API trích xuất doanh thu theo tháng, số lượng chuyến đi, cơ cấu người dùng cho Dashboard Frontend.
*   ☁️ **Cloud Storage**: Lưu trữ hình ảnh người dùng, xe khách trên Cloudinary thay vì server local.

## 🚀 CÀI ĐẶT VÀ CHẠY DỰ ÁN LÊN SERVER

### Yêu cầu hệ thống
*   JDK 17 (Java Development Kit)
*   Apache Maven
*   MySQL (Khuyến nghị dùng Aiven Cloud MySQL)
*   Tomcat 10 (Nếu muốn deploy qua `.war`)

### Các bước cài đặt
1. **Clone repository:**
   ```bash
   git clone https://github.com/Tranloc12/DoAnNganhQuanLiXeKhach.git
   ```
2. **Cấu hình Cơ Sở Dữ Liệu:**
   Mở file `src/main/resources/application.properties` (hoặc `HibernateConfigs.java` / `database.properties`) và thay đổi các thông số kết nối MySQL của bạn.
   ```properties
   jdbc.driver=com.mysql.cj.jdbc.Driver
   jdbc.url=jdbc:mysql://localhost:3306/carmanagementdb
   jdbc.username=root
   jdbc.password=
   ```
3. **Cấu hình Email (Để dùng tính năng Auto-Mailer):**
   Mở file `src/main/resources/mail.properties` và nhập tài khoản Gmail cùng `App Password` của bạn.
   ```properties
   mail.host=smtp.gmail.com
   mail.port=587
   mail.username=your_email@gmail.com
   mail.password=your_app_password
   ```
4. **Build Dự án bằng Maven:**
   ```bash
   mvn clean install
   ```
5. **Chạy Dự án (Spring Boot / Tomcat):**
   Nếu sử dụng IDE (IntelliJ / Eclipse), bạn có thể thêm server Tomcat và Run Artifact `CarManagementApp:war`.
   API mặc định sẽ chạy ở port `8080`.

## 📚 TÀI LIỆU API (API Documentation)
Hệ thống sử dụng các đường dẫn gốc `/api/*`. Ví dụ:
*   `POST /api/login`: Đăng nhập & lấy JWT Token.
*   `GET /api/trips`: Lấy danh sách chuyến đi.
*   `POST /api/bookings`: Đặt vé mới.
*   `GET /api/statistics/revenue`: Thống kê doanh thu.

*(Yêu cầu truyền Token vào Header `Authorization: Bearer <token>` với các endpoint cần bảo mật).*

## 👨‍💻 CÔNG NGHỆ BỔ TRỢ
*   **Thanh toán:** VNPay API, PayPal SDK
*   **Bảo mật:** Spring Security, Nimbus JOSE JWT
*   **Thông báo:** Firebase Admin SDK
*   **Format JSON:** Jackson Datatype JSR310

---
*Phát triển bởi Nhóm 12 - Đồ án chuyên ngành.*

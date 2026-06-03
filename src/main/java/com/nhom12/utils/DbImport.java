package com.nhom12.utils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.nio.file.Files;
import java.nio.file.Paths;

public class DbImport {
    public static void main(String[] args) {
        // Cần thêm allowMultiQueries=true để chạy toàn bộ file SQL
        String url = "jdbc:mysql://my-database-xe-khach-carmanagement.h.aivencloud.com:20489/defaultdb?useSSL=true&requireSSL=true&allowMultiQueries=true";
        String user = "avnadmin";
        String pass = System.getenv("DB_PASSWORD"); // Lấy mật khẩu từ biến môi trường
        String sqlFilePath = "carmanagementsystem.sql"; // Đường dẫn từ thư mục gốc dự án

        try {
            System.out.println("1. Đang kết nối tới Aiven Database...");
            Connection conn = DriverManager.getConnection(url, user, pass);
            
            System.out.println("2. Đang đọc file SQL...");
            String sql = new String(Files.readAllBytes(Paths.get(sqlFilePath)));
            
            System.out.println("3. Đang nạp dữ liệu (vui lòng đợi vài giây)...");
            Statement stmt = conn.createStatement();
            stmt.execute(sql);
            
            System.out.println("4. ✅ NẠP DỮ LIỆU THÀNH CÔNG TỰ ĐỘNG!");
            conn.close();
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi nạp dữ liệu: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

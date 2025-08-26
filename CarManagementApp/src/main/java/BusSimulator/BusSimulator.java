/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package BusSimulator;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.math.BigDecimal;

public class BusSimulator {

    public static void main(String[] args) {
        BigDecimal currentLat = new BigDecimal("10.762622");
        BigDecimal currentLng = new BigDecimal("106.660172");
        int busId = 1;

        System.out.println("Bắt đầu mô phỏng xe buýt di chuyển...");

        while (true) {
            try {
                // Sử dụng giá trị nhỏ để mô phỏng chuyển động mượt mà hơn
                currentLat = currentLat.add(new BigDecimal("0.001"));
                currentLng = currentLng.add(new BigDecimal("0.001"));

                String urlString = String.format("http://localhost:8080/CarManagementApp/api/bus-locations/update?busId=%d&lat=%s&lng=%s",
                        busId, currentLat.toString(), currentLng.toString());
                URL url = new URL(urlString);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("POST");

                int responseCode = conn.getResponseCode();
                System.out.println("Đã gửi cập nhật. Mã phản hồi: " + responseCode);

                // Giữ thời gian chờ là 1 giây để cập nhật nhanh
                Thread.sleep(1000);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
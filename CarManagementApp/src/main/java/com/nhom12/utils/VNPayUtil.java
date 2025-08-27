package com.nhom12.utils;

import org.apache.commons.codec.digest.HmacUtils;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

/**
 * VNPay Utility Class for payment processing
 */
public class VNPayUtil {

    public static String hmacSHA512(String key, String data) throws Exception {
        Mac hmac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac.init(secretKey);
        byte[] hash = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));

        StringBuilder sb = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            sb.append(String.format("%02x", b & 0xff));
        }
        return sb.toString();
    }

    public static String getIpAddress(jakarta.servlet.http.HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception ex) {
            ipAdress = "Invalid IP:" + ex.getMessage();
        }
        return ipAdress;
    }

    public static String getRandomNumber(int len) {
        Random rnd = new Random();
        String chars = "0123456789";
        StringBuilder sb = new StringBuilder(len);
        for (int i = 0; i < len; i++) {
            sb.append(chars.charAt(rnd.nextInt(chars.length())));
        }
        return sb.toString();
    }

    // Phương thức này tạo chuỗi dữ liệu gốc (không mã hóa) để băm.
    // Lỗi nằm ở việc URL-encode các giá trị, trong khi VNPAY lại yêu cầu
    // sử dụng giá trị gốc.
    public static String getRawPaymentData(Map<String, String> paramsMap) {
        List<String> fieldNames = new ArrayList<>(paramsMap.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = paramsMap.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // ✅ Sửa lỗi tại đây: Không URL-encode.
                // Vấn đề là ở chỗ phương thức này được gọi trong validateSignature.
                // Các giá trị trong params đã bị decode bởi servlet container,
                // nhưng VNPAY lại yêu cầu hash trên giá trị gốc của chuỗi query.
                // Sửa bằng cách dùng giá trị gốc và không encode.
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(fieldValue);
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }
        return hashData.toString();
    }
    
    // Phương thức này tạo chuỗi truy vấn URL (đã mã hóa)
    public static String getPaymentURL(Map<String, String> paramsMap) throws UnsupportedEncodingException {
        List<String> fieldNames = new ArrayList<>(paramsMap.keySet());
        Collections.sort(fieldNames);
        StringBuilder query = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = paramsMap.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                query.append(URLEncoder.encode(fieldName, StandardCharsets.UTF_8.toString()));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.UTF_8.toString()));
                if (itr.hasNext()) {
                    query.append('&');
                }
            }
        }
        return query.toString();
    }

    public static boolean validateSignature(Map<String, String> params, String secretKey) {
        String vnp_SecureHash = params.get("vnp_SecureHash");

        Map<String, String> fields = new HashMap<>(params);
        fields.remove("vnp_SecureHashType");
        fields.remove("vnp_SecureHash");

        // Tạo chuỗi dữ liệu để băm từ các tham số đã nhận
        String signValue = getRawPaymentData(fields);

        System.out.println("Chuỗi dữ liệu gốc để băm: " + signValue);

        String hashValue;
        try {
            hashValue = hmacSHA512(secretKey, signValue);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        System.out.println("Chữ ký tôi tính toán: " + hashValue);
        System.out.println("Chữ ký từ VNPAY: " + vnp_SecureHash);

        return hashValue.equalsIgnoreCase(vnp_SecureHash);
    }

    public static String formatDateTime(Date date) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        return formatter.format(date);
    }

    public static String formatAmount(double amount) {
        return String.valueOf((long) (amount * 100));
    }
}
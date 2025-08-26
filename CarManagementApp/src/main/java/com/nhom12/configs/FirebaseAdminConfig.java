/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.configs;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.io.InputStream;

@Configuration
public class FirebaseAdminConfig {

    @PostConstruct
    public void initialize() {
        try {
            InputStream serviceAccount = new ClassPathResource("carmangament-firebase-adminsdk-fbsvc-60003dfe82.json").getInputStream();
            // 🎯 Đổi "your-service-account-key.json" thành tên file JSON của bạn

            FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
            System.out.println("Firebase Admin SDK đã được khởi tạo thành công!");
        } catch (IOException e) {
            System.err.println("Lỗi khi khởi tạo Firebase Admin SDK: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
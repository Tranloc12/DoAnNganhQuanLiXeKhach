package com.nhom12.configs;

import com.nhom12.pojo.User;
import com.nhom12.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;

@Component
public class AppStartupRunner implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private UserService userService;

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        try {
            User admin = userService.getUserByUsername("admin");
            if (admin != null) {
                // Đặt lại mật khẩu thành 123456
                userService.changePassword(admin, "123456");
                System.out.println("=========================================================");
                System.out.println("✅ [AUTO-FIX] Mật khẩu tài khoản 'admin' đã được reset thành '123456'.");
                System.out.println("=========================================================");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

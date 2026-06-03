/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Cấu hình xử lý bất đồng bộ cho email notifications
 * @author HP
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "emailTaskExecutor")
    public Executor emailTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // Cấu hình thread pool cho email
        executor.setCorePoolSize(2);        // Số thread tối thiểu
        executor.setMaxPoolSize(5);         // Số thread tối đa
        executor.setQueueCapacity(100);     // Số task có thể queue
        executor.setThreadNamePrefix("EmailAsync-");
        executor.setKeepAliveSeconds(60);   // Thời gian giữ thread idle
        
        // Xử lý khi shutdown
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        
        executor.initialize();
        return executor;
    }
    
    @Bean(name = "notificationTaskExecutor")
    public Executor notificationTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        
        // Cấu hình thread pool cho notifications
        executor.setCorePoolSize(1);        // Số thread tối thiểu
        executor.setMaxPoolSize(3);         // Số thread tối đa
        executor.setQueueCapacity(50);      // Số task có thể queue
        executor.setThreadNamePrefix("NotificationAsync-");
        executor.setKeepAliveSeconds(60);
        
        executor.setWaitForTasksToCompleteOnShutdown(true);
        executor.setAwaitTerminationSeconds(30);
        
        executor.initialize();
        return executor;
    }
}

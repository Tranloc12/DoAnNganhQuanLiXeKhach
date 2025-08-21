/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.configs;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nhom12.filters.JwtFilter;
import com.nhom12.services.UserService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.session.HttpSessionEventPublisher;
import jakarta.servlet.http.HttpServletResponse; // THÊM DÒNG NÀY
import org.springframework.http.HttpStatus; // THÊM DÒNG NÀY
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer; // THÊM DÒNG NÀY nếu chưa có

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

/**
 *
 * @author admin
 */
@Configuration
@EnableWebSecurity
@EnableTransactionManagement
@Import(PaypalConfig.class)
@ComponentScan(basePackages = {
    "com.nhom12.controllers",
    "com.nhom12.repositories",
    "com.nhom12.services",
    "com.nhom12.utils",
    "com.nhom12.filters",
    "com.nhom12.configs"
})
public class SpringSecurityConfigs {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserService userService;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtFilter jwtFilter() {
        return new JwtFilter(userService);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(c -> c.disable())
                // Chỉ STATELESS cho API endpoints, STATEFUL cho web endpoints
                .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false))
                .authorizeHttpRequests(requests -> requests
                // Public endpoints

                .requestMatchers(HttpMethod.POST, "/api/register", "/api/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/upload-avatar").hasAnyRole("PASSENGER", "ADMIN", "MANAGER", "DRIVER")
                .requestMatchers(HttpMethod.GET, "/api/buses", "/api/buses/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/buses").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/buses/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/buses/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.GET, "/api/drivers", "/api/drivers/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/drivers").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/drivers/**").hasAnyRole("ADMIN", "MANAGER", "STAFF") // Thêm dòng này để cho phép cập nhật
                .requestMatchers(HttpMethod.DELETE, "/api/drivers/**").hasAnyRole("ADMIN", "MANAGER") // Sửa lại dòng này để phân quyền rõ ràng hơn
                //user
                .requestMatchers(HttpMethod.POST, "/api/users").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                // ✅ Trip API
                .requestMatchers(HttpMethod.GET, "/api/trips", "/api/trips/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/trips").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/trips/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/trips/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                // ✅ Route API
                .requestMatchers(HttpMethod.GET, "/api/routes", "/api/routes/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/routes").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/routes/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/routes/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                // ✅ Booking API
                .requestMatchers(HttpMethod.GET, "/api/bookings/my").hasAnyRole("ADMIN", "MANAGER", "STAFF", "PASSENGER")
                .requestMatchers(HttpMethod.POST, "/api/bookings").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/bookings/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/bookings/**").permitAll()
                // ✅ Review API
                .requestMatchers(HttpMethod.GET, "/api/reviews", "/api/reviews/**").permitAll() // Cho phép GET công khai
                .requestMatchers(HttpMethod.POST, "/api/reviews/**").hasAnyRole("PASSENGER")// User phải đăng nhập mới được review
                .requestMatchers(HttpMethod.PUT, "/api/reviews/**").hasAnyRole("PASSENGER")// User phải đăng nhập mới được review
                .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasAnyRole("ADMIN", "MANAGER", "STAFF", "PASSENGER")
                .requestMatchers(HttpMethod.GET, "/api/reviews/my-reviews").hasAnyRole("PASSENGER", "ADMIN", "MANAGER", "DRIVER")
                // ✅ Statistics API
                .requestMatchers(HttpMethod.GET, "/api/statistics", "/api/statistics/**").hasRole("ADMIN")
                // ✅ DriverSchedule API
                .requestMatchers(HttpMethod.GET, "/api/schedules", "/api/schedules/**").hasAnyRole("ADMIN", "MANAGER", "STAFF", "DRIVER")
                .requestMatchers(HttpMethod.POST, "/api/schedules").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.PUT, "/api/schedules/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                .requestMatchers(HttpMethod.DELETE, "/api/schedules/**").hasAnyRole("ADMIN", "MANAGER", "STAFF")
                // ✅ Payment API
                .requestMatchers(HttpMethod.POST, "/api/payments/create").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/payments/vnpay_return").permitAll()
                .requestMatchers(HttpMethod.GET, "/vnpay_return").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/paypal/create").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/paypal/capture").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/paypal/success").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/paypal/cancel").permitAll()
                // --- CÁC ENDPOINT PAYPAL ĐƯỢC THÊM/CẬP NHẬT ---
                .requestMatchers(HttpMethod.POST, "/api/paypal/create-payment").authenticated() // Tạo thanh toán, cần xác thực người dùng
                .requestMatchers(HttpMethod.GET, "/api/paypal/execute-payment").permitAll() // Endpoint PayPal redirect, cần public
                .requestMatchers(HttpMethod.GET, "/api/payments/my").hasAnyRole("PASSENGER", "ADMIN", "MANAGER", "DRIVER")
                .requestMatchers("/", "/login", "/css/**", "/js/**", "/images/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/gym-packages").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/gym-packages").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/gym-packages/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/byPackage").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/reviews/averageByPackage").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/trainers").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/members").permitAll()
                // VNPay endpoints - must be public for IPN callbacks
                .requestMatchers("/api/payment/vnpay/ipn/**").permitAll()
                .requestMatchers("/api/payment/vnpay/return/**").permitAll()
                .requestMatchers("/api/payment/vnpay/debug/**").permitAll()
                // Debug endpoints - temporary for troubleshooting
                .requestMatchers("/api/secure/subscription/debug/**").permitAll()
                .requestMatchers("/api/gym-packages/update-choice-format").permitAll()
                // Admin only endpoints (phải đặt TRƯỚC các rule chung)
                .requestMatchers("/users", "/trainers", "/members", "/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/secure/statistics/**").hasRole("ADMIN")
                // Admin and Manager endpoints (management operations)
                // API endpoints với JWT authentication (đặt SAU các rule cụ thể)
                .requestMatchers("/api/current-user").hasAnyRole("PASSENGER", "ADMIN", "MANAGER", "DRIVER", "STAFF")
                .requestMatchers(HttpMethod.GET, "/api/secure/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/secure/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/secure/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/secure/**").authenticated()
                .requestMatchers("/reviews").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("/api/secure/gym-packages/**").hasAnyRole("ADMIN", "MANAGER")
                // Trainer endpoints
                .requestMatchers("/api/secure/workout/*/approve").hasRole("TRAINER")
                .requestMatchers("/api/secure/workout/*/suggest").hasRole("TRAINER")
                // Member endpoints
                .requestMatchers("/api/secure/workout").hasRole("MEMBER")
                .requestMatchers("/api/secure/subscriptions/my").hasRole("MEMBER")
                // Payment endpoints
                .requestMatchers("/payment/**").authenticated()
                .anyRequest().authenticated()
        )
                .addFilterBefore(jwtFilter(), UsernamePasswordAuthenticationFilter.class)
                .formLogin(form -> form.loginPage("/login")
                .loginProcessingUrl("/login")
                .defaultSuccessUrl("/")
                .failureUrl("/login?error=true").permitAll())
                .logout(logout -> logout.logoutSuccessUrl("/login").permitAll());
        return http.build();
    }

    @Bean
    public HandlerMappingIntrospector mvcHandlerMappingIntrospector() {
        return new HandlerMappingIntrospector();
    }
    

    @Bean
    @Order(0)
    public StandardServletMultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        // Cho phép localhost và ngrok URLs
        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "https://localhost:*",
                "https://*.ngrok.io",
                "http://*.ngrok.io",
                "https://*.ngrok-free.app",
                "http://*.ngrok-free.app"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        config.setExposedHeaders(List.of("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}

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
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.session.HttpSessionEventPublisher;
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
@ComponentScan(basePackages = {
        "com.nhom12.controllers",
        "com.nhom12.repositories",
        "com.nhom12.services",
        "com.nhom12.utils",
        "com.nhom12.filters"
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
                        .requestMatchers(HttpMethod.POST, "/gym-packages").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.PUT, "/gym-packages/**").hasAnyRole("ADMIN", "MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/gym-packages/**").hasAnyRole("ADMIN", "MANAGER")

                        // API endpoints với JWT authentication (đặt SAU các rule cụ thể)
                        .requestMatchers("/api/current-user").authenticated()
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

                        .anyRequest().authenticated())
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
    public Cloudinary cloudinary() {
        Cloudinary cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dj4slrwsl",
                "api_key", "179444416465962",
                "api_secret", "FQBLsNVEVMPyozMSHih0PzYVxn8",
                "secure", true));
        return cloudinary;
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

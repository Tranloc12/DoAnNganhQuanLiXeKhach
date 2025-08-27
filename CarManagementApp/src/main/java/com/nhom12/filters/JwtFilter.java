/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.filters;

import com.nhom12.pojo.User;
import com.nhom12.services.UserService;
import com.nhom12.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 *
 * @author 
 */
public class JwtFilter extends OncePerRequestFilter {

    private UserService userService;

    public JwtFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // Kiểm tra Authorization header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = JwtUtils.validateTokenAndGetUsername(token);
            } catch (Exception e) {
                // Token không hợp lệ
                logger.error("JWT Token validation error: " + e.getMessage());
            }
        }

        // Nếu có username và chưa có authentication trong SecurityContext
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                User user = userService.getUserByUsername(username);
                if (user != null) {
                    // Tạo authorities từ user role
                    List<GrantedAuthority> authorities = new ArrayList<>();
                    authorities.add(new SimpleGrantedAuthority(user.getUserRole()));

                    // Tạo authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username,
                            null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set authentication vào SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                logger.error("Error setting authentication: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
    
    

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        // Chỉ filter cho API, bỏ qua form login và các request web
        String path = request.getServletPath();
        return !path.startsWith("/api/");
    }
}

package com.nhom12.controllers;

import com.nhom12.dto.UserForm; // Make sure UserForm has an 'id' field for updates
import com.nhom12.pojo.User;
import com.nhom12.services.UserService;
import com.nhom12.utils.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private JwtUtils jwtUtils = new JwtUtils();


    // 📌 Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserForm userForm) {
        try {
            if (userService.getUserByUsername(userForm.getUsername()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "Username already exists"));
            }

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            User user = new User();
            user.setUsername(userForm.getUsername());
            user.setPassword(passwordEncoder.encode(userForm.getPassword()));
            user.setEmail(userForm.getEmail());
            user.setDob(sdf.parse(userForm.getDob()));
            user.setUserRole(userForm.getUserRole()); // ROLE_DRIVER, ROLE_PASSENGER, ROLE_STAFF
            user.setIsActive(true);

            userService.saveUser(user);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Đăng ký thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 📌 Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");

            User user = userService.getUserByUsername(username);
            if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Sai thông tin đăng nhập"));
            }

            String token = jwtUtils.generateToken(username);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống"));
        }
    }

    // 📌 Lấy user đang đăng nhập
    @GetMapping("/current-user")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        if (principal == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(userService.getUserByUsername(principal.getName()));
    }

    // 📌 Cập nhật user
    @PatchMapping("/current-user")
    public ResponseEntity<?> updateUser(Principal principal, @RequestBody Map<String, String> params) {
        try {
            User currentUser = userService.getUserByUsername(principal.getName());
            if (params.containsKey("email")) currentUser.setEmail(params.get("email"));
            if (params.containsKey("dob")) {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                currentUser.setDob(sdf.parse(params.get("dob")));
            }
            userService.updateUser(currentUser);
            return ResponseEntity.ok(Map.of("message", "Cập nhật thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi cập nhật"));
        }
    }

    // 📌 Đổi mật khẩu
    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody Map<String, String> passwords) {
        try {
            User user = userService.getUserByUsername(principal.getName());
            if (!passwordEncoder.matches(passwords.get("oldPassword"), user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mật khẩu cũ không đúng"));
            }
            user.setPassword(passwordEncoder.encode(passwords.get("newPassword")));
            userService.updateUser(user);
            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống"));
        }
    }

    // 📌 Lấy danh sách theo role
    @GetMapping("/drivers")
    public List<User> getDrivers() {
        return userService.getUsersByRole("ROLE_DRIVER");
    }

    @GetMapping("/passengers")
    public List<User> getPassengers() {
        return userService.getUsersByRole("ROLE_PASSENGER");
    }

    @GetMapping("/staff")
    public List<User> getStaff() {
        return userService.getUsersByRole("ROLE_STAFF");
    }
}


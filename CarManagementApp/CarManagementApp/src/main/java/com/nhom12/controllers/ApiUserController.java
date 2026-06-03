package com.nhom12.controllers;

import com.nhom12.dto.UserDetailDto;
import com.nhom12.dto.UserForm; // Make sure UserForm has an 'id' field for updates
import com.nhom12.pojo.PassengerInfo;
import com.nhom12.pojo.User;
import com.nhom12.services.CloudinaryService;
import com.nhom12.services.PassengerInfoService;
import com.nhom12.services.UserService;
import com.nhom12.utils.JwtUtils;
import jakarta.validation.Valid;
import java.io.IOException;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PassengerInfoService passengerInfoService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private JwtUtils jwtUtils = new JwtUtils();

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
    // 📌 Lấy thông tin chi tiết của người dùng hiện tại
    @GetMapping("/current-user")
    public ResponseEntity<UserDetailDto> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userService.getUserByUsername(principal.getName());
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        PassengerInfo passengerInfo = passengerInfoService.findByUser(user);
        UserDetailDto userDetails = new UserDetailDto(user, passengerInfo);

        return ResponseEntity.ok(userDetails);
    }

    @PatchMapping("/current-user")
    public ResponseEntity<?> updateUser(Principal principal, @RequestBody Map<String, String> params) {
        try {
            User currentUser = userService.getUserByUsername(principal.getName());
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Không tìm thấy người dùng"));
            }

            // Cập nhật các trường User
            if (params.containsKey("email")) {
                currentUser.setEmail(params.get("email"));
            }

            // ⭐ ĐIỀU CHỈNH: Xử lý ngoại lệ ParseException
            if (params.containsKey("dob") && !params.get("dob").isEmpty()) {
                try {
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                    currentUser.setDob(sdf.parse(params.get("dob")));
                } catch (ParseException e) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Định dạng ngày sinh không hợp lệ."));
                }
            }
            userService.updateUser(currentUser);

            // Cập nhật các trường PassengerInfo
            PassengerInfo passengerInfo = passengerInfoService.findByUser(currentUser);
            if (passengerInfo != null) {
                // ⭐ ĐIỀU CHỈNH: Kiểm tra sự tồn tại của cả hai trường
                if (params.containsKey("firstName") && params.containsKey("lastName")) {
                    String newFullName = params.get("firstName") + " " + params.get("lastName");
                    passengerInfo.setFullName(newFullName);
                }

                if (params.containsKey("phone")) {
                    passengerInfo.setPhoneNumber(params.get("phone"));
                }
                if (params.containsKey("address")) {
                    passengerInfo.setAddress(params.get("address"));
                }

                passengerInfoService.addOrUpdatePassengerInfo(passengerInfo);
            }

            UserDetailDto updatedDetails = new UserDetailDto(currentUser, passengerInfo);
            return ResponseEntity.ok(updatedDetails);

        } catch (Exception e) {
            System.err.println("Lỗi khi cập nhật thông tin: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi cập nhật. Vui lòng thử lại."));
        }
    }

    // 📌 Cập nhật thông tin chi tiết người dùng
    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(Principal principal, @RequestBody Map<String, String> passwords) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Vui lòng đăng nhập để thực hiện chức năng này."));
        }

        // Kiểm tra mật khẩu cũ và mật khẩu mới có tồn tại không
        String oldPassword = passwords.get("oldPassword");
        String newPassword = passwords.get("newPassword");

        if (oldPassword == null || oldPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng nhập mật khẩu cũ."));
        }

        if (newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Vui lòng nhập mật khẩu mới."));
        }

        try {
            User user = userService.getUserByUsername(principal.getName());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Không tìm thấy người dùng."));
            }

            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Mật khẩu cũ không đúng."));
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            userService.updateUser(user);

            return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công."));
        } catch (Exception e) {
            // Log lỗi chi tiết để dễ dàng gỡ lỗi trên server
            System.err.println("Lỗi khi đổi mật khẩu: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống. Vui lòng thử lại sau."));
        }
    }

    @PostMapping(value = "/upload-avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Principal principal) {

        System.out.println("File: " + (file != null ? file.getOriginalFilename() : "null"));
        System.out.println("Size: " + (file != null ? file.getSize() : 0));

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "File không hợp lệ"));
        }

        try {
            User currentUser = userService.getUserByUsername(principal.getName());
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Không tìm thấy người dùng."));
            }

            // 3. Tải ảnh lên Cloudinary
            // ⭐ THAY ĐỔI TẠI ĐÂY: Truyền thêm ID người dùng vào service
            String avatarUrl = cloudinaryService.uploadFile(file, currentUser.getUsername()); // SỬ DỤNG USERNAME LÀM ID DUY NHẤT

            // 4. Cập nhật URL ảnh đại diện vào đối tượng User
            currentUser.setAvatar(avatarUrl);
            userService.updateUser(currentUser);

            return ResponseEntity.ok(Map.of("message", "Tải ảnh lên và cập nhật thành công.", "url", avatarUrl));

        } catch (IOException e) {
            System.err.println("Lỗi khi tải ảnh lên: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "Lỗi khi tải ảnh lên."));
        }
    }

    // 📌 Lấy danh sách theo role
    @GetMapping("/passengers")
    public List<User> getPassengers() {
        return userService.getUsersByRole("ROLE_PASSENGER");
    }

    @GetMapping("/staff")
    public List<User> getStaff() {
        return userService.getUsersByRole("ROLE_STAFF");
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(
            @RequestBody @Valid UserForm userForm,
            Principal principal
    ) {
        // ✅ Kiểm tra quyền ADMIN
        User adminUser = userService.getUserByUsername(principal.getName());
        if (adminUser == null
                || (!"ROLE_ADMIN".equals(adminUser.getUserRole()) && !"ROLE_MANAGER".equals(adminUser.getUserRole()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Bạn không có quyền thực hiện chức năng này"));
        }

        // ✅ Kiểm tra username đã tồn tại chưa
        if (userService.getUserByUsername(userForm.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Tên đăng nhập đã tồn tại"));
        }

        // ✅ Parse ngày sinh
        Date dob;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            dob = sdf.parse(userForm.getDob());
        } catch (ParseException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Định dạng ngày sinh không hợp lệ (yyyy-MM-dd)"));
        }

        // ✅ Tạo đối tượng User mới
        User newUser = new User();
        newUser.setUsername(userForm.getUsername());
        newUser.setPassword(passwordEncoder.encode(userForm.getPassword()));
        newUser.setEmail(userForm.getEmail());
        newUser.setDob(dob);
        newUser.setUserRole(userForm.getUserRole());
        newUser.setIsActive(true);

        userService.saveUser(newUser);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Thêm người dùng thành công"));
    }

    @PostMapping("/users/save-fcm-token")
    public ResponseEntity<String> saveFcmToken(@RequestBody Map<String, String> payload) {
        String fcmToken = payload.get("token");

        // Lấy thông tin người dùng hiện tại từ Spring Security Context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return new ResponseEntity<>("Người dùng chưa được xác thực.", HttpStatus.UNAUTHORIZED);
        }

        // ⚡ Lấy username trực tiếp từ authentication
        String username = authentication.getName();
        User currentUser = userService.getUserByUsername(username);

        if (currentUser != null) {
            currentUser.setFcmToken(fcmToken);
            userService.updateUser(currentUser);
            return new ResponseEntity<>("FCM Token đã được lưu thành công!", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Không tìm thấy người dùng.", HttpStatus.NOT_FOUND);
        }
    }

}

package com.nhom12.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Lớp DTO (Data Transfer Object) để hứng dữ liệu từ form thêm/sửa User.
 * Giúp tách biệt logic validation và dữ liệu form khỏi Pojo User chính.
 */
public class UserForm {
    private Integer id; // Dùng Integer để có thể null khi thêm mới User

    @NotBlank(message = "Tên đăng nhập không được để trống!")
    @Size(min = 4, max = 50, message = "Tên đăng nhập phải có từ 4 đến 50 ký tự.")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống!")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự.")
    private String password;

    @NotBlank(message = "Xác nhận mật khẩu không được để trống!")
    private String confirmPassword; // Trường này chỉ dùng cho form, không lưu vào User Pojo

    @NotBlank(message = "Email không được để trống!")
    @Email(message = "Email không hợp lệ!")
    @Size(max = 100, message = "Email không được vượt quá 100 ký tự.")
    private String email;

    @NotBlank(message = "Ngày sinh không được để trống!")
    // Giả sử ngày sinh được nhập dưới dạng yyyy-MM-dd
    @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "Ngày sinh phải có định dạng YYYY-MM-DD.")
    private String dob; // Dùng String để dễ dàng hứng từ input type="date"

    @NotBlank(message = "Vai trò người dùng không được để trống!")
    private String userRole; // Ví dụ: ROLE_ADMIN, ROLE_DRIVER, ROLE_PASSENGER, ROLE_STAFF, ROLE_MANAGER

    private Boolean isActive = true; // Giá trị mặc định cho người dùng mới

    // --- Getters và Setters ---

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
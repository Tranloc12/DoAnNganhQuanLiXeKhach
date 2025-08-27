/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.nhom12.validator.ConfirmPasswordMatch;
import com.nhom12.validator.UniqueEmail;
import com.nhom12.validator.UniqueUsername;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

@ConfirmPasswordMatch(
    passwordField = "password",
    confirmPasswordField = "confirmPassword"
)
public class UserForm2 {
    @UniqueEmail(message = "{user.UniqueEmail.message}")
    @NotEmpty(message = "{user.email.nullErr}")
    @Email(message = "{user.email.invalid}")
    @Pattern(regexp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message = "{user.email.invalid}")
    private String email;

    @NotEmpty(message = "{user.username.emptyErr}")
    @Size(max = 45, message = "{user.username.maxErr}")
    @UniqueUsername(message = "{user.UniqueUsername.message}")
    private String username;

    @NotNull(message = "{user.dob.nullErr}")
    @Past(message = "{user.dob.pastErr}")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate dob;

    @NotEmpty(message = "{user.password.emptyErr}")
    @Size(min = 6, message = "{user.password.minErr}")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$", message = "{user.password.regexErr}")
    private String password;

    @NotEmpty(message = "{user.confirmPassword.emptyErr}")
    private String confirmPassword;

    @NotEmpty(message = "Vui lòng chọn ít nhất một vai trò")
    private String userRole;
//    
//    private Integer isActive = 1;

    /**
     * @return the userName
     */
    public String getUsername() {
        return username;
    }

    /**
     * @param userName the userName to set
     */
    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }

    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return password;
    }

    /**
     * @param password the password to set
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return the confirmPassword
     */
    public String getConfirmPassword() {
        return confirmPassword;
    }

    /**
     * @param confirmPassword the confirmPassword to set
     */
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }
    
//    public Integer getIsActive(){
//        return isActive;
//    }
//    
//    public void setIsActive(Integer isActive){
//        this.isActive = isActive;
//    }
}
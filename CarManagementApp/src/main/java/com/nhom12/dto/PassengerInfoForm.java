/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;

public class PassengerInfoForm {
    private Integer id; // Dùng Integer để có thể null khi thêm mới

    @NotBlank(message = "Họ và tên không được để trống!")
    @Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự.")
    private String fullName;

    @NotBlank(message = "Số điện thoại không được để trống!")
    @Pattern(regexp = "^(0|\\+84)[3-9][0-9]{8}$", message = "Số điện thoại không hợp lệ!")
    private String phoneNumber;

    @NotBlank(message = "Địa chỉ không được để trống!")
    @Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự.")
    private String address;

    @NotBlank(message = "CMND/CCCD không được để trống!")
    @Size(min = 9, max = 12, message = "CMND/CCCD phải có từ 9 đến 12 chữ số.")
    private String nationalId;

    @NotNull(message = "Vui lòng chọn một người dùng liên kết!")
    private Integer userId; // Để hứng giá trị id từ dropdown

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
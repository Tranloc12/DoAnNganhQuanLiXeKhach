/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

// KHÔNG SỬ DỤNG LOMBOK NỮA:
// import lombok.Getter;
// import lombok.Setter;
// import lombok.NoArgsConstructor;
// import lombok.AllArgsConstructor;

public class DriverForm {
    private Integer id;

    @NotBlank(message = "{driver.licenseNumber.notBlank}")
    @Size(max = 50, message = "{driver.licenseNumber.size}")
    private String licenseNumber;

    @Size(max = 10, message = "{driver.licenseType.size}")
    private String licenseType;

    // Sử dụng String cho các trường ngày tháng để dễ dàng binding với input type="date"
    // Sẽ parse sang Date trong Controller
    private String dateOfIssue;
    private String dateOfExpiry;

    @Size(max = 20, message = "{driver.contactNumber.size}")
    @Pattern(regexp = "^[0-9]{10,20}$", message = "{driver.contactNumber.pattern}")
    private String contactNumber;

    @Size(max = 255, message = "{driver.address.size}")
    private String address;

    @NotNull(message = "{driver.isActive.notNull}")
    private Boolean isActive;

    @NotNull(message = "{driver.userId.notNull}")
    private Integer userId; // Để chọn User từ dropdown

    // --- CONSTRUCTORS (Tự viết thay cho @NoArgsConstructor và @AllArgsConstructor) ---
    public DriverForm() {
        // Constructor mặc định (no-argument constructor)
    }

    public DriverForm(Integer id, String licenseNumber, String licenseType, String dateOfIssue, String dateOfExpiry, String contactNumber, String address, Boolean isActive, Integer userId) {
        // Constructor với tất cả các trường (all-arguments constructor)
        this.id = id;
        this.licenseNumber = licenseNumber;
        this.licenseType = licenseType;
        this.dateOfIssue = dateOfIssue;
        this.dateOfExpiry = dateOfExpiry;
        this.contactNumber = contactNumber;
        this.address = address;
        this.isActive = isActive;
        this.userId = userId;
    }

    // --- GETTERS (Tự viết thay cho @Getter) ---
    public Integer getId() {
        return id;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public String getLicenseType() {
        return licenseType;
    }

    public String getDateOfIssue() {
        return dateOfIssue;
    }

    public String getDateOfExpiry() {
        return dateOfExpiry;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getAddress() {
        return address;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public Integer getUserId() {
        return userId;
    }

    // --- SETTERS (Tự viết thay cho @Setter) ---
    public void setId(Integer id) {
        this.id = id;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public void setLicenseType(String licenseType) {
        this.licenseType = licenseType;
    }

    public void setDateOfIssue(String dateOfIssue) {
        this.dateOfIssue = dateOfIssue;
    }

    public void setDateOfExpiry(String dateOfExpiry) {
        this.dateOfExpiry = dateOfExpiry;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
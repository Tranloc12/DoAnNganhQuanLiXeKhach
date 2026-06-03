/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class BusForm {

    private Integer id; // Dùng cho trường hợp update

    @NotBlank(message = "Biển số xe không được để trống")
    @Size(max = 20, message = "Biển số xe không quá 20 ký tự")
    private String licensePlate;

    @NotBlank(message = "Kiểu xe không được để trống")
    @Size(max = 50, message = "Kiểu xe không quá 50 ký tự")
    private String model;

    @NotNull(message = "Sức chứa không được để trống")
    @Min(value = 1, message = "Sức chứa phải lớn hơn 0")
    private Integer capacity;

    @NotNull(message = "Năm sản xuất không được để trống")
    @Min(value = 1900, message = "Năm sản xuất không hợp lệ")
    private Integer yearManufacture;

    @NotBlank(message = "Trạng thái không được để trống")
    private String status;

    private String description;

    private Boolean isActive = true; // Mặc định là true

    // --- Getters and Setters ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getYearManufacture() {
        return yearManufacture;
    }

    public void setYearManufacture(Integer yearManufacture) {
        this.yearManufacture = yearManufacture;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}

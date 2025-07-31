/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.nhom12.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class RouteForm {

    private Integer id; // Dùng cho trường hợp update

    @NotBlank(message = "Tên tuyến đường không được để trống")
    @Size(max = 100, message = "Tên tuyến đường không quá 100 ký tự")
    private String routeName;

    @NotBlank(message = "Điểm khởi hành không được để trống")
    @Size(max = 100, message = "Điểm khởi hành không quá 100 ký tự")
    private String origin;

    @NotBlank(message = "Điểm đến không được để trống")
    @Size(max = 100, message = "Điểm đến không quá 100 ký tự")
    private String destination;

    @NotNull(message = "Khoảng cách không được để trống")
    @Min(value = 0, message = "Khoảng cách phải là số dương")
    private Double distanceKm;

    @Size(max = 50, message = "Thời gian ước tính không quá 50 ký tự")
    private String estimatedTravelTime;

    @NotNull(message = "Giá mỗi Km không được để trống")
    @Min(value = 0, message = "Giá mỗi Km phải là số dương")
    private Double pricePerKm;

    private Boolean isActive = true; // Mặc định là true

    // --- Getters and Setters ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getRouteName() {
        return routeName;
    }

    public void setRouteName(String routeName) {
        this.routeName = routeName;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public String getEstimatedTravelTime() {
        return estimatedTravelTime;
    }

    public void setEstimatedTravelTime(String estimatedTravelTime) {
        this.estimatedTravelTime = estimatedTravelTime;
    }

    public Double getPricePerKm() {
        return pricePerKm;
    }

    public void setPricePerKm(Double pricePerKm) {
        this.pricePerKm = pricePerKm;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
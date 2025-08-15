/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.dto;

import java.time.LocalDateTime; // Sử dụng LocalDateTime cho thời gian
import java.util.Date; // Hoặc java.util.Date nếu bạn đang dùng Timestamp/Date

public class TicketDetailDto {
    private Integer bookingId;
    private String username;
    private String email;
    private String seatNumbers;
    private Double totalAmount;
    private Date bookingDate; // Thay thế bằng LocalDateTime nếu bạn dùng Java 8+ cho DATETIME
    private Date departureTime; // Thay thế bằng LocalDateTime
    private Date arrivalTime;   // Thay thế bằng LocalDateTime
    private String routeName;
    private String origin;
    private String destination;
    private String busLicensePlate;
    private String busModel;
    // Có thể thêm driverName nếu bạn muốn hiển thị thông tin tài xế trên vé

    // Constructor (Bạn nên tạo constructor phù hợp với cách bạn fetch dữ liệu)
    public TicketDetailDto(Integer bookingId, String username, String email, String seatNumbers, Double totalAmount, Date bookingDate, Date departureTime, Date arrivalTime, String routeName, String origin, String destination, String busLicensePlate, String busModel) {
        this.bookingId = bookingId;
        this.username = username;
        this.email = email;
        this.seatNumbers = seatNumbers;
        this.totalAmount = totalAmount;
        this.bookingDate = bookingDate;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.routeName = routeName;
        this.origin = origin;
        this.destination = destination;
        this.busLicensePlate = busLicensePlate;
        this.busModel = busModel;
    }

    // Getters and Setters
    // (Bạn có thể dùng Lombok để tự động tạo getters/setters: @Data)
    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getSeatNumbers() { return seatNumbers; }
    public void setSeatNumbers(String seatNumbers) { this.seatNumbers = seatNumbers; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public Date getBookingDate() { return bookingDate; }
    public void setBookingDate(Date bookingDate) { this.bookingDate = bookingDate; }
    public Date getDepartureTime() { return departureTime; }
    public void setDepartureTime(Date departureTime) { this.departureTime = departureTime; }
    public Date getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(Date arrivalTime) { this.arrivalTime = arrivalTime; }
    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }
    public String getOrigin() { return origin; }
    public void setOrigin(String origin) { this.origin = origin; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getBusLicensePlate() { return busLicensePlate; }
    public void setBusLicensePlate(String busLicensePlate) { this.busLicensePlate = busLicensePlate; }
    public String getBusModel() { return busModel; }
    public void setBusModel(String busModel) { this.busModel = busModel; }
}
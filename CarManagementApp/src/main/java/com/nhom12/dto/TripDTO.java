/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.dto;

import java.time.LocalDateTime;

public class TripDTO {
    private Integer id;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private LocalDateTime actualArrivalTime;
    private Double fare;
    private String status;
    private Integer availableSeats;
    private Integer totalBookedSeats;

    private Integer busId;
    private String busLicensePlate;

    private Integer driverId;
    private String driverName;

    private Integer routeId;
    private String routeName;

    // Getter và Setter
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }

    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }

    public LocalDateTime getActualArrivalTime() { return actualArrivalTime; }
    public void setActualArrivalTime(LocalDateTime actualArrivalTime) { this.actualArrivalTime = actualArrivalTime; }

    public Double getFare() { return fare; }
    public void setFare(Double fare) { this.fare = fare; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }

    public Integer getTotalBookedSeats() { return totalBookedSeats; }
    public void setTotalBookedSeats(Integer totalBookedSeats) { this.totalBookedSeats = totalBookedSeats; }

    public Integer getBusId() { return busId; }
    public void setBusId(Integer busId) { this.busId = busId; }

    public String getBusLicensePlate() { return busLicensePlate; }
    public void setBusLicensePlate(String busLicensePlate) { this.busLicensePlate = busLicensePlate; }

    public Integer getDriverId() { return driverId; }
    public void setDriverId(Integer driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public Integer getRouteId() { return routeId; }
    public void setRouteId(Integer routeId) { this.routeId = routeId; }

    public String getRouteName() { return routeName; }
    public void setRouteName(String routeName) { this.routeName = routeName; }
}

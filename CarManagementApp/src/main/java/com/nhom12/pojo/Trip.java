/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.pojo;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime; // Giữ nguyên import này, vì bây giờ chúng ta sẽ dùng nó
import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
// import jakarta.persistence.Temporal; // LOẠI BỎ IMPORT NÀY
// import jakarta.persistence.TemporalType; // LOẠI BỎ IMPORT NÀY
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
// import java.util.Date; // LOẠI BỎ IMPORT NÀY!
import java.util.Set;

/**
 *
 * @author admin
 */
@Entity
@Table(name = "trip")
@NamedQueries({
    @NamedQuery(name = "Trip.findAll", query = "SELECT t FROM Trip t"),
    @NamedQuery(name = "Trip.findById", query = "SELECT t FROM Trip t WHERE t.id = :id"),
    @NamedQuery(name = "Trip.findByDepartureTime", query = "SELECT t FROM Trip t WHERE t.departureTime = :departureTime"),
    @NamedQuery(name = "Trip.findByArrivalTime", query = "SELECT t FROM Trip t WHERE t.arrivalTime = :arrivalTime"),
    @NamedQuery(name = "Trip.findByActualArrivalTime", query = "SELECT t FROM Trip t WHERE t.actualArrivalTime = :actualArrivalTime"),
    @NamedQuery(name = "Trip.findByFare", query = "SELECT t FROM Trip t WHERE t.fare = :fare"),
    @NamedQuery(name = "Trip.findByStatus", query = "SELECT t FROM Trip t WHERE t.status = :status"),
    @NamedQuery(name = "Trip.findByAvailableSeats", query = "SELECT t FROM Trip t WHERE t.availableSeats = :availableSeats"),
    @NamedQuery(name = "Trip.findByTotalBookedSeats", query = "SELECT t FROM Trip t WHERE t.totalBookedSeats = :totalBookedSeats")})
public class Trip implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Column(name = "departureTime")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime departureTime;
    @Column(name = "arrivalTime")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime  arrivalTime;
    @Column(name = "actualArrivalTime")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime  actualArrivalTime;
    @Basic(optional = false)
    @NotNull
    @Column(name = "fare")
    private double fare;
    @Size(max = 20)
    @Column(name = "status")
    private String status;
    @OneToMany(mappedBy = "tripId")
    @JsonIgnore
    private Set<DriverSchedule> driverScheduleSet;

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "availableSeats")
    private Integer availableSeats;
    @Column(name = "totalBookedSeats")
    private Integer totalBookedSeats;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "tripId")
    @JsonIgnore
    private Set<Booking> bookingSet;
    @JoinColumn(name = "busId", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Bus busId;
    @JoinColumn(name = "driverId", referencedColumnName = "id")
    @ManyToOne(optional = false)
     @JsonBackReference 
    private Driver driverId;
    @JoinColumn(name = "routeId", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Route routeId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "tripId")
    @JsonIgnore
    private Set<Review> reviewSet;

    public Trip() {
    }

    public Trip(Integer id) {
        this.id = id;
    }

    public Trip(Integer id, LocalDateTime departureTime, double fare) {
        this.id = id;
        this.departureTime = departureTime;
        this.fare = fare;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Integer getTotalBookedSeats() {
        return totalBookedSeats;
    }

    public void setTotalBookedSeats(Integer totalBookedSeats) {
        this.totalBookedSeats = totalBookedSeats;
    }

    public Set<Booking> getBookingSet() {
        return bookingSet;
    }

    public void setBookingSet(Set<Booking> bookingSet) {
        this.bookingSet = bookingSet;
    }

    public Bus getBusId() {
        return busId;
    }

    public void setBusId(Bus busId) {
        this.busId = busId;
    }

    public Driver getDriverId() {
        return driverId;
    }

    public void setDriverId(Driver driverId) {
        this.driverId = driverId;
    }

    public Route getRouteId() {
        return routeId;
    }

    public void setRouteId(Route routeId) {
        this.routeId = routeId;
    }

    public Set<Review> getReviewSet() {
        return reviewSet;
    }

    public void setReviewSet(Set<Review> reviewSet) {
        this.reviewSet = reviewSet;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Trip)) {
            return false;
        }
        Trip other = (Trip) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.Trip[ id=" + id + " ]";
    }

    public LocalDateTime  getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime  departureTime) {
        this.departureTime = departureTime;
    }

    public LocalDateTime  getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(LocalDateTime  arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public LocalDateTime  getActualArrivalTime() {
        return actualArrivalTime;
    }

    public void setActualArrivalTime(LocalDateTime  actualArrivalTime) {
        this.actualArrivalTime = actualArrivalTime;
    }

    public double getFare() {
        return fare;
    }

    public void setFare(double fare) {
        this.fare = fare;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Set<DriverSchedule> getDriverScheduleSet() {
        return driverScheduleSet;
    }

    public void setDriverScheduleSet(Set<DriverSchedule> driverScheduleSet) {
        this.driverScheduleSet = driverScheduleSet;
    }
    
}
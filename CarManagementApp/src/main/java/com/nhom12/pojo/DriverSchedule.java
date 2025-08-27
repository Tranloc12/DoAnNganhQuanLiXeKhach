/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author admin
 */
@Entity
@Table(name = "driver_schedule")
@NamedQueries({
    @NamedQuery(name = "DriverSchedule.findAll", query = "SELECT d FROM DriverSchedule d"),
    @NamedQuery(name = "DriverSchedule.findById", query = "SELECT d FROM DriverSchedule d WHERE d.id = :id"),
    @NamedQuery(name = "DriverSchedule.findByStartTime", query = "SELECT d FROM DriverSchedule d WHERE d.startTime = :startTime"),
    @NamedQuery(name = "DriverSchedule.findByEndTime", query = "SELECT d FROM DriverSchedule d WHERE d.endTime = :endTime"),
    @NamedQuery(name = "DriverSchedule.findByShiftType", query = "SELECT d FROM DriverSchedule d WHERE d.shiftType = :shiftType"),
    @NamedQuery(name = "DriverSchedule.findByStatus", query = "SELECT d FROM DriverSchedule d WHERE d.status = :status")})
public class DriverSchedule implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Column(name = "startTime")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;
    @Basic(optional = false)
    @NotNull
    @Column(name = "endTime")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endTime;
    @Size(max = 20)
    @Column(name = "shiftType")
    private String shiftType;
    @Size(max = 20)
    @Column(name = "status")
    private String status;
    @Lob
    @Size(max = 65535)
    @Column(name = "note")
    private String note;
    @JoinColumn(name = "busId", referencedColumnName = "id")
    @ManyToOne(fetch = FetchType.EAGER)
    private Bus busId;
    @JoinColumn(name = "driverId", referencedColumnName = "id")
    @ManyToOne(fetch = FetchType.EAGER)
    private Driver driverId;
    @JoinColumn(name = "routeId", referencedColumnName = "id")
    @ManyToOne(fetch = FetchType.EAGER)
    private Route routeId;
    @JoinColumn(name = "tripId", referencedColumnName = "id")
    @ManyToOne(fetch = FetchType.EAGER)
    private Trip tripId;

    public DriverSchedule() {
    }

    public DriverSchedule(Integer id) {
        this.id = id;
    }

    public DriverSchedule(Integer id, Date startTime, Date endTime) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public String getShiftType() {
        return shiftType;
    }

    public void setShiftType(String shiftType) {
        this.shiftType = shiftType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
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

    public Trip getTripId() {
        return tripId;
    }

    public void setTripId(Trip tripId) {
        this.tripId = tripId;
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
        if (!(object instanceof DriverSchedule)) {
            return false;
        }
        DriverSchedule other = (DriverSchedule) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.DriverSchedule[ id=" + id + " ]";
    }
    
}

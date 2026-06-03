/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

/**
 *
 * @author admin
 */
@Entity
@Table(name = "bus")
@NamedQueries({
    @NamedQuery(name = "Bus.findAll", query = "SELECT b FROM Bus b"),
    @NamedQuery(name = "Bus.findById", query = "SELECT b FROM Bus b WHERE b.id = :id"),
    @NamedQuery(name = "Bus.findByLicensePlate", query = "SELECT b FROM Bus b WHERE b.licensePlate = :licensePlate"),
    @NamedQuery(name = "Bus.findByModel", query = "SELECT b FROM Bus b WHERE b.model = :model"),
    @NamedQuery(name = "Bus.findByCapacity", query = "SELECT b FROM Bus b WHERE b.capacity = :capacity"),
    @NamedQuery(name = "Bus.findByYearManufacture", query = "SELECT b FROM Bus b WHERE b.yearManufacture = :yearManufacture"),
    @NamedQuery(name = "Bus.findByStatus", query = "SELECT b FROM Bus b WHERE b.status = :status"),
    @NamedQuery(name = "Bus.findByIsActive", query = "SELECT b FROM Bus b WHERE b.isActive = :isActive")})
public class Bus implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 20)
    @Column(name = "licensePlate")
    private String licensePlate;
    @Size(max = 50)
    @Column(name = "model")
    private String model;
    @Size(max = 20)
    @Column(name = "status")
    private String status;
    @Lob
    @Size(max = 65535)
    @Column(name = "description")
    private String description;
    @OneToMany(mappedBy = "busId")
    @JsonIgnore
    private Set<DriverSchedule> driverScheduleSet;
    
    // Thêm BusLocationSet vào đây
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "busId") 
    @JsonIgnore
    private Set<BusLocation> busLocationSet; 

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "capacity")
    private Integer capacity;
    @Column(name = "yearManufacture")
    private Integer yearManufacture;
    @Column(name = "isActive")
    private Boolean isActive;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "busId")
    @JsonIgnore
    private Set<Trip> tripSet;

    public Bus() {
    }

    public Bus(Integer id) {
        this.id = id;
    }

    public Bus(Integer id, String licensePlate) {
        this.id = id;
        this.licensePlate = licensePlate;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Set<Trip> getTripSet() {
        return tripSet;
    }

    public void setTripSet(Set<Trip> tripSet) {
        this.tripSet = tripSet;
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
        if (!(object instanceof Bus)) {
            return false;
        }
        Bus other = (Bus) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.Bus[ id=" + id + " ]";
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

    public Set<DriverSchedule> getDriverScheduleSet() {
        return driverScheduleSet;
    }

    public void setDriverScheduleSet(Set<DriverSchedule> driverScheduleSet) {
        this.driverScheduleSet = driverScheduleSet;
    }

    // Thêm getter và setter cho busLocationSet
    public Set<BusLocation> getBusLocationSet() {
        return busLocationSet;
    }

    public void setBusLocationSet(Set<BusLocation> busLocationSet) {
        this.busLocationSet = busLocationSet;
    }
    
}
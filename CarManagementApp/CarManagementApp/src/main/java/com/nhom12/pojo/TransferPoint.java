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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Set;

/**
 *
 * @author admin
 */
@Entity
@Table(name = "transfer_point")
@NamedQueries({
    @NamedQuery(name = "TransferPoint.findAll", query = "SELECT t FROM TransferPoint t"),
    @NamedQuery(name = "TransferPoint.findById", query = "SELECT t FROM TransferPoint t WHERE t.id = :id"),
    @NamedQuery(name = "TransferPoint.findByName", query = "SELECT t FROM TransferPoint t WHERE t.name = :name"),
    @NamedQuery(name = "TransferPoint.findByAddress", query = "SELECT t FROM TransferPoint t WHERE t.address = :address"),
    @NamedQuery(name = "TransferPoint.findByCity", query = "SELECT t FROM TransferPoint t WHERE t.city = :city"),
    @NamedQuery(name = "TransferPoint.findByLatitude", query = "SELECT t FROM TransferPoint t WHERE t.latitude = :latitude"),
    @NamedQuery(name = "TransferPoint.findByLongitude", query = "SELECT t FROM TransferPoint t WHERE t.longitude = :longitude")})
public class TransferPoint implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "name")
    private String name;
    @Size(max = 255)
    @Column(name = "address")
    private String address;
    @Size(max = 100)
    @Column(name = "city")
    private String city;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "latitude")
    private BigDecimal latitude;
    @Column(name = "longitude")
    private BigDecimal longitude;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "transferPointId")
    @JsonIgnore
    private Set<TripTransfer> tripTransferSet;
    @JoinColumn(name = "stationId", referencedColumnName = "id")
    @ManyToOne
    private BusStation stationId;

    public TransferPoint() {
    }

    public TransferPoint(Integer id) {
        this.id = id;
    }

    public TransferPoint(Integer id, String name) {
        this.id = id;
        this.name = name;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public Set<TripTransfer> getTripTransferSet() {
        return tripTransferSet;
    }

    public void setTripTransferSet(Set<TripTransfer> tripTransferSet) {
        this.tripTransferSet = tripTransferSet;
    }

    public BusStation getStationId() {
        return stationId;
    }

    public void setStationId(BusStation stationId) {
        this.stationId = stationId;
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
        if (!(object instanceof TransferPoint)) {
            return false;
        }
        TransferPoint other = (TransferPoint) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.TransferPoint[ id=" + id + " ]";
    }

}

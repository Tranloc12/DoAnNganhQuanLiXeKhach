/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "bus_station")
@NamedQueries({
    @NamedQuery(name = "BusStation.findAll", query = "SELECT b FROM BusStation b"),
    @NamedQuery(name = "BusStation.findById", query = "SELECT b FROM BusStation b WHERE b.id = :id"),
    @NamedQuery(name = "BusStation.findByName", query = "SELECT b FROM BusStation b WHERE b.name = :name"),
    @NamedQuery(name = "BusStation.findByAddress", query = "SELECT b FROM BusStation b WHERE b.address = :address"),
    @NamedQuery(name = "BusStation.findByCity", query = "SELECT b FROM BusStation b WHERE b.city = :city"),
    @NamedQuery(name = "BusStation.findByLatitude", query = "SELECT b FROM BusStation b WHERE b.latitude = :latitude"),
    @NamedQuery(name = "BusStation.findByLongitude", query = "SELECT b FROM BusStation b WHERE b.longitude = :longitude")})
public class BusStation implements Serializable {

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
    @OneToMany(mappedBy = "destinationStationId")
    @JsonIgnore
    private Set<Route> routeSet;
    @OneToMany(mappedBy = "originStationId")
    @JsonIgnore
    private Set<Route> routeSet1;
    @OneToMany(mappedBy = "stationId")
    @JsonIgnore
    private Set<TransferPoint> transferPointSet;

    public BusStation() {
    }

    public BusStation(Integer id) {
        this.id = id;
    }

    public BusStation(Integer id, String name) {
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

    public Set<Route> getRouteSet() {
        return routeSet;
    }

    public void setRouteSet(Set<Route> routeSet) {
        this.routeSet = routeSet;
    }

    public Set<Route> getRouteSet1() {
        return routeSet1;
    }

    public void setRouteSet1(Set<Route> routeSet1) {
        this.routeSet1 = routeSet1;
    }

    public Set<TransferPoint> getTransferPointSet() {
        return transferPointSet;
    }

    public void setTransferPointSet(Set<TransferPoint> transferPointSet) {
        this.transferPointSet = transferPointSet;
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
        if (!(object instanceof BusStation)) {
            return false;
        }
        BusStation other = (BusStation) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.BusStation[ id=" + id + " ]";
    }
    
}

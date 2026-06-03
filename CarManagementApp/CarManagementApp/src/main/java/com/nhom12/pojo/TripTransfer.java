/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.pojo;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author admin
 */
@Entity
@Table(name = "trip_transfer")
@NamedQueries({
    @NamedQuery(name = "TripTransfer.findAll", query = "SELECT t FROM TripTransfer t"),
    @NamedQuery(name = "TripTransfer.findById", query = "SELECT t FROM TripTransfer t WHERE t.id = :id"),
    @NamedQuery(name = "TripTransfer.findByArrivalTime", query = "SELECT t FROM TripTransfer t WHERE t.arrivalTime = :arrivalTime"),
    @NamedQuery(name = "TripTransfer.findByDepartureTime", query = "SELECT t FROM TripTransfer t WHERE t.departureTime = :departureTime"),
    @NamedQuery(name = "TripTransfer.findByStopOrder", query = "SELECT t FROM TripTransfer t WHERE t.stopOrder = :stopOrder"),
    @NamedQuery(name = "TripTransfer.findByNote", query = "SELECT t FROM TripTransfer t WHERE t.note = :note")})
public class TripTransfer implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "arrivalTime")
    @Temporal(TemporalType.TIMESTAMP)
    private Date arrivalTime;
    @Column(name = "departureTime")
    @Temporal(TemporalType.TIMESTAMP)
    private Date departureTime;
    @Column(name = "stopOrder")
    private Integer stopOrder;
    @Size(max = 255)
    @Column(name = "note")
    private String note;
    @JoinColumn(name = "transferPointId", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private TransferPoint transferPointId;
    @JoinColumn(name = "tripId", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Trip tripId;

    public TripTransfer() {
    }

    public TripTransfer(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(Date arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public Date getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(Date departureTime) {
        this.departureTime = departureTime;
    }

    public Integer getStopOrder() {
        return stopOrder;
    }

    public void setStopOrder(Integer stopOrder) {
        this.stopOrder = stopOrder;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public TransferPoint getTransferPointId() {
        return transferPointId;
    }

    public void setTransferPointId(TransferPoint transferPointId) {
        this.transferPointId = transferPointId;
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
        if (!(object instanceof TripTransfer)) {
            return false;
        }
        TripTransfer other = (TripTransfer) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.TripTransfer[ id=" + id + " ]";
    }
    
}

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
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;

/**
 *
 * @author admin
 */
@Entity
@Table(name = "passenger_info")
@NamedQueries({
    @NamedQuery(name = "PassengerInfo.findAll", query = "SELECT p FROM PassengerInfo p"),
    @NamedQuery(name = "PassengerInfo.findById", query = "SELECT p FROM PassengerInfo p WHERE p.id = :id"),
    @NamedQuery(name = "PassengerInfo.findByFullName", query = "SELECT p FROM PassengerInfo p WHERE p.fullName = :fullName"),
    @NamedQuery(name = "PassengerInfo.findByPhoneNumber", query = "SELECT p FROM PassengerInfo p WHERE p.phoneNumber = :phoneNumber"),
    @NamedQuery(name = "PassengerInfo.findByAddress", query = "SELECT p FROM PassengerInfo p WHERE p.address = :address"),
    @NamedQuery(name = "PassengerInfo.findByNationalId", query = "SELECT p FROM PassengerInfo p WHERE p.nationalId = :nationalId")})
public class PassengerInfo implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "fullName")
    private String fullName;
    @Size(max = 20)
    @Column(name = "phoneNumber")
    private String phoneNumber;
    @Size(max = 255)
    @Column(name = "address")
    private String address;
    @Size(max = 20)
    @Column(name = "nationalId")
    private String nationalId;
    @JoinColumn(name = "userId", referencedColumnName = "id")
    @OneToOne(optional = false)
    private User userId;

    public PassengerInfo() {
    }

    public PassengerInfo(Integer id) {
        this.id = id;
    }

    public PassengerInfo(Integer id, String fullName) {
        this.id = id;
        this.fullName = fullName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
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
        if (!(object instanceof PassengerInfo)) {
            return false;
        }
        PassengerInfo other = (PassengerInfo) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.PassengerInfo[ id=" + id + " ]";
    }
    
}

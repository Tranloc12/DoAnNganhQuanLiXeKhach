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
// import jakarta.persistence.Temporal; // LOẠI BỎ DÒNG NÀY
// import jakarta.persistence.TemporalType; // LOẠI BỎ DÒNG NÀY
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime; // THAY THẾ java.util.Date BẰNG ĐÂY
import java.util.Set;

/**
 *
 * @author admin
 */
@Entity
@Table(name = "booking")
@NamedQueries({
    @NamedQuery(name = "Booking.findAll", query = "SELECT b FROM Booking b"),
    @NamedQuery(name = "Booking.findById", query = "SELECT b FROM Booking b WHERE b.id = :id"),
    @NamedQuery(name = "Booking.findByBookingDate", query = "SELECT b FROM Booking b WHERE b.bookingDate = :bookingDate"),
    @NamedQuery(name = "Booking.findByNumberOfSeats", query = "SELECT b FROM Booking b WHERE b.numberOfSeats = :numberOfSeats"),
    @NamedQuery(name = "Booking.findByTotalAmount", query = "SELECT b FROM Booking b WHERE b.totalAmount = :totalAmount"),
    @NamedQuery(name = "Booking.findByPaymentStatus", query = "SELECT b FROM Booking b WHERE b.paymentStatus = :paymentStatus"),
    @NamedQuery(name = "Booking.findByBookingStatus", query = "SELECT b FROM Booking b WHERE b.bookingStatus = :bookingStatus"),
    @NamedQuery(name = "Booking.findBySeatNumbers", query = "SELECT b FROM Booking b WHERE b.seatNumbers = :seatNumbers")})
public class Booking implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "bookingDate")
    // @Temporal(TemporalType.TIMESTAMP) // LOẠI BỎ DÒNG NÀY
    private LocalDateTime bookingDate; // THAY ĐỔI KIỂU DỮ LIỆU Ở ĐÂY
    @Basic(optional = false)
    @NotNull
    @Column(name = "numberOfSeats")
    private int numberOfSeats;
    @Basic(optional = false)
    @NotNull
    @Column(name = "totalAmount")
    private double totalAmount;
    @Size(max = 20)
    @Column(name = "paymentStatus")
    private String paymentStatus;
    @Size(max = 20)
    @Column(name = "bookingStatus")
    @JsonIgnore
    private String bookingStatus;
    @Size(max = 100)
    @Column(name = "seatNumbers")
    private String seatNumbers;
    @JoinColumn(name = "tripId", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Trip tripId;
    @JoinColumn(name = "userId", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private User userId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "bookingId")
    @JsonIgnore
    private Set<Payment> paymentSet;

    public Booking() {
    }

    public Booking(Integer id) {
        this.id = id;
    }

    public Booking(Integer id, int numberOfSeats, double totalAmount) {
        this.id = id;
        this.numberOfSeats = numberOfSeats;
        this.totalAmount = totalAmount;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getBookingDate() { // THAY ĐỔI KIỂU TRẢ VỀ Ở ĐÂY
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) { // THAY ĐỔI KIỂU THAM SỐ Ở ĐÂY
        this.bookingDate = bookingDate;
    }

    public int getNumberOfSeats() {
        return numberOfSeats;
    }

    public void setNumberOfSeats(int numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public String getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(String seatNumbers) {
        this.seatNumbers = seatNumbers;
    }

    public Trip getTripId() {
        return tripId;
    }

    public void setTripId(Trip tripId) {
        this.tripId = tripId;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    public Set<Payment> getPaymentSet() {
        return paymentSet;
    }

    public void setPaymentSet(Set<Payment> paymentSet) {
        this.paymentSet = paymentSet;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof Booking)) {
            return false;
        }
        Booking other = (Booking) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.Booking[ id=" + id + " ]";
    }
}
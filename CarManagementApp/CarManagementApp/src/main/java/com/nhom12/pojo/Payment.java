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
// import jakarta.persistence.Temporal; // LOẠI BỎ DÒNG NÀY
// import jakarta.persistence.TemporalType; // LOẠI BỎ DÒNG NÀY
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime; // THAY THẾ java.util.Date BẰNG ĐÂY

/**
 *
 * @author admin
 */
@Entity
@Table(name = "payment")
@NamedQueries({
    @NamedQuery(name = "Payment.findAll", query = "SELECT p FROM Payment p"),
    @NamedQuery(name = "Payment.findById", query = "SELECT p FROM Payment p WHERE p.id = :id"),
    @NamedQuery(name = "Payment.findByPaymentDate", query = "SELECT p FROM Payment p WHERE p.paymentDate = :paymentDate"),
    @NamedQuery(name = "Payment.findByAmount", query = "SELECT p FROM Payment p WHERE p.amount = :amount"),
    @NamedQuery(name = "Payment.findByMethod", query = "SELECT p FROM Payment p WHERE p.method = :method"),
    @NamedQuery(name = "Payment.findByStatus", query = "SELECT p FROM Payment p WHERE p.status = :status"),
    @NamedQuery(name = "Payment.findByReceiptUrl", query = "SELECT p FROM Payment p WHERE p.receiptUrl = :receiptUrl")})
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "paymentDate")
    // @Temporal(TemporalType.TIMESTAMP) // LOẠI BỎ DÒNG NÀY
    private LocalDateTime paymentDate; // THAY ĐỔI KIỂU DỮ LIỆU Ở ĐÂY
    @Basic(optional = false)
    @NotNull
    @Column(name = "amount")
    private double amount;
    @Size(max = 50)
    @Column(name = "method")
    private String method;
    @Size(max = 20)
    @Column(name = "status")
    private String status;
    @Size(max = 255)
    @Column(name = "receiptUrl")
    private String receiptUrl;
    @JoinColumn(name = "bookingId", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Booking bookingId;

    public Payment() {
    }

    public Payment(Integer id) {
        this.id = id;
    }

    public Payment(Integer id, double amount) {
        this.id = id;
        this.amount = amount;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getPaymentDate() { // THAY ĐỔI KIỂU TRẢ VỀ Ở ĐÂY
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) { // THAY ĐỔI KIỂU THAM SỐ Ở ĐÂY
        this.paymentDate = paymentDate;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReceiptUrl() {
        return receiptUrl;
    }

    public void setReceiptUrl(String receiptUrl) {
        this.receiptUrl = receiptUrl;
    }

    public Booking getBookingId() {
        return bookingId;
    }

    public void setBookingId(Booking bookingId) {
        this.bookingId = bookingId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        if (!(object instanceof Payment)) {
            return false;
        }
        Payment other = (Payment) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.Payment[ id=" + id + " ]";
    }
}
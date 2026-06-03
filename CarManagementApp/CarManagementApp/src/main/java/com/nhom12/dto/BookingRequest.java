/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.dto;

import lombok.Data;

/**
 *
 * @author admin
 */
public class BookingRequest {
    private int tripId;
    private int numberOfSeats;
    private String seatNumbers;

    public int getTripId() {
        return tripId;
    }
    public void setTripId(int tripId) {
        this.tripId = tripId;
    }

    public int getNumberOfSeats() {
        return numberOfSeats;
    }
    public void setNumberOfSeats(int numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }

    public String getSeatNumbers() {
        return seatNumbers;
    }
    public void setSeatNumbers(String seatNumbers) {
        this.seatNumbers = seatNumbers;
    }

    @Override
    public String toString() {
        return "BookingRequest(tripId=" + tripId +
               ", numberOfSeats=" + numberOfSeats +
               ", seatNumbers=" + seatNumbers + ")";
    }
}

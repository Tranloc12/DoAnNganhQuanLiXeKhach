/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.TripTransfer;
import java.util.List;

public interface TripTransferRepository {
    List<TripTransfer> getTripTransfers();
    TripTransfer getTripTransferById(int id);
    void addTripTransfer(TripTransfer tripTransfer);
    void updateTripTransfer(TripTransfer tripTransfer);
    void deleteTripTransfer(int id);
}
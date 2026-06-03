/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services;


import com.nhom12.pojo.TripTransfer;
import java.util.List;

public interface TripTransferService {
    List<TripTransfer> getTripTransfers();
    TripTransfer getTripTransferById(int id);
    void saveOrUpdateTripTransfer(TripTransfer tripTransfer);
    void deleteTripTransfer(int id);
}

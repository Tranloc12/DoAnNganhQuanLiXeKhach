/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;


import com.nhom12.pojo.TripTransfer;
import com.nhom12.repositories.TripTransferRepository;
import com.nhom12.services.TripTransferService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TripTransferServiceImpl implements TripTransferService {

    @Autowired
    private TripTransferRepository tripTransferRepository;

    @Override
    public List<TripTransfer> getTripTransfers() {
        return tripTransferRepository.getTripTransfers();
    }

    @Override
    public TripTransfer getTripTransferById(int id) {
        return tripTransferRepository.getTripTransferById(id);
    }

    @Override
    public void saveOrUpdateTripTransfer(TripTransfer tripTransfer) {
        if (tripTransfer.getId() == null) {
            tripTransferRepository.addTripTransfer(tripTransfer);
        } else {
            tripTransferRepository.updateTripTransfer(tripTransfer);
        }
    }

    @Override
    public void deleteTripTransfer(int id) {
        tripTransferRepository.deleteTripTransfer(id);
    }
}
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;


import com.nhom12.pojo.BusStation;
import com.nhom12.repositories.BusStationRepository;
import com.nhom12.services.BusStationService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BusStationServiceImpl implements BusStationService {

    @Autowired
    private BusStationRepository busStationRepository;

    @Override
    public List<BusStation> getAllBusStations() {
        return busStationRepository.getAllBusStations();
    }

    @Override
    public BusStation getBusStationById(int id) {
        return busStationRepository.getBusStationById(id);
    }

    @Override
    public void addOrUpdate(BusStation busStation) {
        busStationRepository.addOrUpdate(busStation);
    }

    @Override
    public void deleteBusStation(int id) {
        busStationRepository.deleteBusStation(id);
    }
}


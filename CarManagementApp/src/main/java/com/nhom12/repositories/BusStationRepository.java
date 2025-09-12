/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.BusStation;
import java.util.List;

public interface BusStationRepository {
    List<BusStation> getAllBusStations();
    BusStation getBusStationById(int id);
    void addOrUpdate(BusStation busStation);
    void deleteBusStation(int id);
}

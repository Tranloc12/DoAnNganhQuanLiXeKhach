/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services;

import com.nhom12.pojo.Bus;
import java.util.List;

public interface BusService {
    List<Bus> getBuses(String kw);
    Bus getBusById(int id);
    boolean addOrUpdateBus(Bus bus);
    boolean deleteBus(int id);
    boolean isLicensePlateExist(String licensePlate, Integer excludeBusId);
    long countBuses(); // Thêm phương thức để đếm tổng số xe
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;

import com.nhom12.pojo.DriverSchedule;
import com.nhom12.repositories.DriverScheduleRepository;
import com.nhom12.services.DriverScheduleService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DriverScheduleServiceImpl implements DriverScheduleService {

    @Autowired
    private DriverScheduleRepository driverScheduleRepository;

    @Override
    public List<DriverSchedule> getAllDriverSchedules() {
        return driverScheduleRepository.findAllDriverSchedules();
    }

    @Override
    public DriverSchedule getDriverScheduleById(int id) {
        return driverScheduleRepository.findDriverScheduleById(id);
    }

    @Override
    public void saveOrUpdateDriverSchedule(DriverSchedule schedule) {
        driverScheduleRepository.addOrUpdateDriverSchedule(schedule);
    }

    @Override
    public void removeDriverSchedule(int id) {
        driverScheduleRepository.deleteDriverSchedule(id);
    }
}
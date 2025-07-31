/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;

import com.nhom12.pojo.Driver;
import com.nhom12.repositories.DriverRepository;
import com.nhom12.services.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class DriverServiceImpl implements DriverService {

    @Autowired
    private DriverRepository driverRepo;

    @Override
    public List<Driver> getDrivers(String kw) {
        return this.driverRepo.getDrivers(kw);
    }

    @Override
    public Driver getDriverById(int id) {
        return this.driverRepo.getDriverById(id);
    }
    
    @Override
    public boolean addOrUpdateDriver(Driver driver) {
        return driverRepo.addOrUpdateDriver(driver);
    }

    @Override
    public boolean deleteDriver(int id) {
        return driverRepo.deleteDriver(id);
    }
    
     @Override
    public long countDrivers() {
        return this.driverRepo.countDrivers();
    }

}
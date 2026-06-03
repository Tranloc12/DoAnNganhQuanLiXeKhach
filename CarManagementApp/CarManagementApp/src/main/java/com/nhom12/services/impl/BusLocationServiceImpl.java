/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;

import com.nhom12.pojo.BusLocation;
import com.nhom12.repositories.BusLocationRepository;
import com.nhom12.services.BusLocationService;
import java.math.BigDecimal;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BusLocationServiceImpl implements BusLocationService {

    @Autowired
    private BusLocationRepository busLocationRepo;
    
    @Override
    public void addOrUpdateBusLocation(int busId, BigDecimal latitude, BigDecimal longitude) {
        // Có thể thêm logic nghiệp vụ tại đây, ví dụ kiểm tra dữ liệu hợp lệ
        busLocationRepo.addBusLocation(busId, latitude, longitude, new Date());
    }

    @Override
    public BusLocation getLatestBusLocation(int busId) {
        return busLocationRepo.getLatestBusLocation(busId);
    }
}
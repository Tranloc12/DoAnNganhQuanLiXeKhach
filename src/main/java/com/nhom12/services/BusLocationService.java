/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services;

import com.nhom12.pojo.BusLocation;
import java.math.BigDecimal;

public interface BusLocationService {
    // Phương thức để cập nhật/thêm vị trí mới
    void addOrUpdateBusLocation(int busId, BigDecimal latitude, BigDecimal longitude);

    // Phương thức để lấy vị trí mới nhất của xe
    BusLocation getLatestBusLocation(int busId);
}
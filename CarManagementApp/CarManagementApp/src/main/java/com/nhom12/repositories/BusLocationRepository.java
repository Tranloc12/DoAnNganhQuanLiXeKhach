/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.BusLocation;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public interface BusLocationRepository {
    // Phương thức để thêm vị trí mới của xe
    void addBusLocation(int busId, BigDecimal latitude, BigDecimal longitude, Date timestamp);

    // Phương thức để lấy vị trí mới nhất của một xe
    BusLocation getLatestBusLocation(int busId);
}

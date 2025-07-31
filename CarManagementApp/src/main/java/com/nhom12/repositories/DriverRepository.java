/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.Driver;
import java.util.List;

public interface DriverRepository {
    List<Driver> getDrivers(String kw); // Lấy danh sách tài xế
    Driver getDriverById(int id);
    boolean addOrUpdateDriver(Driver driver);
    boolean deleteDriver(int id);
     long countDrivers();
    // ... các phương thức khác nếu có ...
}

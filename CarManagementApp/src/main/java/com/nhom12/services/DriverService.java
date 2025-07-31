/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services;

import com.nhom12.pojo.Driver;
import java.util.List;

public interface DriverService {
    List<Driver> getDrivers(String kw);
    Driver getDriverById(int id);
    
    boolean addOrUpdateDriver(Driver driver);
    boolean deleteDriver(int id);
    
     long countDrivers();
    
    // ... các phương thức khác ...
}

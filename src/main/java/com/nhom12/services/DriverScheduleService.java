/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services;

import com.nhom12.pojo.DriverSchedule;
import java.util.List;

public interface DriverScheduleService {
    List<DriverSchedule> getAllDriverSchedules();
    DriverSchedule getDriverScheduleById(int id);
    void saveOrUpdateDriverSchedule(DriverSchedule schedule);
    void removeDriverSchedule(int id);
}
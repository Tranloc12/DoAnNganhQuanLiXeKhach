/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.DriverSchedule;
import java.util.List;

public interface DriverScheduleRepository {
    List<DriverSchedule> findAllDriverSchedules();
    DriverSchedule findDriverScheduleById(int id);
    void addOrUpdateDriverSchedule(DriverSchedule schedule);
    void deleteDriverSchedule(int id);
}
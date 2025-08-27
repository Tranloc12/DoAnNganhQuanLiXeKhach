/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

/**
 *
 * @author admin
 */

import java.util.Map;

public interface StatisticRepository {
    long countActiveMembers();
    double calculateTotalRevenue();
    Map<String, Integer> getGymUsageByTimeSlot();
    
}

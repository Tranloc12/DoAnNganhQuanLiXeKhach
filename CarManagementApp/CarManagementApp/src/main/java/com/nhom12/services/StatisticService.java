/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services;

/**
 *
 * @author admin
 */

import java.util.List;
import java.util.Map;

public interface StatisticService {
     long getTotalMembers();
    double getTotalRevenue();
    Map<String, Integer> getGymUsageByTimeSlot();
}

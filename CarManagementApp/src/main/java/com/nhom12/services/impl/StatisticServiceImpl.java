/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;

/**
 *
 * @author admin
 */

import com.nhom12.repositories.StatisticRepository;
import com.nhom12.services.StatisticService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class StatisticServiceImpl implements StatisticService {

    @Autowired
    private StatisticRepository statisticRepository;

    @Override
    @Transactional(readOnly = true)
    public long getTotalMembers() {
        return statisticRepository.countActiveMembers();
    }

    @Override
    @Transactional(readOnly = true)
    public double getTotalRevenue() {
        return statisticRepository.calculateTotalRevenue();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Integer> getGymUsageByTimeSlot() {
        return statisticRepository.getGymUsageByTimeSlot();
    }
}

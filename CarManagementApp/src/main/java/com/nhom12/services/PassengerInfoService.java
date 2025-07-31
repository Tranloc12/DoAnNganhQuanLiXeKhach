/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services;

import com.nhom12.pojo.PassengerInfo;
import com.nhom12.pojo.User; // Import User class
import java.util.List;

public interface PassengerInfoService {
    List<PassengerInfo> getPassengerInfos(String kw);
    PassengerInfo getPassengerInfoById(int id);
    boolean addOrUpdatePassengerInfo(PassengerInfo passengerInfo);
    boolean deletePassengerInfo(int id);
    long countPassengerInfos();
    
 
}

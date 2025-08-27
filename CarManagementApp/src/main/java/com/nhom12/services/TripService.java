/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services;

import com.nhom12.pojo.Trip;
import java.util.List;

public interface TripService {
    List<Trip> getTrips(String kw);
    Trip getTripById(int id);
    boolean addOrUpdateTrip(Trip trip);
    boolean deleteTrip(int id);
    long countTrips();
     boolean decreaseAvailableSeats(int tripId, int numberOfSeats);
    boolean increaseAvailableSeats(int tripId, int numberOfSeats);
    List<Object[]> getMonthlyRevenueStats(int year);
    List<Object[]> getTripCountByRouteStats();
    
    
}
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services;

import com.nhom12.pojo.Route;
import java.util.List;

public interface RouteService {

    List<Route> getRoutes(String kw);

    Route getRouteById(int id);

    boolean addOrUpdateRoute(Route route);

    boolean deleteRoute(int id);

    boolean isRouteNameExist(String routeName, Integer excludeRouteId);

    long countRoutes();

    List<Route> findRoutes(String routeName, String origin, String destination, Double distanceFrom, Double distanceTo, Double priceFrom, Double priceTo, Boolean isActive);

}

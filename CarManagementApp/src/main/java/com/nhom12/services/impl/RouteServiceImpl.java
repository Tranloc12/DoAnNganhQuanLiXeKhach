/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;

import com.nhom12.pojo.Route;
import com.nhom12.repositories.RouteRepository;
import com.nhom12.services.RouteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class RouteServiceImpl implements RouteService {

    @Autowired
    private RouteRepository routeRepo;

    @Override
    public List<Route> getRoutes(String kw) {
        return this.routeRepo.getRoutes(kw);
    }

    @Override
    public Route getRouteById(int id) {
        return this.routeRepo.getRouteById(id);
    }

    @Override
    public boolean addOrUpdateRoute(Route route) {
        // Kiểm tra tên tuyến đường trùng lặp trước khi thêm/cập nhật
        if (this.isRouteNameExist(route.getRouteName(), route.getId())) {
            System.err.println("Tên tuyến đường đã tồn tại. Vui lòng nhập tên khác.");
            return false;
        }
        return this.routeRepo.addOrUpdateRoute(route);
    }

    @Override
    public boolean deleteRoute(int id) {
        return this.routeRepo.deleteRoute(id);
    }

    @Override
    public boolean isRouteNameExist(String routeName, Integer excludeRouteId) {
        return this.routeRepo.isRouteNameExist(routeName, excludeRouteId);
    }

    @Override
    public long countRoutes() {
        return this.routeRepo.countRoutes();
    }
}
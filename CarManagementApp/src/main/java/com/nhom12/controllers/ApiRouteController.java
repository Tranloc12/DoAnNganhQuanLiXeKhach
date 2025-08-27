/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.dto.RouteForm;
import com.nhom12.pojo.Route;
import com.nhom12.services.RouteService;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/routes")
@CrossOrigin
public class ApiRouteController {

    @Autowired
    private RouteService routeServ;

    @GetMapping
    public ResponseEntity<List<Route>> getRoutes(@RequestParam(name = "kw", required = false) String kw) {
        List<Route> routes = routeServ.getRoutes(kw);
        return ResponseEntity.ok(routes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoute(@PathVariable("id") int id) {
        Route route = routeServ.getRouteById(id);
        if (route == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(route);
    }

    @PostMapping
    public ResponseEntity<?> createRoute(@RequestBody Route route) {
        try {
            if (routeServ.isRouteNameExist(route.getRouteName(), null)) {
                return ResponseEntity.badRequest().body("Tên tuyến đường đã tồn tại.");
            }

            if (routeServ.addOrUpdateRoute(route)) {
                return ResponseEntity.ok(route);
            }
            return ResponseEntity.status(500).body("Thêm tuyến đường thất bại");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoute(@PathVariable("id") int id, @RequestBody RouteForm form) {
        return saveOrUpdateRoute(form, id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoute(@PathVariable("id") int id) {
        if (routeServ.deleteRoute(id)) {
            return ResponseEntity.ok("Xóa thành công!");
        }
        return ResponseEntity.status(404).body("Không tìm thấy tuyến đường");
    }

    // ================= PRIVATE =================
    private ResponseEntity<?> saveOrUpdateRoute(RouteForm form, Integer id) {
        try {
            // ✅ Kiểm tra trùng tên
            if (routeServ.isRouteNameExist(form.getRouteName(), id)) {
                return ResponseEntity.badRequest().body("Tên tuyến đường đã tồn tại.");
            }

            Route route = new Route();

            // Nếu là cập nhật thì copy dữ liệu cũ
            if (id != null) {
                Route existing = routeServ.getRouteById(id);
                if (existing == null) {
                    return ResponseEntity.status(404).body("Không tìm thấy tuyến đường");
                }
                BeanUtils.copyProperties(existing, route);
                route.setId(id);
            }

            // Copy dữ liệu mới từ form
            BeanUtils.copyProperties(form, route);

            if (routeServ.addOrUpdateRoute(route)) {
                return ResponseEntity.ok(route);
            }

            return ResponseEntity.status(500).body("Lưu tuyến đường thất bại");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}

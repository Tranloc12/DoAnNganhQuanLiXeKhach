/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.pojo.BusLocation;
import com.nhom12.services.BusLocationService;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bus-locations")
public class BusLocationController {

    @Autowired
    private BusLocationService busLocationService;

    // API để cập nhật vị trí xe
    // Ví dụ: POST /api/bus-locations/update?busId=1&lat=10.762622&lng=106.660172
    @PostMapping("/update")
    public ResponseEntity<String> updateLocation(@RequestParam("busId") int busId,
                                                 @RequestParam("lat") BigDecimal latitude,
                                                 @RequestParam("lng") BigDecimal longitude) {
        busLocationService.addOrUpdateBusLocation(busId, latitude, longitude);
        return new ResponseEntity<>("Location updated successfully!", HttpStatus.OK);
    }

    // API để lấy vị trí mới nhất của một xe
    // Ví dụ: GET /api/bus-locations/latest/1
    // API to get the latest bus location
    @GetMapping("/latest/{busId}")
    public ResponseEntity<BusLocation> getLatestLocation(@PathVariable("busId") int busId) {
        // 🎯 Cải thiện: Sử dụng try-catch để bắt lỗi và trả về phản hồi 404 nếu không tìm thấy
        try {
            BusLocation latestLocation = busLocationService.getLatestBusLocation(busId);
            if (latestLocation != null) {
                return new ResponseEntity<>(latestLocation, HttpStatus.OK);
            }
            // If latestLocation is null, return a 404 Not Found response
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            // Log the error for debugging on the server side
            System.err.println("Error fetching bus location for busId: " + busId);
            e.printStackTrace();
            // Return 500 Internal Server Error for any other unexpected issues
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.dto.TripDTO;
import com.nhom12.dto.TripForm;
import com.nhom12.pojo.Bus;
import com.nhom12.pojo.Driver;
import com.nhom12.pojo.Route;
import com.nhom12.pojo.Trip;
import com.nhom12.services.BusService;
import com.nhom12.services.DriverService;
import com.nhom12.services.RouteService;
import com.nhom12.services.TripService;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/trips")
@CrossOrigin
public class ApiTripController {

    @Autowired
    private TripService tripServ;
    @Autowired
    private BusService busServ;
    @Autowired
    private DriverService driverServ;
    @Autowired
    private RouteService routeServ;

    // Lấy danh sách chuyến đi
    @GetMapping
    public ResponseEntity<List<TripDTO>> getTrips(@RequestParam(name = "kw", required = false) String kw) {
        List<Trip> trips = tripServ.getTrips(kw);
        List<TripDTO> tripDTOs = trips.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(tripDTOs);
    }

    // Lấy chi tiết chuyến đi
    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable("id") int id) {
        Trip trip = tripServ.getTripById(id);
        if (trip == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(convertToDTO(trip));
    }

    // Thêm chuyến đi
    @PostMapping
    public ResponseEntity<?> createTrip(@RequestBody TripForm tripForm) {
        return saveOrUpdateTrip(tripForm, null);
    }

    // Cập nhật chuyến đi
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTrip(@PathVariable("id") int id, @RequestBody TripForm tripForm) {
        return saveOrUpdateTrip(tripForm, id);
    }

    // Xóa chuyến đi
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable("id") int id) {
        if (tripServ.deleteTrip(id))
            return ResponseEntity.ok("Xóa chuyến đi thành công");
        return ResponseEntity.status(404).body("Không tìm thấy chuyến đi");
    }

    // ================== PRIVATE METHODS ==================

    private ResponseEntity<?> saveOrUpdateTrip(TripForm tripForm, Integer id) {
        try {
            Trip trip = new Trip();
            if (id != null) { // Cập nhật
                Trip existingTrip = tripServ.getTripById(id);
                if (existingTrip == null)
                    return ResponseEntity.status(404).body("Không tìm thấy chuyến đi");
                BeanUtils.copyProperties(existingTrip, trip);
                trip.setId(id);
            }

            BeanUtils.copyProperties(tripForm, trip);

            Bus bus = busServ.getBusById(tripForm.getBusId());
            Driver driver = driverServ.getDriverById(tripForm.getDriverId());
            Route route = routeServ.getRouteById(tripForm.getRouteId());

            if (bus == null || driver == null || route == null)
                return ResponseEntity.badRequest().body("Bus/Driver/Route không hợp lệ");

            trip.setBusId(bus);
            trip.setDriverId(driver);
            trip.setRouteId(route);

            if (trip.getId() == null) {
                trip.setAvailableSeats(bus.getCapacity());
                trip.setTotalBookedSeats(0);
            }

            if (tripServ.addOrUpdateTrip(trip))
                return ResponseEntity.ok(convertToDTO(trip));

            return ResponseEntity.status(500).body("Lưu chuyến đi thất bại");
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + ex.getMessage());
        }
    }

    private TripDTO convertToDTO(Trip trip) {
        TripDTO dto = new TripDTO();
        BeanUtils.copyProperties(trip, dto);

        if (trip.getBusId() != null) {
            dto.setBusId(trip.getBusId().getId());
            dto.setBusLicensePlate(trip.getBusId().getLicensePlate());
        }
        if (trip.getDriverId() != null) {
            dto.setDriverId(trip.getDriverId().getId());
            dto.setDriverName(trip.getDriverId().getLicenseNumber());
        }
        if (trip.getRouteId() != null) {
            dto.setRouteId(trip.getRouteId().getId());
            dto.setRouteName(trip.getRouteId().getRouteName());
        }
        return dto;
    }
}

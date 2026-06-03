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
import com.nhom12.services.BookingService;
import com.nhom12.services.BusService;
import com.nhom12.services.DriverService;
import com.nhom12.services.FcmService;
import com.nhom12.services.RouteService;
import com.nhom12.services.TripService;
import java.time.LocalDateTime;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.format.annotation.DateTimeFormat;

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
    @Autowired
    private FcmService fcmService; // <-- Thêm dòng này
    @Autowired
    private BookingService bookingService; // <-- Thêm service để lấy booking

    @GetMapping
    public ResponseEntity<List<TripDTO>> getTrips(
            @RequestParam(name = "departureTime", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departureTime,
            @RequestParam(name = "arrivalTime", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime arrivalTime,
            @RequestParam(name = "routeId", required = false) Integer routeId,
            @RequestParam(name = "busId", required = false) Integer busId,
            @RequestParam(name = "driverId", required = false) Integer driverId,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "origin", required = false) String origin,
            @RequestParam(name = "destination", required = false) String destination,
             @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "pageSize", required = false, defaultValue = "10") Integer pageSize
    ) {
        // Gọi repo/service để tìm chuyến đi với bộ lọc
        List<Trip> trips = tripServ.findTrips(departureTime, arrivalTime, routeId, busId, driverId, status, origin, destination, page, pageSize);

        // Chuyển sang DTO
        List<TripDTO> tripDTOs = trips.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(tripDTOs);
    }

    // Lấy chi tiết chuyến đi
    @GetMapping("/{id}")
    public ResponseEntity<?> getTripById(@PathVariable("id") int id) {
        Trip trip = tripServ.getTripById(id);
        if (trip == null) {
            return ResponseEntity.notFound().build();
        }
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
        Trip existingTrip = tripServ.getTripById(id);
        if (existingTrip == null) {
            return ResponseEntity.status(404).body("Không tìm thấy chuyến đi");
        }

        // So sánh các trường để quyết định có gửi thông báo không
        // Ví dụ: so sánh giờ khởi hành, giờ đến, tài xế, xe bus,...
        boolean hasChanged = !existingTrip.getDepartureTime().equals(tripForm.getDepartureTime());

        // Gọi phương thức để lưu hoặc cập nhật chuyến đi
        ResponseEntity<?> response = saveOrUpdateTrip(tripForm, id);

        // Nếu cập nhật thành công và có thay đổi quan trọng, gửi thông báo
        if (response.getStatusCode().is2xxSuccessful() && hasChanged) {
            // Lấy danh sách FCM Tokens của những người đã đặt vé cho chuyến này
            List<String> userTokens = bookingService.getFcmTokensByTripId(id);

            for (String token : userTokens) {
                fcmService.sendNotification(
                        token,
                        "Cập nhật lịch trình chuyến đi!",
                        "Chuyến xe " + existingTrip.getRouteId().getRouteName() + " đã có thay đổi về thời gian."
                );
            }
        }
        return response;
    }

    // Xóa chuyến đi
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrip(@PathVariable("id") int id) {
        if (tripServ.deleteTrip(id)) {
            return ResponseEntity.ok("Xóa chuyến đi thành công");
        }
        return ResponseEntity.status(404).body("Không tìm thấy chuyến đi");
    }

    // ================== PRIVATE METHODS ==================
    private ResponseEntity<?> saveOrUpdateTrip(TripForm tripForm, Integer id) {
        try {
            Trip trip = new Trip();
            if (id != null) { // Cập nhật
                Trip existingTrip = tripServ.getTripById(id);
                if (existingTrip == null) {
                    return ResponseEntity.status(404).body("Không tìm thấy chuyến đi");
                }
                BeanUtils.copyProperties(existingTrip, trip);
                trip.setId(id);
            }

            BeanUtils.copyProperties(tripForm, trip);

            Bus bus = busServ.getBusById(tripForm.getBusId());
            Driver driver = driverServ.getDriverById(tripForm.getDriverId());
            Route route = routeServ.getRouteById(tripForm.getRouteId());

            if (bus == null || driver == null || route == null) {
                return ResponseEntity.badRequest().body("Bus/Driver/Route không hợp lệ");
            }

            trip.setBusId(bus);
            trip.setDriverId(driver);
            trip.setRouteId(route);

            if (trip.getId() == null) {
                trip.setAvailableSeats(bus.getCapacity());
                trip.setTotalBookedSeats(0);
            }

            if (tripServ.addOrUpdateTrip(trip)) {
                return ResponseEntity.ok(convertToDTO(trip));
            }

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
            dto.setBusCapacity(trip.getBusId().getCapacity());
        }
        if (trip.getDriverId() != null) {
            dto.setDriverId(trip.getDriverId().getId());
            dto.setDriverName(trip.getDriverId().getLicenseNumber());
        }
        if (trip.getRouteId() != null) {
            dto.setRouteId(trip.getRouteId().getId());
            dto.setRouteName(trip.getRouteId().getRouteName());
            // ⚡ Thêm 2 dòng này
            dto.setOrigin(trip.getRouteId().getOrigin());
            dto.setDestination(trip.getRouteId().getDestination());

            if (trip.getRouteId().getOriginStationId() != null) {
                dto.setOriginStationName(trip.getRouteId().getOriginStationId().getName());
            }

            if (trip.getRouteId().getDestinationStationId() != null) {
                dto.setDestinationStationName(trip.getRouteId().getDestinationStationId().getName());
            }
        }
        return dto;
    }
}

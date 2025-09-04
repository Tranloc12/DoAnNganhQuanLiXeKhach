/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;

import com.nhom12.pojo.Bus;
import com.nhom12.pojo.Driver;
import com.nhom12.pojo.Route;
import com.nhom12.pojo.Trip;
import com.nhom12.repositories.TripRepository;
import com.nhom12.services.BusService;
import com.nhom12.services.DriverService;
import com.nhom12.services.RouteService;
import com.nhom12.services.TripService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime; // <-- Đảm bảo cái này được import
import java.util.List;

@Service
@Transactional
public class TripServiceImpl implements TripService {

    @Autowired
    private TripRepository tripRepo;

    @Autowired
    private BusService busService;
    @Autowired
    private DriverService driverService;
    @Autowired
    private RouteService routeService;

    @Override
    public List<Trip> getTrips(String kw) {
        return this.tripRepo.getTrips(kw);
    }

    @Override
    public Trip getTripById(int id) {
        return this.tripRepo.getTripById(id);
    }

    @Override
    public boolean addOrUpdateTrip(Trip trip) {
        // 1. Kiểm tra thời gian: departureTime phải trước arrivalTime (nếu cả hai đều có giá trị)
        if (trip.getDepartureTime() != null && trip.getArrivalTime() != null) {
            if (trip.getDepartureTime().isAfter(trip.getArrivalTime())) {
                System.err.println("Thời gian khởi hành không thể sau thời gian dự kiến đến.");
                return false; // Trả về false để báo hiệu lỗi validation
            }
        }

        // 2. Cập nhật availableSeats nếu là chuyến đi mới hoặc chưa được set
        // Hoặc khi có sự thay đổi Bus (dẫn đến thay đổi capacity)
        if (trip.getId() == null || trip.getId() == 0) { // Nếu là thêm mới chuyến đi
            if (trip.getBusId() != null) {
                Bus bus = busService.getBusById(trip.getBusId().getId());
                if (bus != null && bus.getCapacity() != null) {
                    trip.setAvailableSeats(bus.getCapacity()); // Số ghế trống ban đầu = sức chứa của xe
                    trip.setTotalBookedSeats(0); // Mới tạo thì số ghế đã đặt là 0
                } else {
                    System.err.println("Không thể xác định sức chứa của xe buýt. Vui lòng kiểm tra Bus ID.");
                    return false;
                }
            } else {
                System.err.println("Bus ID không được cung cấp.");
                return false;
            }
        } else {
// Khi cập nhật, nếu busId thay đổi, cần cập nhật lại availableSeats dựa trên bus mới
// Đảm bảo availableSeats không âm
            if (trip.getAvailableSeats() == null || trip.getAvailableSeats() < 0) {

                if (trip.getBusId() != null) {
                    Bus currentBus = busService.getBusById(trip.getBusId().getId());
                    if (currentBus != null && currentBus.getCapacity() != null) {
                        trip.setAvailableSeats(currentBus.getCapacity() - (trip.getTotalBookedSeats() != null ? trip.getTotalBookedSeats() : 0));
                        if (trip.getAvailableSeats() < 0) {
                            trip.setAvailableSeats(0); // Đảm bảo không âm
                        }
                    } else {
                        System.err.println("Không thể xác định sức chứa của xe buýt hiện tại. Vui lòng kiểm tra Bus ID.");
                        return false; // Có thể xử lý mềm hơn tùy yêu cầu
                    }
                } else {
                    System.err.println("Bus ID không được cung cấp khi cập nhật chuyến đi.");
                    return false; // Có thể xử lý mềm hơn tùy yêu cầu
                }
            }
        }

// Các kiểm tra tương tự có thể áp dụng cho Driver và Route để đảm bảo chúng không null trước khi lưu
        if (trip.getDriverId() == null) {
            System.err.println("Driver ID không được để trống.");
            return false;
        }
        if (trip.getRouteId() == null) {
            System.err.println("Route ID không được để trống.");
            return false;
        }

        return this.tripRepo.addOrUpdateTrip(trip);
    }

    @Override
    public boolean deleteTrip(int id) {
        // Có thể thêm logic kiểm tra xem chuyến đi có booking nào chưa trước khi xóa
        // Nếu có booking, nên vô hiệu hóa chuyến đi (isActive = false) thay vì xóa hẳn
        // For now, simple delete:
        return this.tripRepo.deleteTrip(id);
    }

    @Override
    public long countTrips() {
        return this.tripRepo.countTrips();
    }

    @Override
    public boolean decreaseAvailableSeats(int tripId, int numberOfSeats) {
        return tripRepo.decreaseAvailableSeats(tripId, numberOfSeats);
    }

    @Override
    public boolean increaseAvailableSeats(int tripId, int numberOfSeats) {
        return tripRepo.increaseAvailableSeats(tripId, numberOfSeats);
    }

    @Override
    public List<Object[]> getMonthlyRevenueStats(int year) {
        return tripRepo.getMonthlyRevenueStats(year);
    }

    @Override
    public List<Object[]> getTripCountByRouteStats() {
        return tripRepo.getTripCountByRouteStats();
    }

    @Override
    public List<Trip> findTrips(LocalDateTime departureTime, LocalDateTime arrivalTime, Integer routeId, Integer busId, Integer driverId, String status, String origin, String destination) {
        return this.tripRepo.findTrips(departureTime, arrivalTime, routeId, busId, driverId, status, origin, destination);
    }
}

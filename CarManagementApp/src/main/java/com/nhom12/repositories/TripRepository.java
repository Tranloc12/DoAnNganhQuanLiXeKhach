/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.Trip;
import java.time.LocalDateTime;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean; // Cần import để dùng trong impl/service
import java.util.List;

public interface TripRepository {

    List<Trip> getTrips(String kw); // Lấy danh sách chuyến đi

    Trip getTripById(int id);

    boolean addOrUpdateTrip(Trip trip); // Thêm hoặc cập nhật chuyến đi

    boolean deleteTrip(int id);

    long countTrips(); // Để đếm tổng số chuyến đi

    // Thêm phương thức để truy cập sessionFactory nếu bạn cần trong lớp ServiceImpl
    LocalSessionFactoryBean getSessionFactory();

    boolean decreaseAvailableSeats(int tripId, int numberOfSeats);

    boolean increaseAvailableSeats(int tripId, int numberOfSeats);

    List<Object[]> getMonthlyRevenueStats(int year); // Thống kê doanh thu theo tháng

    List<Object[]> getTripCountByRouteStats(); // Thống kê số chuyến đi theo tuyến đường

    List<Trip> findTrips(LocalDateTime departureTime, LocalDateTime arrivalTime, Integer routeId, Integer busId, Integer driverId, String status,String origin, String destination);
}

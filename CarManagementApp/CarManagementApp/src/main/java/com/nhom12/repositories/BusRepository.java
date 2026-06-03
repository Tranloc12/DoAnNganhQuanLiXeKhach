/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.Bus;
import java.util.List;

public interface BusRepository {
    List<Bus> getBuses(String kw); // Lấy danh sách xe, có thể tìm kiếm theo từ khóa
    Bus getBusById(int id);
    boolean addOrUpdateBus(Bus bus); // Thêm hoặc cập nhật xe
    boolean deleteBus(int id);
    boolean isLicensePlateExist(String licensePlate, Integer excludeBusId); // Kiểm tra biển số xe có trùng không
    // Thêm phương thức tìm kiếm chi tiết
    // Đã sửa tên tham số để khớp với các thuộc tính trong POJO Bus
    List<Bus> findBuses(String licensePlate, String model, Integer capacity, Integer yearManufacture, String status);    
}

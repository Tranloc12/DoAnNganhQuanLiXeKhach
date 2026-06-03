/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.pojo.DriverSchedule;
import com.nhom12.services.DriverScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "*")
public class ApiDriverScheduleController {

    @Autowired
    private DriverScheduleService driverScheduleService;

    // Lấy danh sách tất cả lịch trình (GET /api/schedules)
    @GetMapping
    public ResponseEntity<List<DriverSchedule>> getAllSchedules() {
        List<DriverSchedule> schedules = driverScheduleService.getAllDriverSchedules();
        return new ResponseEntity<>(schedules, HttpStatus.OK);
    }

    // Lấy một lịch trình theo ID (GET /api/schedules/{id})
    @GetMapping("/{id}")
    public ResponseEntity<DriverSchedule> getScheduleById(@PathVariable int id) {
        DriverSchedule schedule = driverScheduleService.getDriverScheduleById(id);
        if (schedule != null) {
            return new ResponseEntity<>(schedule, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // Thêm một lịch trình mới (POST /api/schedules)
    @PostMapping
    public ResponseEntity<DriverSchedule> createSchedule(@RequestBody DriverSchedule schedule) {
        // Lưu ý: service.saveOrUpdateDriverSchedule() sẽ xử lý cả thêm và sửa
        driverScheduleService.saveOrUpdateDriverSchedule(schedule);
        return new ResponseEntity<>(schedule, HttpStatus.CREATED);
    }

    // Cập nhật một lịch trình (PUT /api/schedules/{id})
    @PutMapping("/{id}")
    public ResponseEntity<DriverSchedule> updateSchedule(@PathVariable int id, @RequestBody DriverSchedule schedule) {
        // Kiểm tra xem đối tượng có tồn tại không trước khi cập nhật
        DriverSchedule existingSchedule = driverScheduleService.getDriverScheduleById(id);
        if (existingSchedule != null) {
            schedule.setId(id); // Đảm bảo ID được sử dụng là từ URL
            driverScheduleService.saveOrUpdateDriverSchedule(schedule);
            return new ResponseEntity<>(schedule, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    // Xóa một lịch trình (DELETE /api/schedules/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable int id) {
        driverScheduleService.removeDriverSchedule(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

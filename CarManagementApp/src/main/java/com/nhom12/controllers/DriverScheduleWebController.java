/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.pojo.DriverSchedule;
import com.nhom12.services.DriverScheduleService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/schedules")
public class DriverScheduleWebController {

    @Autowired
    private DriverScheduleService driverScheduleService;

    // Hiển thị danh sách tất cả lịch trình
    @GetMapping
    public String listSchedules(Model model) {
        List<DriverSchedule> schedules = driverScheduleService.getAllDriverSchedules();
        model.addAttribute("schedules", schedules);
        return "schedule-list"; // Tên file JSP: schedule-list.jsp
    }

    // Hiển thị form thêm lịch trình mới
    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("schedule", new DriverSchedule());
        return "schedule-form"; // Tên file JSP: schedule-form.jsp
    }

    // Hiển thị form sửa lịch trình
    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable int id, Model model) {
        DriverSchedule schedule = driverScheduleService.getDriverScheduleById(id);
        if (schedule != null) {
            model.addAttribute("schedule", schedule);
            return "schedule-form";
        }
        // Nếu không tìm thấy, chuyển hướng về trang danh sách
        return "redirect:/schedules";
    }

    // Xử lý lưu lịch trình (thêm hoặc cập nhật)
    @PostMapping("/save")
    public String saveSchedule(@ModelAttribute("schedule") DriverSchedule schedule) {
        driverScheduleService.saveOrUpdateDriverSchedule(schedule);
        return "redirect:/schedules";
    }

    // Xử lý xóa lịch trình
    @GetMapping("/delete/{id}")
    public String deleteSchedule(@PathVariable int id) {
        driverScheduleService.removeDriverSchedule(id);
        return "redirect:/schedules";
    }
}
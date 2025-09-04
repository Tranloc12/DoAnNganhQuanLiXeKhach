/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.dto.TripForm;
import com.nhom12.pojo.Bus;
import com.nhom12.pojo.Driver;
import com.nhom12.pojo.Route;
import com.nhom12.pojo.Trip;
import com.nhom12.pojo.User;
import com.nhom12.services.BusService;
import com.nhom12.services.DriverService;
import com.nhom12.services.RouteService;
import com.nhom12.services.TripService;
import com.nhom12.services.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.time.LocalDateTime; // Đảm bảo import này có mặt
import java.util.List;
import java.util.Comparator;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class TripController {

    @Autowired
    private TripService tripServ;
    @Autowired
    private BusService busServ;
    @Autowired
    private DriverService driverServ;
    @Autowired
    private RouteService routeServ;
    @Autowired
    private UserService userServ;

    // Phương thức kiểm tra quyền Admin
    private String checkAdminAccess(Principal principal) {
        if (principal == null) {
            return "redirect:/login"; // Chưa đăng nhập

        }

        User currentUser = userServ.getUserByUsername(principal.getName());
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/access-denied"; // Không có quyền Admin

        }

        return null; // Có quyền Admin

    }
    // Hiển thị danh sách chuyến đi

     @GetMapping("/trips")
    public String listTrips(Model model,
            @RequestParam(name = "departureTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime departureTime,
            @RequestParam(name = "arrivalTime", required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime arrivalTime,
            @RequestParam(name = "routeId", required = false) Integer routeId,
            @RequestParam(name = "busId", required = false) Integer busId,
            @RequestParam(name = "driverId", required = false) Integer driverId,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "origin", required = false) String origin,
            @RequestParam(name = "destination", required = false) String destination,
            Principal principal) {
         
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        // Gọi phương thức service mới với các tham số trực tiếp
        List<Trip> trips = tripServ.findTrips(departureTime, arrivalTime, routeId, busId, driverId, status,origin, destination);
        
        // --- Bổ sung đoạn code sắp xếp tại đây ---
        // Sắp xếp danh sách trips theo ID tăng dần
        trips.sort(Comparator.comparing(Trip::getId));
        // --- Kết thúc đoạn bổ sung ---
        
        model.addAttribute("trips", trips);

        // Thêm các tham số tìm kiếm vào model để giữ lại trên form
        model.addAttribute("departureTime", departureTime);
        model.addAttribute("arrivalTime", arrivalTime);
        model.addAttribute("routeId", routeId);
        model.addAttribute("busId", busId);
        model.addAttribute("driverId", driverId);
        model.addAttribute("status", status);

        // Thêm danh sách các tùy chọn cho dropdowns
        List<Route> routes = routeServ.getRoutes("");
        List<Bus> buses = busServ.getBuses("");
        List<Driver> drivers = driverServ.getDrivers("");

        model.addAttribute("routes", routes);
        model.addAttribute("buses", buses);
        model.addAttribute("drivers", drivers);
        model.addAttribute("tripStatuses", new String[]{"Scheduled", "In Progress", "Completed", "Cancelled"});
         
        // Để hiển thị thời gian theo định dạng dễ đọc trên bảng
        model.addAttribute("formatter", java.time.format.DateTimeFormatter.ofPattern("HH:mm dd-MM-yyyy"));
         
        return "tripList"; //Tên file template: tripList.html

    }

    // Hiển thị form thêm/cập nhật chuyến đi
    @GetMapping("/trips/add-or-update")

    public String addOrUpdateTripView(@RequestParam(name = "id", required = false) Integer id, Model model, Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        TripForm tripForm = new TripForm();
        if (id != null && id > 0) {
            Trip trip = tripServ.getTripById(id);
            if (trip != null) {
                BeanUtils.copyProperties(trip, tripForm);
                // SỬA: Sử dụng getBusId(), getDriverId(), getRouteId()
                if (trip.getBusId() != null) { // Thêm kiểm tra null

                    tripForm.setBusId(trip.getBusId().getId());
                }

                if (trip.getDriverId() != null) { // Thêm kiểm tra null

                    tripForm.setDriverId(trip.getDriverId().getId());
                }

                if (trip.getRouteId() != null) { // Thêm kiểm tra null

                    tripForm.setRouteId(trip.getRouteId().getId());
                }

            } else {

                model.addAttribute("errorMessage", "Không tìm thấy chuyến đi để cập nhật.");
            }
        } else {

            // Mặc định trạng thái cho chuyến mới
            tripForm.setStatus("Scheduled");
        }

        model.addAttribute("tripForm", tripForm);
        // Lấy danh sách cho dropdowns
        model.addAttribute("buses", busServ.getBuses("")); // Lấy tất cả bus

        model.addAttribute("drivers", driverServ.getDrivers("")); // Lấy tất cả driver

        model.addAttribute("routes", routeServ.getRoutes("")); // Lấy tất cả route

// Danh sách trạng thái cho dropdown (có thể lấy từ enum hoặc hằng số)
        model.addAttribute("tripStatuses", new String[]{"Scheduled", "In Progress", "Completed", "Cancelled"});
        return "addOrUpdateTrip"; // Tên file template: addOrUpdateTrip.html

    }

// Xử lý POST request để thêm/cập nhật chuyến đi
    @PostMapping("/trips/add-or-update")

    public String addOrUpdateTrip(@ModelAttribute("tripForm") @Valid TripForm tripForm,
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes,
            Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        // Tái tạo dữ liệu cho dropdown nếu có lỗi validation
        if (result.hasErrors()) {
            model.addAttribute("buses", busServ.getBuses(""));
            model.addAttribute("drivers", driverServ.getDrivers(""));
            model.addAttribute("routes", routeServ.getRoutes(""));
            model.addAttribute("tripStatuses", new String[]{"Scheduled", "In Progress", "Completed", "Cancelled"});
            return "addOrUpdateTrip";
        }
        try {
            Trip trip = new Trip();
            if (tripForm.getId() != null && tripForm.getId() > 0) {
                // Nếu là cập nhật, lấy chuyến đi hiện tại để giữ lại các thông tin không có trong form (như totalBookedSeats)
                Trip existingTrip = tripServ.getTripById(tripForm.getId());
                if (existingTrip != null) {
                    // Copy các thuộc tính từ existingTrip sang trip trước
                    // Đảm bảo các mối quan hệ (Bus, Driver, Route) cũng được giữ lại nếu không thay đổi
                    BeanUtils.copyProperties(existingTrip, trip);
                }

            }

            BeanUtils.copyProperties(tripForm, trip); // Copy các trường có cùng tên và kiểu

            // Set các đối tượng liên quan (Bus, Driver, Route) dựa trên ID từ form
            Bus selectedBus = busServ.getBusById(tripForm.getBusId());
            Driver selectedDriver = driverServ.getDriverById(tripForm.getDriverId());
            Route selectedRoute = routeServ.getRouteById(tripForm.getRouteId());
            if (selectedBus == null || selectedDriver == null || selectedRoute == null) {
                model.addAttribute("errorMessage", "Thông tin xe buýt, tài xế hoặc tuyến đường không hợp lệ.");
                model.addAttribute("buses", busServ.getBuses(""));
                model.addAttribute("drivers", driverServ.getDrivers(""));
                model.addAttribute("routes", routeServ.getRoutes(""));
                model.addAttribute("tripStatuses", new String[]{"Scheduled", "In Progress", "Completed", "Cancelled"});
                return "addOrUpdateTrip";
            }

            // SỬA: Sử dụng setBusId(), setDriverId(), setRouteId()
            trip.setBusId(selectedBus);
            trip.setDriverId(selectedDriver);
            trip.setRouteId(selectedRoute);
            // Logic tính toán availableSeats khi thêm mới
            if (trip.getId() == null || trip.getId() == 0) {
                trip.setAvailableSeats(selectedBus.getCapacity());
                trip.setTotalBookedSeats(0);
            } else {

                if (trip.getAvailableSeats() != null && trip.getAvailableSeats() < 0) {
                    trip.setAvailableSeats(0); // Đảm bảo không âm nếu có lỗi nhập liệu

                }

            }
            if (tripServ.addOrUpdateTrip(trip)) {
                redirectAttributes.addFlashAttribute("successMessage", "Thao tác thành công!");
                return "redirect:/trips";
            } else {

                model.addAttribute("errorMessage", "Thao tác thất bại. Vui lòng thử lại.");
                // Tải lại dữ liệu cho dropdowns nếu có lỗi
                model.addAttribute("buses", busServ.getBuses(""));
                model.addAttribute("drivers", driverServ.getDrivers(""));
                model.addAttribute("routes", routeServ.getRoutes(""));
                model.addAttribute("tripStatuses", new String[]{"Scheduled", "In Progress", "Completed", "Cancelled"});
                return "addOrUpdateTrip";
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            model.addAttribute("errorMessage", "Đã xảy ra lỗi hệ thống: " + ex.getMessage());
            // Tải lại dữ liệu cho dropdowns nếu có lỗi
            model.addAttribute("buses", busServ.getBuses(""));
            model.addAttribute("drivers", driverServ.getDrivers(""));
            model.addAttribute("routes", routeServ.getRoutes(""));
            model.addAttribute("tripStatuses", new String[]{"Scheduled", "In Progress", "Completed", "Cancelled"});
            return "addOrUpdateTrip";
        }

    }

    // Xóa chuyến đi
    @GetMapping("/trips/delete/{id}")

    public String deleteTrip(@PathVariable("id") int id, RedirectAttributes redirectAttributes, Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        try {
            if (tripServ.deleteTrip(id)) {
                redirectAttributes.addFlashAttribute("successMessage", "Xóa chuyến đi thành công!");
            } else {

                redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy chuyến đi để xóa hoặc có lỗi xảy ra.");
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", "Đã xảy ra lỗi khi xóa chuyến đi: " + ex.getMessage());

        }

        return "redirect:/trips";
    }
}

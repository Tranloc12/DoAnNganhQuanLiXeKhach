/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.dto.BusForm;
import com.nhom12.pojo.Bus;
import com.nhom12.pojo.User; // Để kiểm tra quyền admin
import com.nhom12.services.BusService;
import com.nhom12.services.UserService; // Để lấy currentUser
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.beans.BeanUtils; // Để copy properties từ DTO sang Entity
import org.springframework.beans.factory.annotation.Autowired;
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
public class BusController {

    @Autowired
    private BusService busServ;

    @Autowired
    private UserService userServ; // Để kiểm tra quyền người dùng

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

    // Hiển thị danh sách xe buýt và xử lý tìm kiếm chi tiết
    // Hiển thị danh sách xe buýt và xử lý tìm kiếm chi tiết
    @GetMapping("/buses")
    public String listBuses(
            Model model,
            @RequestParam(name = "licensePlate", required = false) String licensePlate,
            @RequestParam(name = "model", required = false) String busModel, // Đổi tên tham số busName thành model
            @RequestParam(name = "capacity", required = false) Integer capacity, // Đổi tên tham số seatingCapacity thành capacity
            @RequestParam(name = "yearManufacture", required = false) Integer yearManufacture, // Thêm tham số mới

            @RequestParam(name = "status", required = false) String status,
            Principal principal) {

        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        // Gọi phương thức findBuses với các tham số đã đổi tên
        List<Bus> buses = busServ.findBuses(licensePlate, busModel, capacity, yearManufacture, status);
        model.addAttribute("buses", buses);

        // Thêm các tham số tìm kiếm vào model để giữ lại trên form
        model.addAttribute("licensePlate", licensePlate);
        model.addAttribute("model", busModel);
        model.addAttribute("capacity", capacity);
        model.addAttribute("yearManufacture", yearManufacture); // Thêm vào model

        model.addAttribute("status", status);

        // Cần thêm danh sách trạng thái vào model để hiển thị trên form tìm kiếm
        model.addAttribute("busStatuses", new String[]{"Active", "Maintenance", "Inactive"});

        return "busList";
    }

    // Hiển thị form thêm/cập nhật xe buýt
    @GetMapping("/buses/add-or-update")
    public String addOrUpdateBusView(@RequestParam(name = "id", required = false) Integer id, Model model, Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        BusForm busForm = new BusForm();
        if (id != null && id > 0) {
            Bus bus = busServ.getBusById(id);
            if (bus != null) {
                // Copy properties từ Entity sang DTO để hiển thị trên form
                BeanUtils.copyProperties(bus, busForm);
            } else {
                // Xử lý trường hợp không tìm thấy xe để cập nhật
                model.addAttribute("errorMessage", "Không tìm thấy xe buýt để cập nhật.");
            }
        }
        model.addAttribute("busForm", busForm);
        // Danh sách trạng thái để hiển thị trong dropdown (nếu có)
        model.addAttribute("busStatuses", new String[]{"Active", "Maintenance", "Inactive"});
        return "addOrUpdateBus"; // Tên file template: addOrUpdateBus.html
    }

    // Xử lý POST request để thêm/cập nhật xe buýt
    @PostMapping("/buses/add-or-update")
    public String addOrUpdateBus(@ModelAttribute("busForm") @Valid BusForm busForm,
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes,
            Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        if (result.hasErrors()) {
            // Nếu có lỗi validation, trả về form với thông báo lỗi
            model.addAttribute("busStatuses", new String[]{"Active", "Maintenance", "Inactive"});
            return "addOrUpdateBus";
        }

        // Kiểm tra biển số xe trùng lặp
        if (busServ.isLicensePlateExist(busForm.getLicensePlate(), busForm.getId())) {
            model.addAttribute("errorMessage", "Biển số xe đã tồn tại. Vui lòng nhập biển số khác.");
            model.addAttribute("busStatuses", new String[]{"Active", "Maintenance", "Inactive"});
            return "addOrUpdateBus";
        }

        try {
            Bus bus = new Bus();
            // Copy properties từ DTO sang Entity
            BeanUtils.copyProperties(busForm, bus);

            if (busServ.addOrUpdateBus(bus)) {
                redirectAttributes.addFlashAttribute("successMessage", "Thao tác thành công!");
                return "redirect:/buses"; // Chuyển hướng về danh sách xe buýt
            } else {
                model.addAttribute("errorMessage", "Thao tác thất bại. Vui lòng thử lại.");
                model.addAttribute("busStatuses", new String[]{"Active", "Maintenance", "Inactive"});
                return "addOrUpdateBus";
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            model.addAttribute("errorMessage", "Đã xảy ra lỗi hệ thống: " + ex.getMessage());
            model.addAttribute("busStatuses", new String[]{"Active", "Maintenance", "Inactive"});
            return "addOrUpdateBus";
        }
    }

    // Xóa xe buýt
    @GetMapping("/buses/delete/{id}")
    public String deleteBus(@PathVariable("id") int id, RedirectAttributes redirectAttributes, Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        try {
            if (busServ.deleteBus(id)) {
                redirectAttributes.addFlashAttribute("successMessage", "Xóa xe buýt thành công!");
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy xe buýt để xóa hoặc có lỗi xảy ra.");
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", "Đã xảy ra lỗi khi xóa xe buýt: " + ex.getMessage());
        }
        return "redirect:/buses";
    }
}

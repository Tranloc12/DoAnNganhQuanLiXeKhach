/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.dto.DriverForm; // Đảm bảo đã cập nhật DriverForm nếu không dùng Lombok
import com.nhom12.pojo.Driver;
import com.nhom12.pojo.User;
import com.nhom12.services.DriverService;
import com.nhom12.services.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.springframework.beans.BeanUtils;
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
public class DriverController {

    @Autowired
    private DriverService driverServ;
    @Autowired
    private UserService userServ;

    // Phương thức kiểm tra quyền Admin
    private String checkAdminAccess(Principal principal) {
        if (principal == null) {
            return "redirect:/login"; // Chưa đăng nhập
        }

        User currentUser = userServ.getUserByUsername(principal.getName());
        // Lỗi thường gặp: currentUser có thể null nếu username không tồn tại, hoặc userRole có thể null.
        // Cần xử lý cẩn thận hơn.
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/access-denied"; // Không có quyền Admin
        }
        return null; // Có quyền Admin
    }

    // Hiển thị danh sách tài xế
    @GetMapping("/drivers")
    public String listDrivers(Model model, @RequestParam(name = "kw", required = false) String kw, Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck; // Nếu không có quyền, chuyển hướng
        }

        List<Driver> drivers = driverServ.getDrivers(kw);
        model.addAttribute("drivers", drivers);
        model.addAttribute("kw", kw);

        System.out.println("DEBUG: Number of drivers fetched: " + (drivers != null ? drivers.size() : "null"));
        if (drivers != null) {
            for (Driver d : drivers) {
                System.out.println("DEBUG: Driver ID: " + d.getId() + ", License: " + d.getLicenseNumber());
                // Cố gắng truy cập userId.username NGAY TRONG CONTROLLER
                // Nếu lỗi xảy ra ở đây, vấn đề là ở tầng Service/DAO
                if (d.getUserId() != null) {
                    try {
                        System.out.println("DEBUG: User ID: " + d.getUserId().getId() + ", Username: " + d.getUserId().getUsername());
                    } catch (Exception e) {
                        // Nếu bạn thấy lỗi LazyInitializationException HOẶC bất kỳ lỗi nào khác ở đây,
                        // thì vấn đề nằm ở cách DriverService/DriverRepositoryImpl tải dữ liệu.
                        System.err.println("ERROR: Could not access username for driver ID " + d.getId() + ": " + e.getMessage());
                        e.printStackTrace();
                    }
                } else {
                    System.out.println("DEBUG: User ID for driver ID " + d.getId() + " is null.");
                }
            }
        }
        return "driverList";
    }

    // Các phương thức khác (addOrUpdateDriverView, addOrUpdateDriver, deleteDriver)
    // ... (Không thay đổi từ phiên bản trước, giữ nguyên)
    @GetMapping("/drivers/add-or-update")
    public String addOrUpdateDriverView(@RequestParam(name = "id", required = false) Integer id, Model model, Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        DriverForm driverForm = new DriverForm();
        if (id != null && id > 0) {
            Driver driver = driverServ.getDriverById(id);
            if (driver != null) {
                // Copy properties from POJO to Form DTO
                BeanUtils.copyProperties(driver, driverForm);
                if (driver.getUserId() != null) {
                    driverForm.setUserId(driver.getUserId().getId());
                }
                // Convert Date to String for input type="date"
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                if (driver.getDateOfIssue() != null) {
                    driverForm.setDateOfIssue(dateFormat.format(driver.getDateOfIssue()));
                }
                if (driver.getDateOfExpiry() != null) {
                    driverForm.setDateOfExpiry(dateFormat.format(driver.getDateOfExpiry()));
                }
            } else {
                model.addAttribute("errorMessage", "Không tìm thấy tài xế để cập nhật.");
            }
        } else {
            driverForm.setIsActive(true); // Default new driver to active
        }

        model.addAttribute("driverForm", driverForm);
        model.addAttribute("users", userServ.getUsersByRole("ROLE_DRIVER")); // Ensure this method exists and returns users
        return "addOrUpdateDriver";
    }

    @PostMapping("/drivers/add-or-update")
    public String addOrUpdateDriver(@ModelAttribute("driverForm") @Valid DriverForm driverForm,
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes,
            Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        if (result.hasErrors()) {
            model.addAttribute("users", userServ.getUsersByRole("ROLE_DRIVER"));
            return "addOrUpdateDriver";
        }

        try {
            Driver driver = new Driver();
            if (driverForm.getId() != null && driverForm.getId() > 0) {
                // Fetch existing driver to merge changes, especially for relationships
                Driver existingDriver = driverServ.getDriverById(driverForm.getId());
                if (existingDriver != null) {
                    // Preserve properties that are not directly set by the form, e.g., the User object itself
                    BeanUtils.copyProperties(existingDriver, driver);
                }
            }

            // Copy properties from form to POJO, excluding dates to handle manually
            BeanUtils.copyProperties(driverForm, driver, "dateOfIssue", "dateOfExpiry");

            // Convert String dates from form to Date objects for POJO
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            if (driverForm.getDateOfIssue() != null && !driverForm.getDateOfIssue().isEmpty()) {
                driver.setDateOfIssue(dateFormat.parse(driverForm.getDateOfIssue()));
            }
            if (driverForm.getDateOfExpiry() != null && !driverForm.getDateOfExpiry().isEmpty()) {
                driver.setDateOfExpiry(dateFormat.parse(driverForm.getDateOfExpiry()));
            }

            // Assign User object from userId
            User selectedUser = userServ.getUserById(driverForm.getUserId());
            if (selectedUser == null) {
                model.addAttribute("errorMessage", "Người dùng không hợp lệ.");
                model.addAttribute("users", userServ.getUsersByRole("ROLE_DRIVER"));
                return "addOrUpdateDriver";
            }
            driver.setUserId(selectedUser);

            if (driverServ.addOrUpdateDriver(driver)) {
                redirectAttributes.addFlashAttribute("successMessage", "Thao tác thành công!");
                return "redirect:/drivers";
            } else {
                model.addAttribute("errorMessage", "Thao tác thất bại. Vui lòng thử lại.");
                model.addAttribute("users", userServ.getUsersByRole("ROLE_DRIVER"));
                return "addOrUpdateDriver";
            }
        } catch (ParseException ex) {
            model.addAttribute("errorMessage", "Định dạng ngày không hợp lệ.");
            model.addAttribute("users", userServ.getUsersByRole("ROLE_DRIVER"));
            return "addOrUpdateDriver";
        } catch (Exception ex) {
            ex.printStackTrace(); // Log the full stack trace for debugging
            model.addAttribute("errorMessage", "Đã xảy ra lỗi hệ thống: " + ex.getMessage());
            model.addAttribute("users", userServ.getUsersByRole("ROLE_DRIVER"));
            return "addOrUpdateDriver";
        }
    }

    @GetMapping("/drivers/delete/{id}")
    public String deleteDriver(@PathVariable("id") int id, RedirectAttributes redirectAttributes, Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        try {
            if (driverServ.deleteDriver(id)) {
                redirectAttributes.addFlashAttribute("successMessage", "Xóa tài xế thành công!");
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy tài xế để xóa hoặc có lỗi xảy ra.");
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", "Đã xảy ra lỗi khi xóa tài xế: " + ex.getMessage());
        }
        return "redirect:/drivers";
    }
}

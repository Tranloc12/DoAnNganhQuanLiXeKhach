package com.nhom12.controllers;

import com.nhom12.dto.DriverForm;
import com.nhom12.pojo.Driver;
import com.nhom12.pojo.User;
import com.nhom12.services.DriverService;
import com.nhom12.services.UserService;
import jakarta.validation.Valid;
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

import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

@Controller
public class DriverController {

    @Autowired
    private DriverService driverServ;
    @Autowired
    private UserService userServ;

    private void addCommonAttributes(Model model, DriverForm driverForm) {
        model.addAttribute("driverForm", driverForm);
        model.addAttribute("users", userServ.getUsersByRole("ROLE_DRIVER"));
    }

    // Hiển thị danh sách tài xế
    @GetMapping("/drivers")
    public String listDrivers(Model model, @RequestParam(name = "kw", required = false) String kw) {
        // Giả định quyền admin đã được kiểm tra ở tầng Security
        model.addAttribute("drivers", driverServ.getDrivers(kw));
        model.addAttribute("kw", kw);
        return "driverList";
    }

    // Hiển thị form thêm/cập nhật
    @GetMapping("/drivers/add-or-update")
    public String addOrUpdateDriverView(@RequestParam(name = "id", required = false) Integer id, Model model) {
        DriverForm driverForm = new DriverForm();
        if (id != null && id > 0) {
            Driver driver = driverServ.getDriverById(id);
            if (driver != null) {
                BeanUtils.copyProperties(driver, driverForm);
                if (driver.getUserId() != null) {
                    driverForm.setUserId(driver.getUserId().getId());
                }
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
            driverForm.setIsActive(true);
        }
        addCommonAttributes(model, driverForm);
        return "addOrUpdateDriver";
    }

    // Xử lý form thêm/cập nhật
    @PostMapping("/drivers/add-or-update")
    public String addOrUpdateDriver(@ModelAttribute("driverForm") @Valid DriverForm driverForm,
                                    BindingResult result,
                                    Model model,
                                    RedirectAttributes redirectAttributes) {

        if (result.hasErrors()) {
            addCommonAttributes(model, driverForm);
            return "addOrUpdateDriver";
        }

        try {
            Driver driver = (driverForm.getId() != null && driverForm.getId() > 0)
                    ? driverServ.getDriverById(driverForm.getId())
                    : new Driver();

            BeanUtils.copyProperties(driverForm, driver, "dateOfIssue", "dateOfExpiry");

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            if (driverForm.getDateOfIssue() != null && !driverForm.getDateOfIssue().isEmpty()) {
                driver.setDateOfIssue(dateFormat.parse(driverForm.getDateOfIssue()));
            }
            if (driverForm.getDateOfExpiry() != null && !driverForm.getDateOfExpiry().isEmpty()) {
                driver.setDateOfExpiry(dateFormat.parse(driverForm.getDateOfExpiry()));
            }

            User selectedUser = userServ.getUserById(driverForm.getUserId());
            if (selectedUser == null) {
                model.addAttribute("errorMessage", "Người dùng liên kết không tồn tại.");
                addCommonAttributes(model, driverForm);
                return "addOrUpdateDriver";
            }
            driver.setUserId(selectedUser);

            if (driverServ.addOrUpdateDriver(driver)) {
                redirectAttributes.addFlashAttribute("successMessage", "Thêm/cập nhật tài xế thành công.");
                return "redirect:/drivers";
            } else {
                model.addAttribute("errorMessage", "Thêm/cập nhật tài xế thất bại.");
                addCommonAttributes(model, driverForm);
                return "addOrUpdateDriver";
            }

        } catch (ParseException ex) {
            model.addAttribute("errorMessage", "Lỗi định dạng ngày tháng.");
            addCommonAttributes(model, driverForm);
            return "addOrUpdateDriver";
        } catch (Exception ex) {
            model.addAttribute("errorMessage", "Đã xảy ra lỗi hệ thống: " + ex.getMessage());
            ex.printStackTrace();
            addCommonAttributes(model, driverForm);
            return "addOrUpdateDriver";
        }
    }

    // Xóa tài xế
    @GetMapping("/drivers/delete/{id}")
    public String deleteDriver(@PathVariable("id") int id, RedirectAttributes redirectAttributes) {
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
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.dto.RouteForm;
import com.nhom12.pojo.Route;
import com.nhom12.pojo.User;
import com.nhom12.services.RouteService;
import com.nhom12.services.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
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
public class RouteController {

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

    // Hiển thị danh sách tuyến đường
     @GetMapping("/routes")
    public String listRoutes(Model model,
                             @RequestParam(name = "routeName", required = false) String routeName,
                             @RequestParam(name = "origin", required = false) String origin,
                             @RequestParam(name = "destination", required = false) String destination,
                             @RequestParam(name = "distanceFrom", required = false) Double distanceFrom,
                             @RequestParam(name = "distanceTo", required = false) Double distanceTo,
                             @RequestParam(name = "priceFrom", required = false) Double priceFrom,
                             @RequestParam(name = "priceTo", required = false) Double priceTo,
                             @RequestParam(name = "isActive", required = false) Boolean isActive,
                             Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        List<Route> routes = routeServ.findRoutes(routeName, origin, destination, distanceFrom, distanceTo, priceFrom, priceTo, isActive);
        model.addAttribute("routes", routes);

        // Giữ lại các giá trị lọc trên form để người dùng thấy
        model.addAttribute("routeName", routeName);
        model.addAttribute("origin", origin);
        model.addAttribute("destination", destination);
        model.addAttribute("distanceFrom", distanceFrom);
        model.addAttribute("distanceTo", distanceTo);
        model.addAttribute("priceFrom", priceFrom);
        model.addAttribute("priceTo", priceTo);
        model.addAttribute("isActive", isActive);

        return "routeList"; // Tên file template: routeList.html
    }

    // Hiển thị form thêm/cập nhật tuyến đường
    @GetMapping("/routes/add-or-update")
    public String addOrUpdateRouteView(@RequestParam(name = "id", required = false) Integer id, Model model, Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        RouteForm routeForm = new RouteForm();
        if (id != null && id > 0) {
            Route route = routeServ.getRouteById(id);
            if (route != null) {
                // Copy properties từ Entity sang DTO để hiển thị trên form
                BeanUtils.copyProperties(route, routeForm);
            } else {
                // Xử lý trường hợp không tìm thấy tuyến đường để cập nhật
                model.addAttribute("errorMessage", "Không tìm thấy tuyến đường để cập nhật.");
            }
        }
        model.addAttribute("routeForm", routeForm);
        return "addOrUpdateRoute"; // Tên file template: addOrUpdateRoute.html
    }

    // Xử lý POST request để thêm/cập nhật tuyến đường
    @PostMapping("/routes/add-or-update")
    public String addOrUpdateRoute(@ModelAttribute("routeForm") @Valid RouteForm routeForm,
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
            return "addOrUpdateRoute";
        }

        // Kiểm tra tên tuyến đường trùng lặp
        if (routeServ.isRouteNameExist(routeForm.getRouteName(), routeForm.getId())) {
            model.addAttribute("errorMessage", "Tên tuyến đường đã tồn tại. Vui lòng nhập tên khác.");
            return "addOrUpdateRoute";
        }

        try {
            Route route = new Route();
            // Copy properties từ DTO sang Entity
            BeanUtils.copyProperties(routeForm, route);

            if (routeServ.addOrUpdateRoute(route)) {
                redirectAttributes.addFlashAttribute("successMessage", "Thao tác thành công!");
                return "redirect:/routes"; // Chuyển hướng về danh sách tuyến đường
            } else {
                model.addAttribute("errorMessage", "Thao tác thất bại. Vui lòng thử lại.");
                return "addOrUpdateRoute";
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            model.addAttribute("errorMessage", "Đã xảy ra lỗi hệ thống: " + ex.getMessage());
            return "addOrUpdateRoute";
        }
    }

    // Xóa tuyến đường
    @GetMapping("/routes/delete/{id}")
    public String deleteRoute(@PathVariable("id") int id, RedirectAttributes redirectAttributes, Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        try {
            if (routeServ.deleteRoute(id)) {
                redirectAttributes.addFlashAttribute("successMessage", "Xóa tuyến đường thành công!");
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy tuyến đường để xóa hoặc có lỗi xảy ra.");
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            redirectAttributes.addFlashAttribute("errorMessage", "Đã xảy ra lỗi khi xóa tuyến đường: " + ex.getMessage());
        }
        return "redirect:/routes";
    }
}
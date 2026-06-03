///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.controllers;
//
//import com.nhom12.pojo.GymPackage;
//import com.nhom12.pojo.User;
//import com.nhom12.services.GymPackageService;
//import com.nhom12.services.UserService;
//import jakarta.validation.Valid;
//import java.security.Principal;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.validation.BindingResult;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.servlet.mvc.support.RedirectAttributes;
//
//@Controller
//@RequestMapping("/gym-packages")
//public class GymPackageController {
//
//    @Autowired
//    private GymPackageService gymPackageService;
//
//    @Autowired
//    private UserService userService;
//
//    @GetMapping
//    public String listGymPackages(Model model, Principal principal) {
//        // Kiểm tra quyền admin hoặc manager
//        if (principal == null) {
//            return "redirect:/login";
//        }
//
//        User currentUser = userService.getUserByUsername(principal.getName());
//        if (!"ROLE_ADMIN".equals(currentUser.getUserRole()) && !"ROLE_MANAGER".equals(currentUser.getUserRole())) {
//            return "redirect:/";
//        }
//
//        // Thêm currentUser vào model để navbar hiển thị đúng
//        model.addAttribute("currentUser", currentUser);
//
//        model.addAttribute("gymPackage", new GymPackage()); // để hiện form tạo mới
//        model.addAttribute("gymPackages", gymPackageService.getAllGymPackages()); // để hiện danh sách
//        return "addGymPackage";
//    }
//
//    @GetMapping("/add")
//    public String addGymPackageForm(Model model) {
//        model.addAttribute("gymPackage", new GymPackage());
//        return "redirect:/gym-packages"; // Vì trang /gym-packages đã hiển thị sẵn form
//    }
//
//    @PostMapping("/add")
//    public String addGymPackage(
//            @ModelAttribute("gymPackage") @Valid GymPackage gymPackage,
//            BindingResult result,
//            RedirectAttributes redirectAttributes) {
//        if (result.hasErrors()) {
//            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.gymPackage", result);
//            redirectAttributes.addFlashAttribute("gymPackage", gymPackage);
//            return "redirect:/gym-packages";
//        }
//
//        boolean success = gymPackageService.addGymPackage(gymPackage);
//        if (success) {
//            redirectAttributes.addFlashAttribute("successMessage", "Gói tập đã được thêm thành công!");
//        } else {
//            redirectAttributes.addFlashAttribute("errorMessage", "Thêm gói tập thất bại!");
//        }
//
//        return "redirect:/gym-packages";
//    }
//
//    @GetMapping("/edit/{id}")
//    public String editGymPackage(@PathVariable(name = "id") int id, Model model, Principal principal) {
//        // Kiểm tra quyền admin
//        if (principal == null) {
//            return "redirect:/login";
//        }
//
//        User currentUser = userService.getUserByUsername(principal.getName());
//        if (!"ROLE_ADMIN".equals(currentUser.getUserRole()) && !"ROLE_MANAGER".equals(currentUser.getUserRole())) {
//            return "redirect:/";
//        }
//
//        model.addAttribute("currentUser", currentUser);
//
//        GymPackage gymPackage = gymPackageService.getGymPackageById(id); // Lấy gói tập theo ID
//        if (gymPackage != null) {
//            model.addAttribute("gymPackage", gymPackage); // Thêm gói tập vào model
//            return "editGymPackage"; // Trả về view để chỉnh sửa gói tập
//        }
//        return "redirect:/gym-packages"; // Nếu không tìm thấy, chuyển hướng về danh sách
//    }
//
//    @PostMapping("/edit/{id}")
//    public String updateGymPackage(@PathVariable(name = "id") int id,
//            @ModelAttribute("gymPackage") @Valid GymPackage gymPackage,
//            BindingResult result,
//            RedirectAttributes redirectAttributes) {
//        if (result.hasErrors()) {
//            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.gymPackage", result);
//            redirectAttributes.addFlashAttribute("gymPackage", gymPackage);
//            return "redirect:/gym-packages/edit/" + id; // Nếu có lỗi, chuyển về trang chỉnh sửa
//        }
//
//        // Gán id vào gymPackage để đảm bảo ID chính xác
//        gymPackage.setId(id);
//
//        boolean success = gymPackageService.updateGymPackage(gymPackage);
//        if (success) {
//            redirectAttributes.addFlashAttribute("successMessage", "Gói tập đã được cập nhật thành công!");
//        } else {
//            redirectAttributes.addFlashAttribute("errorMessage", "Cập nhật gói tập thất bại!");
//        }
//
//        return "redirect:/gym-packages"; // Sau khi cập nhật, chuyển hướng về danh sách
//    }
//
//    @GetMapping("/delete/{id}")
//    public String deleteGymPackage(@PathVariable(name = "id") int id, RedirectAttributes redirectAttributes) {
//        if (gymPackageService.deleteGymPackage(id)) {
//            redirectAttributes.addFlashAttribute("successMessage", "Xoá gói tập thành công!");
//        } else {
//            redirectAttributes.addFlashAttribute("errorMessage", "Xoá thất bại!");
//        }
//        return "redirect:/gym-packages"; // Chuyển hướng đến trang danh sách gói tập
//    }
//}

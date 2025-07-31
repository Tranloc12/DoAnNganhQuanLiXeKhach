package com.nhom12.controllers;

import com.nhom12.dto.PassengerInfoForm; // Import the new DTO
import com.nhom12.pojo.PassengerInfo;
import com.nhom12.pojo.User;
import com.nhom12.services.PassengerInfoService;
import com.nhom12.repositories.UserRepository;
import com.nhom12.services.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import org.springframework.beans.BeanUtils; // Import BeanUtils
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


import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Optional;

@Controller
public class PassengerInfoController {

    @Autowired
    private PassengerInfoService passengerInfoService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserService userServ;

    private String checkAdminAccess(Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = Optional.ofNullable(userServ.getUserByUsername(principal.getName()))
                                   .orElse(null);

        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/access-denied";
        }
        return null;
    }


    @GetMapping("/passengers")
    public String listPassengers(Model model, @RequestParam(name = "kw", required = false) String kw,
                                 Principal principal, RedirectAttributes redirectAttributes) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        List<PassengerInfo> passengers = passengerInfoService.getPassengerInfos(kw);
        model.addAttribute("passengers", passengers);
        model.addAttribute("kw", kw);
        return "passengerList";
    }



    @GetMapping("/passengers/add-or-update")
    public String addOrUpdatePassengerView(Model model,@RequestParam(name = "id", required = false) Integer id,
                                         RedirectAttributes redirectAttributes, Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        PassengerInfoForm passengerInfoForm = new PassengerInfoForm();
        if (id != null && id > 0) {
            PassengerInfo passengerInfo = passengerInfoService.getPassengerInfoById(id);
            if (passengerInfo == null) {
                redirectAttributes.addFlashAttribute("errorMessage", "Thông tin hành khách không tìm thấy!");
                return "redirect:/passengers";
            }
            // Copy properties from POJO to Form DTO
            BeanUtils.copyProperties(passengerInfo, passengerInfoForm);
            if (passengerInfo.getUserId() != null) {
                passengerInfoForm.setUserId(passengerInfo.getUserId().getId());
            }
        } else {
            // New passenger: no need to set userId to new User() as DTO handles Integer userId
            // No default values needed for a simple DTO like PassengerInfoForm
        }
        model.addAttribute("passengerInfoForm", passengerInfoForm); // Pass the DTO to the view

        // Populate users for dropdown (unchanged logic)
        populateUsersForDropdown(model, passengerInfoForm.getUserId());

        return "addOrUpdatePassenger";
    }

    // Updated populateUsersForDropdown to accept userId from DTO
    private void populateUsersForDropdown(Model model, Integer selectedUserId) {
        List<User> usersAvailableForPassengerInfo = new ArrayList<>(userRepo.getUsersWithoutPassengerInfo());

        if (selectedUserId != null) {
            User currentUser = userRepo.getUserById(selectedUserId);
            if (currentUser != null && !usersAvailableForPassengerInfo.contains(currentUser)) {
                // If the current user associated with the passenger is not in the list of users without passenger info, add them
                usersAvailableForPassengerInfo.add(currentUser);
            }
        }

        usersAvailableForPassengerInfo.sort(Comparator.comparing(User::getUsername, String.CASE_INSENSITIVE_ORDER));
        model.addAttribute("usersAvailableForPassengerInfo", usersAvailableForPassengerInfo);
    }



    @PostMapping("/passengers/add-or-update")
    public String addOrUpdatePassenger(@ModelAttribute @Valid PassengerInfoForm passengerInfoForm, // Use DTO
                                       BindingResult result,
                                       Model model,
                                       RedirectAttributes redirectAttributes,
                                       Principal principal) { // Add Principal for access check
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        // Repopulate users for dropdown in case of validation errors
        populateUsersForDropdown(model, passengerInfoForm.getUserId());

        // Custom validation for userId using NotNull annotation on DTO is better
        // if (passengerInfoForm.getUserId() == null || passengerInfoForm.getUserId() == 0) {
        //     result.rejectValue("userId", "error.passengerInfo", "Vui lòng chọn một người dùng.");
        // }

        if (result.hasErrors()) {
            return "addOrUpdatePassenger"; // Return to the form with errors
        }

        try {
            PassengerInfo passengerInfo;
            if (passengerInfoForm.getId() != null && passengerInfoForm.getId() > 0) {
                // Fetch existing passenger info for update
                passengerInfo = passengerInfoService.getPassengerInfoById(passengerInfoForm.getId());
                if (passengerInfo == null) {
                    redirectAttributes.addFlashAttribute("errorMessage", "Thông tin hành khách không tìm thấy để cập nhật!");
                    return "redirect:/passengers";
                }
            } else {
                passengerInfo = new PassengerInfo();
            }

            // Copy properties from Form DTO to POJO
            // Exclude userId because it's an Integer in DTO and User object in POJO
            BeanUtils.copyProperties(passengerInfoForm, passengerInfo, "userId");

            // Assign User object from userId
            User selectedUser = userServ.getUserById(passengerInfoForm.getUserId());
            if (selectedUser == null) {
                // This case should ideally be caught by @NotNull on userId in DTO
                // or if an invalid ID is somehow submitted.
                model.addAttribute("errorMessage", "Người dùng được chọn không tồn tại.");
                return "addOrUpdatePassenger";
            }
            passengerInfo.setUserId(selectedUser);

            if (passengerInfoService.addOrUpdatePassengerInfo(passengerInfo)) {
                redirectAttributes.addFlashAttribute("successMessage", "Thông tin hành khách đã được lưu thành công!");
                return "redirect:/passengers";
            } else {
                model.addAttribute("errorMessage", "Lỗi: Người dùng đã được liên kết với thông tin hành khách khác hoặc có lỗi cơ sở dữ liệu!");
                return "addOrUpdatePassenger";
            }
        } catch (Exception ex) {
            ex.printStackTrace(); // Log the full stack trace for debugging
            redirectAttributes.addFlashAttribute("errorMessage", "Đã xảy ra lỗi hệ thống khi lưu: " + ex.getMessage());
            return "redirect:/passengers"; // Redirect to list with error
        }
    }



    @GetMapping("/passengers/delete/{id}")
    public String deletePassenger(@PathVariable int id, RedirectAttributes redirectAttributes, Principal principal) {
        String accessCheck = checkAdminAccess(principal);
        if (accessCheck != null) {
            return accessCheck;
        }

        try {
            if (passengerInfoService.deletePassengerInfo(id)) {
                redirectAttributes.addFlashAttribute("successMessage", "Thông tin hành khách đã được xóa thành công!");
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Không thể xóa thông tin hành khách này: Không tìm thấy hoặc có lỗi xảy ra.");
            }
        } catch (Exception ex) {
            ex.printStackTrace(); // For debugging
            redirectAttributes.addFlashAttribute("errorMessage", "Đã xảy ra lỗi hệ thống khi xóa hành khách: " + ex.getMessage());
        }
        return "redirect:/passengers";
    }
}
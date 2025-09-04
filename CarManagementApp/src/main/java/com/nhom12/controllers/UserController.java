package com.nhom12.controllers;

import com.nhom12.dto.UserForm;
import com.nhom12.pojo.User;
import com.nhom12.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.security.Principal;
import java.util.List;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class UserController {

    @Autowired
    private UserService userServ;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/login")
    public String loginView() {
        return "login";
    }

    @GetMapping("/users/add")
    public String addView(Model model, Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userServ.getUserByUsername(principal.getName());
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        model.addAttribute("userForm", new UserForm());
        return "addUser";
    }

    @PostMapping("/add-user")
    public String addUserView(
            @ModelAttribute("userForm") @Valid UserForm userForm, // Đảm bảo @ModelAttribute khớp với model.addAttribute trong GetMapping
            BindingResult result,
            Model model,
            RedirectAttributes redirectAttributes,
            Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userServ.getUserByUsername(principal.getName());
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        if (result.hasErrors()) {
            return "addUser";
        }

        try {
            // Kiểm tra xem UserForm.getDob() trả về Date hay String
            // Nếu là Date, thì không cần parse lại
            // Nếu là String, thì đoạn code parse hiện tại của bạn có lỗi
            // userForm.getDob().toString() => nếu dob là String, nó sẽ thành "2000-01-01".toString()
            // cần: Date dob = dateFormat.parse(userForm.getDob());
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date dob;
            try {
                dob = dateFormat.parse(userForm.getDob()); // Giả định getDob() trả về String
            } catch (ParseException e) {
                result.rejectValue("dob", "error.userForm", "Định dạng ngày sinh không hợp lệ.");
                return "addUser";
            }

            User u = new User();
            u.setDob(dob);

            u.setEmail(userForm.getEmail());
            u.setUsername(userForm.getUsername());
            // Kiểm tra xem userServ.getUserByUsername có trả về null không nếu username đã tồn tại.
            // Hoặc bạn cần thêm validation ở Service để kiểm tra username duy nhất.
            if (userServ.getUserByUsername(userForm.getUsername()) != null) {
                result.rejectValue("username", "error.userForm", "Tên đăng nhập đã tồn tại.");
                return "addUser";
            }

            u.setPassword(this.passwordEncoder.encode(userForm.getPassword()));
            u.setUserRole(userForm.getUserRole());
            u.setIsActive(true);

            userServ.saveUser(u);

            redirectAttributes.addFlashAttribute("successMessage", "Thêm người dùng thành công!");
            return "redirect:/users"; // <-- Sửa đổi đường dẫn redirect về trang danh sách chung
        } catch (Exception e) {
            e.printStackTrace(); // In stack trace để debug
            redirectAttributes.addFlashAttribute("errorMessage", "Đăng ký thất bại: " + e.getMessage());
            return "addUser"; // Trả về lại form addUser nếu có lỗi không phải validation
        }
    }

    @GetMapping("/users/drivers")
    public String listDrivers(Model model, Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userServ.getUserByUsername(principal.getName());
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        model.addAttribute("drivers", userServ.getUsersByRole("ROLE_DRIVER"));
        return "driverList";
    }

    @GetMapping("/users/passengers")
    public String listPassengers(Model model, Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userServ.getUserByUsername(principal.getName());
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        model.addAttribute("passengers", userServ.getUsersByRole("ROLE_PASSENGER"));
        return "passengerList";
    }

    @GetMapping("/users/staff")
    public String listStaff(Model model, Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }
        User currentUser = userServ.getUserByUsername(principal.getName());
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }
        model.addAttribute("staffs", userServ.getUsersByRole("ROLE_STAFF"));
        return "staffList";
    }

    @GetMapping("/users/managers")
    public String listManagers(Model model, Principal principal) {
        if (principal == null) {
            return "redirect:/login";
        }
        User currentUser = userServ.getUserByUsername(principal.getName());
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }
        model.addAttribute("managers", userServ.getUsersByRole("ROLE_MANAGER"));
        return "managerList";
    }

     @GetMapping("/users")
    public String listAllUsers(Model model,
                               @RequestParam(required = false) String username,
                               @RequestParam(required = false) String email,
                               @RequestParam(required = false) String userRole,
                               @RequestParam(required = false) Boolean isActive) {
        List<User> users = userServ.findUsers(username, email, userRole, isActive);
        
        model.addAttribute("users", users);
        model.addAttribute("username", username);
        model.addAttribute("email", email);
        model.addAttribute("userRole", userRole);
        model.addAttribute("isActive", isActive);

        return "userList";
    }
}
    
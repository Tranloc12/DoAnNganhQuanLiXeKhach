package com.nhom12.controllers;

import com.nhom12.dto.BusForm;
import com.nhom12.pojo.Bus;
import com.nhom12.pojo.User;
import com.nhom12.services.BusService;
import com.nhom12.services.UserService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/buses")
public class ApiBusController {

    @Autowired
    private BusService busServ;

    @Autowired
    private UserService userServ;

    // Kiểm tra quyền admin
    private boolean isAdmin(Principal principal) {
        if (principal == null) return false;
        User currentUser = userServ.getUserByUsername(principal.getName());
        return currentUser != null && "ROLE_ADMIN".equals(currentUser.getUserRole())|| "ROLE_MANAGER".equals(currentUser.getUserRole())|| "ROLE_STAFF".equals(currentUser.getUserRole());
    }

    // Lấy danh sách xe buýt
    @GetMapping
    public ResponseEntity<?> listBuses(@RequestParam(name = "kw", required = false) String kw) {
        List<Bus> buses = busServ.getBuses(kw);
        return ResponseEntity.ok(buses);
    }

    // Lấy chi tiết 1 xe buýt
    @GetMapping("/{id}")
    public ResponseEntity<?> getBus(@PathVariable("id") int id) {
        Bus bus = busServ.getBusById(id);
        if (bus != null)
            return ResponseEntity.ok(bus);
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Không tìm thấy xe buýt"));
    }

    // Thêm xe buýt
    @PostMapping
    public ResponseEntity<?> createBus(@Valid @RequestBody BusForm busForm,
                                       BindingResult result,
                                       Principal principal) {
        if (!isAdmin(principal))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Bạn không có quyền"));

        if (result.hasErrors())
            return ResponseEntity.badRequest().body(result.getAllErrors());

        if (busServ.isLicensePlateExist(busForm.getLicensePlate(), null)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Biển số xe đã tồn tại"));
        }

        Bus bus = new Bus();
        BeanUtils.copyProperties(busForm, bus);

        if (busServ.addOrUpdateBus(bus))
            return ResponseEntity.status(HttpStatus.CREATED).body(bus);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Không thể tạo xe buýt"));
    }

    // Cập nhật xe buýt
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBus(@PathVariable("id") int id,
                                       @Valid @RequestBody BusForm busForm,
                                       BindingResult result,
                                       Principal principal) {
        if (!isAdmin(principal))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Bạn không có quyền"));

        if (result.hasErrors())
            return ResponseEntity.badRequest().body(result.getAllErrors());

        if (busServ.isLicensePlateExist(busForm.getLicensePlate(), id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Biển số xe đã tồn tại"));
        }

        Bus existingBus = busServ.getBusById(id);
        if (existingBus == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Không tìm thấy xe buýt"));

        BeanUtils.copyProperties(busForm, existingBus);

        if (busServ.addOrUpdateBus(existingBus))
            return ResponseEntity.ok(existingBus);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Không thể cập nhật xe buýt"));
    }

    // Xóa xe buýt
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBus(@PathVariable("id") int id, Principal principal) {
        if (!isAdmin(principal))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Bạn không có quyền"));

        if (busServ.deleteBus(id))
            return ResponseEntity.ok(Map.of("message", "Xóa thành công"));

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Không tìm thấy xe buýt"));
    }
}

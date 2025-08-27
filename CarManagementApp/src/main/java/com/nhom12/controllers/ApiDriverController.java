package com.nhom12.controllers;

import com.nhom12.dto.DriverForm;
import com.nhom12.pojo.Driver;
import com.nhom12.pojo.User;
import com.nhom12.services.DriverService;
import com.nhom12.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/drivers")
public class ApiDriverController {

    @Autowired
    private DriverService driverService;

    @Autowired
    private UserService userService;

    private Driver mapFormToDriver(DriverForm driverForm, Driver driver) throws ParseException, IllegalArgumentException {
        BeanUtils.copyProperties(driverForm, driver, "dateOfIssue", "dateOfExpiry");

        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");

        driver.setDateOfIssue(Optional.ofNullable(driverForm.getDateOfIssue())
                                      .filter(s -> !s.isEmpty())
                                      .map(s -> {
                                          try { return df.parse(s); }
                                          catch (ParseException e) { throw new RuntimeException("Invalid dateOfIssue format", e); }
                                      })
                                      .orElse(null));

        driver.setDateOfExpiry(Optional.ofNullable(driverForm.getDateOfExpiry())
                                      .filter(s -> !s.isEmpty())
                                      .map(s -> {
                                          try { return df.parse(s); }
                                          catch (ParseException e) { throw new RuntimeException("Invalid dateOfExpiry format", e); }
                                      })
                                      .orElse(null));

        User selectedUser = userService.getUserById(driverForm.getUserId());
        if (selectedUser == null) {
            throw new IllegalArgumentException("Invalid userId: User not found.");
        }
        driver.setUserId(selectedUser);

        return driver;
    }

    @GetMapping
    public ResponseEntity<List<Driver>> listDrivers(@RequestParam(name = "kw", required = false) String kw) {
        List<Driver> drivers = driverService.getDrivers(kw);
        return new ResponseEntity<>(drivers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Driver> getDriverById(@PathVariable("id") int id) {
        Driver driver = driverService.getDriverById(id);
        if (driver == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver with ID " + id + " not found.");
        }
        return new ResponseEntity<>(driver, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Driver> addDriver(@Valid @RequestBody DriverForm driverForm, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Validation failed: " + bindingResult.getAllErrors());
        }

        try {
            Driver newDriver = new Driver();
            newDriver = mapFormToDriver(driverForm, newDriver);

            if (driverService.addOrUpdateDriver(newDriver)) {
                return new ResponseEntity<>(newDriver, HttpStatus.CREATED);
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create driver.");
            }
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        } catch (IllegalStateException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "System error: " + ex.getMessage(), ex);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Driver> updateDriver(@PathVariable("id") int id,
                                               @Valid @RequestBody DriverForm driverForm,
                                               BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Validation failed: " + bindingResult.getAllErrors());
        }

        Driver existingDriver = driverService.getDriverById(id);
        if (existingDriver == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver with ID " + id + " not found to update.");
        }

        try {
            driverForm.setId(id);
            Driver updatedDriver = mapFormToDriver(driverForm, existingDriver);

            if (driverService.addOrUpdateDriver(updatedDriver)) {
                return new ResponseEntity<>(updatedDriver, HttpStatus.OK);
            } else {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update driver.");
            }
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        } catch (IllegalStateException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, ex.getMessage());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "System error: " + ex.getMessage(), ex);
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDriver(@PathVariable("id") int id) {
        if (!driverService.deleteDriver(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Driver with ID " + id + " not found or deletion failed.");
        }
    }
}
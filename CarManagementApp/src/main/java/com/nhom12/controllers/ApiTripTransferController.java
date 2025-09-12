/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.pojo.TripTransfer;
import com.nhom12.services.TripTransferService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/triptransfers")
public class ApiTripTransferController {

    @Autowired
    private TripTransferService tripTransferService;

    @GetMapping
    public ResponseEntity<List<TripTransfer>> getTripTransfers() {
        List<TripTransfer> tripTransfers = tripTransferService.getTripTransfers();
        return new ResponseEntity<>(tripTransfers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripTransfer> getTripTransferById(@PathVariable int id) {
        TripTransfer tripTransfer = tripTransferService.getTripTransferById(id);
        if (tripTransfer == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(tripTransfer, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<TripTransfer> addTripTransfer(@RequestBody TripTransfer tripTransfer) {
        // Lưu đối tượng mới vào database
        tripTransferService.saveOrUpdateTripTransfer(tripTransfer);

        // Trả về đối tượng đã lưu cùng với mã trạng thái 201 Created
        return new ResponseEntity<>(tripTransfer, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TripTransfer> updateTripTransfer(@PathVariable int id, @RequestBody TripTransfer tripTransfer) {
        // Gán ID từ URL cho đối tượng
        tripTransfer.setId(id);

        // Cập nhật đối tượng trong database
        tripTransferService.saveOrUpdateTripTransfer(tripTransfer);

        // Trả về đối tượng đã cập nhật cùng với mã trạng thái 200 OK
        return new ResponseEntity<>(tripTransfer, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTripTransfer(@PathVariable int id) {
        tripTransferService.deleteTripTransfer(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

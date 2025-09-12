/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.pojo.TransferPoint;
import com.nhom12.services.TransferPointService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/transferpoints")
@CrossOrigin
public class ApiTransferPointController {

    @Autowired
    private TransferPointService transferPointService;

    @GetMapping("/")
    public ResponseEntity<List<TransferPoint>> getAll() {
        return ResponseEntity.ok(transferPointService.getAllTransferPoints());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransferPoint> getById(@PathVariable int id) {
        TransferPoint tp = transferPointService.getTransferPointById(id);
        if (tp != null) {
            return ResponseEntity.ok(tp);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/")
    public ResponseEntity<TransferPoint> add(@RequestBody TransferPoint tp) {
        transferPointService.addOrUpdate(tp);
        return ResponseEntity.ok(tp);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransferPoint> update(@PathVariable int id, @RequestBody TransferPoint tp) {
        tp.setId(id);
        transferPointService.addOrUpdate(tp);
        return ResponseEntity.ok(tp);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        transferPointService.deleteTransferPoint(id);
        return ResponseEntity.noContent().build();
    }
}


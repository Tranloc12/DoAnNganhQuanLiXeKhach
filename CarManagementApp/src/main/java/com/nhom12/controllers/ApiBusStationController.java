/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;


import com.nhom12.pojo.BusStation;
import com.nhom12.services.BusStationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/busstations")
@CrossOrigin
public class ApiBusStationController {

    @Autowired
    private BusStationService busStationService;

    @GetMapping("/")
    public ResponseEntity<List<BusStation>> getAll() {
        return ResponseEntity.ok(busStationService.getAllBusStations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusStation> getById(@PathVariable int id) {
        BusStation busStation = busStationService.getBusStationById(id);
        if (busStation != null) {
            return ResponseEntity.ok(busStation);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/")
    public ResponseEntity<BusStation> add(@RequestBody BusStation busStation) {
        busStationService.addOrUpdate(busStation);
        return ResponseEntity.ok(busStation);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BusStation> update(@PathVariable int id, @RequestBody BusStation busStation) {
        busStation.setId(id);
        busStationService.addOrUpdate(busStation);
        return ResponseEntity.ok(busStation);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        busStationService.deleteBusStation(id);
        return ResponseEntity.noContent().build();
    }
}


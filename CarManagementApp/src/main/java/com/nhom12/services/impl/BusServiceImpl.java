/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;

import com.nhom12.pojo.Bus;
import com.nhom12.repositories.BusRepository;
import com.nhom12.services.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.Session;

import java.util.List;
import org.hibernate.Session;
import org.hibernate.query.Query;

@Service
@Transactional
public class BusServiceImpl implements BusService {

    @Autowired
    private BusRepository busRepo;

    @Override
    public List<Bus> getBuses(String kw) {
        return this.busRepo.getBuses(kw);
    }

    @Override
    public Bus getBusById(int id) {
        return this.busRepo.getBusById(id);
    }

    @Override
    public boolean addOrUpdateBus(Bus bus) {
        // Có thể thêm logic nghiệp vụ trước khi lưu vào DB
        // Ví dụ: kiểm tra trùng biển số xe trước khi thêm mới
        if (bus.getId() == null || bus.getId() == 0) { // Thêm mới
            if (this.isLicensePlateExist(bus.getLicensePlate(), null)) {
                System.err.println("Biển số xe đã tồn tại!");
                return false;
            }
        } else { // Cập nhật
            if (this.isLicensePlateExist(bus.getLicensePlate(), bus.getId())) {
                System.err.println("Biển số xe đã tồn tại cho xe khác!");
                return false;
            }
        }
        return this.busRepo.addOrUpdateBus(bus);
    }

    @Override
    public boolean deleteBus(int id) {
        return this.busRepo.deleteBus(id);
    }

    @Override
    public boolean isLicensePlateExist(String licensePlate, Integer excludeBusId) {
        return this.busRepo.isLicensePlateExist(licensePlate, excludeBusId);
    }

    @PersistenceContext
    private EntityManager entityManager;
    
     @Override
    public long countBuses() {
        Session session = entityManager.unwrap(Session.class);
        Query<Long> query = session.createQuery("SELECT COUNT(b) FROM Bus b", Long.class);
        return query.getSingleResult();
    }
}

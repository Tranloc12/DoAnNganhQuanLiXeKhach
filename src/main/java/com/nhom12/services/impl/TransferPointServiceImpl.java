/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;


import com.nhom12.pojo.TransferPoint;
import com.nhom12.repositories.TransferPointRepository;
import com.nhom12.services.TransferPointService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TransferPointServiceImpl implements TransferPointService {

    @Autowired
    private TransferPointRepository transferPointRepository;

    @Override
    public List<TransferPoint> getAllTransferPoints() {
        return transferPointRepository.getAllTransferPoints();
    }

    @Override
    public TransferPoint getTransferPointById(int id) {
        return transferPointRepository.getTransferPointById(id);
    }

    @Override
    public void addOrUpdate(TransferPoint transferPoint) {
        transferPointRepository.addOrUpdate(transferPoint);
    }

    @Override
    public void deleteTransferPoint(int id) {
        transferPointRepository.deleteTransferPoint(id);
    }
}


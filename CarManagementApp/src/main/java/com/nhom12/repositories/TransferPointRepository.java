/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.TransferPoint;
import java.util.List;

public interface TransferPointRepository {
    List<TransferPoint> getAllTransferPoints();
    TransferPoint getTransferPointById(int id);
    void addOrUpdate(TransferPoint transferPoint);
    void deleteTransferPoint(int id);
}
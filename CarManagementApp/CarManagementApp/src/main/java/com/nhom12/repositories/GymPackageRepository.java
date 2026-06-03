//
///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.repositories;
//
//import com.nhom12.pojo.GymPackage;
//import java.util.List;
//import java.util.Map;
//
//public interface GymPackageRepository {
//    List<GymPackage> getAll(); // Lấy tất cả gói tập
//
//    GymPackage getById(int id); // Lấy gói tập theo ID
//
//    boolean add(GymPackage gymPackage); // Thêm mới gói tập
//
//    boolean update(GymPackage gymPackage); // Cập nhật gói tập
//
//    boolean delete(int id); // Xoá gói tập theo ID
//
//    List<GymPackage> searchByName(String name); // Tìm kiếm gói tập theo tên (tuỳ chọn)
//
//    // Phân trang
//    List<GymPackage> getAllWithPagination(int page, int size);
//
//    long getTotalCount();
//
//    // Lấy packages với rating trung bình
//    List<Map<String, Object>> getAllWithAverageRating(int page, int size);
//}

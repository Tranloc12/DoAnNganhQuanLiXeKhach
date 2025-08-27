///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
// */
//package com.nhom12.services;
//
//import com.nhom12.pojo.GymPackage;
//import java.util.List;
//import java.util.Map;
//
//public interface GymPackageService {
//
//    // Lấy tất cả gói tập
//    List<GymPackage> getAllGymPackages();
//
//    // Lấy gói tập theo ID
//    GymPackage getGymPackageById(int id);
//
//    // Thêm gói tập mới
//    boolean addGymPackage(GymPackage gymPackage);
//
//    // Cập nhật gói tập
//    boolean updateGymPackage(GymPackage gymPackage);
//
//    // Xóa gói tập theo ID
//    boolean deleteGymPackage(int id);
//
//    // Tìm kiếm gói tập theo tên
//    List<GymPackage> searchGymPackagesByName(String name);
//
//    // Phân trang
//    List<GymPackage> getAllGymPackagesWithPagination(int page, int size);
//
//    long getTotalGymPackagesCount();
//
//    // Lấy packages với rating trung bình
//    List<Map<String, Object>> getAllGymPackagesWithAverageRating(int page, int size);
//}

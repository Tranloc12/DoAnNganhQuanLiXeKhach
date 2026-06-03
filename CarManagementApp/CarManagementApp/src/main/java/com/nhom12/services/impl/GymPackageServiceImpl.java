///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.services.impl;
//
//import com.nhom12.pojo.GymPackage;
//import com.nhom12.repositories.GymPackageRepository;
//import com.nhom12.services.GymPackageService;
//import com.nhom12.services.NotificationService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Map;
//
//@Service
//public class GymPackageServiceImpl implements GymPackageService {
//
//    @Autowired
//    private GymPackageRepository gymPackageRepository;
//
//    @Autowired
//    private NotificationService notificationService;
//
//    @Override
//    public List<GymPackage> getAllGymPackages() {
//        return this.gymPackageRepository.getAll(); // Lấy tất cả các gói tập
//    }
//
//    @Override
//    public GymPackage getGymPackageById(int id) {
//        return this.gymPackageRepository.getById(id); // Lấy gói tập theo ID
//    }
//
//    @Override
//    public boolean addGymPackage(GymPackage gymPackage) {
//        try {
//            gymPackageRepository.add(gymPackage);
//            return true;
//        } catch (Exception e) {
//            e.printStackTrace(); // Hoặc logger nếu có
//            return false;
//        }
//    }
//
//    @Override
//    public boolean updateGymPackage(GymPackage gymPackage) {
//        try {
//            GymPackage existingPackage = gymPackageRepository.getById(gymPackage.getId());
//            if (existingPackage != null) {
//                // Lưu discount cũ để so sánh
//                Double oldDiscount = existingPackage.getDiscount();
//                Double newDiscount = gymPackage.getDiscount();
//
//                // Cập nhật các trường của gói tập
//                existingPackage.setNamePack(gymPackage.getNamePack());
//                existingPackage.setPrice(gymPackage.getPrice());
//                existingPackage.setDescription(gymPackage.getDescription());
//
//                if (gymPackage.getDiscount() != null) {
//                    existingPackage.setDiscount(gymPackage.getDiscount());
//                }
//
//                if (gymPackage.getDayswpt() != null) {
//                    existingPackage.setDayswpt(gymPackage.getDayswpt());
//                }
//
//                existingPackage.setIsActive(gymPackage.getIsActive());
//
//                boolean updateResult = gymPackageRepository.update(existingPackage); // Cập nhật gói tập
//
//                // Kiểm tra xem discount có thay đổi không
//                if (updateResult && hasDiscountChanged(oldDiscount, newDiscount)) {
//                    System.out.println("Discount đã thay đổi từ " + oldDiscount + " thành " + newDiscount + " cho gói "
//                            + existingPackage.getNamePack());
//
//                    // Gửi email thông báo cho tất cả members (bất đồng bộ)
//                    try {
//                        // Gọi async method - không cần đợi kết quả
//                        notificationService.sendDiscountNotificationToAllMembers(existingPackage, oldDiscount,
//                                newDiscount);
//                        System.out.println("Đã khởi tạo quá trình gửi email thông báo discount (bất đồng bộ)");
//                    } catch (Exception e) {
//                        System.err.println("Lỗi khi khởi tạo gửi email thông báo discount: " + e.getMessage());
//                        e.printStackTrace();
//                        // Không return false vì việc cập nhật package đã thành công
//                    }
//                }
//
//                return updateResult;
//            }
//            return false;
//        } catch (Exception e) {
//            e.printStackTrace();
//            return false;
//        }
//    }
//
//    /**
//     * Kiểm tra xem discount có thay đổi không
//     */
//    private boolean hasDiscountChanged(Double oldDiscount, Double newDiscount) {
//        // Cả hai đều null -> không thay đổi
//        if (oldDiscount == null && newDiscount == null) {
//            return false;
//        }
//
//        // Một cái null, một cái không null -> có thay đổi
//        if (oldDiscount == null || newDiscount == null) {
//            return true;
//        }
//
//        // Cả hai đều không null -> so sánh giá trị
//        return !oldDiscount.equals(newDiscount);
//    }
//
//    @Override
//    public boolean deleteGymPackage(int id) {
//        return gymPackageRepository.delete(id); // Xóa gói tập theo ID
//    }
//
//    @Override
//    public List<GymPackage> searchGymPackagesByName(String namePack) {
//        return gymPackageRepository.searchByName(namePack); // Tìm kiếm gói tập theo tên
//    }
//
//    @Override
//    public List<GymPackage> getAllGymPackagesWithPagination(int page, int size) {
//        return gymPackageRepository.getAllWithPagination(page, size);
//    }
//
//    @Override
//    public long getTotalGymPackagesCount() {
//        return gymPackageRepository.getTotalCount();
//    }
//
//    @Override
//    public List<Map<String, Object>> getAllGymPackagesWithAverageRating(int page, int size) {
//        return gymPackageRepository.getAllWithAverageRating(page, size);
//    }
//}

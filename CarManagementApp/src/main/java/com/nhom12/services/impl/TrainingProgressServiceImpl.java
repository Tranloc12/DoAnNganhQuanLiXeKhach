///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.services.impl;
//
//import com.nhom12.pojo.TrainingProgress;
//import com.nhom12.repositories.TrainingProgresRepository;
//import com.nhom12.services.TrainingProgresService;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
///**
// *
// * @author HP
// */
//@Service
//public class TrainingProgressServiceImpl implements TrainingProgresService{
//    @Autowired
//    private TrainingProgresRepository trainingProgressRepo;
//
//    @Override
//    public TrainingProgress addTrainingProgress(TrainingProgress tp) {
//        try {
//            return trainingProgressRepo.addTrainingProgress(tp);
//        } catch (Exception e) {
//            throw new RuntimeException("Lỗi khi thêm tiến độ tập luyện", e);
//        }
//    }
//
//    @Override
//    public TrainingProgress updateTrainingProgress(TrainingProgress tp) {
//        try {
//            return trainingProgressRepo.updateTrainingProgress(tp);
//        } catch (Exception e) {
//            throw new RuntimeException("Lỗi khi cập nhật tiến độ tập luyện", e);
//        }
//    }
//
//    @Override
//    public boolean deleteTrainingProgress(int id) {
//        try {
//            return trainingProgressRepo.deleteTrainingProgress(id);
//        } catch (Exception e) {
//            throw new RuntimeException("Lỗi khi xóa tiến độ tập luyện", e);
//        }
//    }
//
//    @Override
//    public List<TrainingProgress> getProgressByMember(int memberInfoId) {
//        try {
//            return trainingProgressRepo.getProgressByMember(memberInfoId);
//        } catch (Exception e) {
//            throw new RuntimeException("Lỗi khi lấy danh sách tiến độ", e);
//        }
//    }
//
//    @Override
//    public TrainingProgress getProgressById(int id) {
//        try {
//            return trainingProgressRepo.getProgressById(id);
//        } catch (Exception e) {
//            throw new RuntimeException("Lỗi khi lấy chi tiết tiến độ", e);
//        }
//    }
//}

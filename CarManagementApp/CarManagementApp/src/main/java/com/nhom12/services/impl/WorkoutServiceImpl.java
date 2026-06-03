///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.services.impl;
//
//import com.nhom12.pojo.Workout;
//import com.nhom12.repositories.WorkoutRepository;
//import com.nhom12.services.WorkoutService;
//import java.util.Date;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
///**
// *
// * @author HP
// */
//@Service
//public class WorkoutServiceImpl implements WorkoutService {
//    @Autowired
//    private WorkoutRepository workoutRepo;
//
//    @Override
//    public List<Workout> getWorkout() {
//        return this.workoutRepo.getWorkout();
//    }
//
//    @Override
//    public Workout createWorkout(Workout w) {
//        return this.workoutRepo.createWorkout(w);
//    }
//
//    @Override
//    public Workout updateWorkout(Workout w) {
//        return this.workoutRepo.updateWorkout(w);
//    }
//
//    @Override
//    public Workout getById(int id) {
//        return this.workoutRepo.getById(id);
//    }
//
//    @Override
//    public List<Workout> findDue15(Date t15, Date t15Next) {
//        return this.workoutRepo.findDue15(t15, t15Next);
//    }
//
//    @Override
//    public List<Workout> findDue30(Date t30, Date t30Next) {
//        return this.workoutRepo.findDue30(t30, t30Next);
//    }
//
//    @Override
//    public void markNotified30(Workout w) {
//        this.workoutRepo.markNotified30(w);
//    }
//
//    @Override
//    public void markNotified15(Workout w) {
//        this.workoutRepo.markNotified15(w);
//    }
//
//    @Override
//    public List<Workout> getWorkoutsBySubscriptionId(int subscriptionId) {
//        return this.workoutRepo.getWorkoutsBySubscriptionId(subscriptionId);
//    }
//
//    @Override
//    public void deleteWorkout(Workout w) {
//        this.workoutRepo.deleteWorkout(w);
//    }
//
//    @Override
//    public List<Workout> getAll() {
//        return this.workoutRepo.getWorkout();
//    }
//}

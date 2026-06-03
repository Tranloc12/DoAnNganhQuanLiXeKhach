///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
// */
//package com.nhom12.repositories;
//
//import com.nhom12.pojo.Workout;
//import java.util.Date;
//import java.util.List;
//
///**
// *
// * @author HP
// */
//public interface WorkoutRepository {
//    List<Workout> getWorkout();
//
//    Workout createWorkout(Workout w);
//
//    Workout updateWorkout(Workout w);
//
//    Workout getById(int id);
//
//    List<Workout> findDue15(Date t15, Date t15Next);
//
//    List<Workout> findDue30(Date t30, Date t30Next);
//
//    void markNotified30(Workout w);
//
//    void markNotified15(Workout w);
//
//    List<Workout> getWorkoutsBySubscriptionId(int subscriptionId);
//
//    void deleteWorkout(Workout w);
//}

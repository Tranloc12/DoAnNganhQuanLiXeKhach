///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
// */
//package com.nhom12.services;
//
//import com.nhom12.pojo.Subscription;
//import com.nhom12.pojo.User;
//import java.util.Date;
//import java.util.List;
//
///**
// *
// * @author HP
// */
//public interface SubscriptionService {
//    Subscription addSubscription(Subscription sub);
//
//    Subscription updateSubscription(Subscription sub);
//
//    List<Subscription> getSubscriptionsByMember(User member);
//
//    List<Subscription> getSubscriptionsByTrainer(User trainer);
//
//    Subscription getActiveSubscription(User member);
//
//    boolean isTrainerAvailable(User trainer, Date startTime, Date endTime);
//
//    boolean isSelfTrainingSlotAvailable(Date startTime, Date endTime);
//
//    boolean cancelSubscription(int subscriptionId);
//
//    Subscription getSubscriptionsById(int id);
//
//    List<Subscription> getAll();
//
//    List<Subscription> getSubscriptionsByMemberId(int id);
//
//    List<Subscription> findDue7(Date start, Date end);
//
//    List<Subscription> findSubscriptionsExpiringSoon(Date sevenDaysLater);
//
//    void markNotified7(Subscription sub);
//
//    void resetAllNotified7();
//
//    /**
//     * Atomically update remaining sessions to avoid deadlocks
//     * 
//     * @param subscriptionId ID of the subscription
//     * @param delta          Change in remaining sessions (+1 for increase, -1 for
//     *                       decrease)
//     * @return number of rows affected (1 if successful, 0 if failed)
//     */
//    int updateRemainingSessions(int subscriptionId, int delta);
//}

///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.services.impl;
//
//import com.nhom12.pojo.Subscription;
//import com.nhom12.pojo.User;
//import com.nhom12.repositories.SubscriptionRepository;
//import com.nhom12.services.SubscriptionService;
//import java.util.Date;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
//import org.springframework.stereotype.Service;
//
///**
// *
// * @author HP
// */
//@Service
//public class SubscriptionServiceImpl implements SubscriptionService {
//
//    @Autowired
//    private SubscriptionRepository subRepo;
//
//    @Autowired
//    private LocalSessionFactoryBean factory;
//
//    @Override
//    public Subscription addSubscription(Subscription sub) {
//        return this.subRepo.addSubscription(sub);
//    }
//
//    @Override
//    public Subscription updateSubscription(Subscription sub) {
//        return this.subRepo.updateSubscription(sub);
//    }
//
//    @Override
//    public List<Subscription> getSubscriptionsByMember(User member) {
//        return this.subRepo.getSubscriptionsByMember(member);
//    }
//
//    @Override
//    public List<Subscription> getSubscriptionsByTrainer(User trainer) {
//        return this.subRepo.getSubscriptionsByTrainer(trainer);
//    }
//
//    @Override
//    public Subscription getActiveSubscription(User member) {
//        return this.subRepo.getActiveSubscription(member);
//    }
//
//    @Override
//    public boolean isTrainerAvailable(User trainer, Date startTime, Date endTime) {
//        return this.subRepo.isTrainerAvailable(trainer, startTime, endTime);
//    }
//
//    @Override
//    public boolean isSelfTrainingSlotAvailable(Date startTime, Date endTime) {
//        return this.subRepo.isSelfTrainingSlotAvailable(startTime, endTime);
//    }
//
//    @Override
//    public boolean cancelSubscription(int subscriptionId) {
//        return this.subRepo.cancelSubscription(subscriptionId);
//    }
//
//    @Override
//    public Subscription getSubscriptionsById(int id) {
//        return this.subRepo.getSubscriptionsById(id);
//    }
//
//    @Override
//    public List<Subscription> getAll() {
//        return this.subRepo.findAll();
//    }
//
//    @Override
//    public List<Subscription> getSubscriptionsByMemberId(int id) {
//        return this.subRepo.getSubscriptionsByMemberId(id);
//    }
//
//    @Override
//    public List<Subscription> findDue7(Date start, Date end) {
//        return this.subRepo.findDue7(start, end);
//    }
//
//    @Override
//    public List<Subscription> findSubscriptionsExpiringSoon(Date sevenDaysLater) {
//        return this.subRepo.findSubscriptionsExpiringSoon(sevenDaysLater);
//    }
//
//    @Override
//    public void markNotified7(Subscription sub) {
//        this.subRepo.markNotified7(sub);
//    }
//
//    @Override
//    public void resetAllNotified7() {
//        this.subRepo.resetAllNotified7();
//    }
//
//    @Override
//    public int updateRemainingSessions(int subscriptionId, int delta) {
//        return this.subRepo.updateRemainingSessions(subscriptionId, delta);
//    }
//}

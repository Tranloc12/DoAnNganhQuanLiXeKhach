///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.repositories.impl;
//
//import com.nhom12.pojo.TrainingProgress;
//import com.nhom12.repositories.TrainingProgresRepository;
//import jakarta.persistence.criteria.CriteriaBuilder;
//import jakarta.persistence.criteria.CriteriaQuery;
//import jakarta.persistence.criteria.Root;
//import java.util.List;
//import org.hibernate.Session;
//import org.hibernate.query.Query;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
//import org.springframework.stereotype.Repository;
//import org.springframework.transaction.annotation.Transactional;
//
///**
// *
// * @author HP
// */
//@Repository
//@Transactional
//public class TrainingProgresRepositoryImpl implements TrainingProgresRepository{
//    @Autowired
//    private LocalSessionFactoryBean factory;
//
//    @Override
//    public TrainingProgress addTrainingProgress(TrainingProgress tp) {
//        Session s = factory.getObject().getCurrentSession();
//        s.persist(tp);
//        s.flush();
//        return tp;
//    }
//
//    @Override
//    public TrainingProgress updateTrainingProgress(TrainingProgress tp) {
//        Session s = factory.getObject().getCurrentSession();
//        return s.merge(tp);
//    }
//
//    @Override
//    public boolean deleteTrainingProgress(int id) {
//        Session s = factory.getObject().getCurrentSession();
//        TrainingProgress tp = s.get(TrainingProgress.class, id);
//        if (tp != null) {
//            s.delete(tp);
//            return true;
//        }
//        return false;
//    }
//
//    @Override
//    public List<TrainingProgress> getProgressByMember(int memberInfoId) {
//        Session s = factory.getObject().getCurrentSession();
//        
//        System.out.println("com.nhom12.repositories.impl.TrainingProgresRepositoryImpl.getProgressByMember()" + memberInfoId);
//        Query q = s.createNamedQuery("TrainingProgress.findByMemberInfoId", TrainingProgress.class);
//        q.setParameter("memberInfoId", memberInfoId);
//        System.out.println("com.nhom12.repositories.impl.TrainingProgresRepositoryImpl.getProgressByMember()" + q.getResultList());
//        return q.getResultList();
//    }
//
//    @Override
//    public TrainingProgress getProgressById(int id) {
//        Session s = factory.getObject().getCurrentSession();
//        return s.get(TrainingProgress.class, id);
//    }
//    
//    
//}

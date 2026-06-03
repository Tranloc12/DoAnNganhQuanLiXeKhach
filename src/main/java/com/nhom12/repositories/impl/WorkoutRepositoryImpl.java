/////*
//// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
//// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
//// */
//package com.nhom12.repositories.impl;
//
//import com.nhom12.pojo.Workout;
//import com.nhom12.repositories.WorkoutRepository;
//import jakarta.persistence.Query;
//import jakarta.persistence.criteria.CriteriaBuilder;
//import jakarta.persistence.criteria.CriteriaQuery;
//import jakarta.persistence.criteria.Predicate;
//import jakarta.persistence.criteria.Root;
//import java.util.Date;
//import java.util.List;
//import org.hibernate.Session;
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
//public class WorkoutRepositoryImpl implements WorkoutRepository {
//    @Autowired
//    private LocalSessionFactoryBean factory;
//
//    public List<Workout> getWorkout() {
//        Session s = this.factory.getObject().getCurrentSession();
//        Query query = s.createQuery("FROM Workout", Workout.class);
//        return query.getResultList();
//    }
//
//    @Override
//    public Workout createWorkout(Workout w) {
//        Session s = this.factory.getObject().getCurrentSession();
//        s.persist(w);
//        return w;
//    }
//
//    @Override
//    public Workout updateWorkout(Workout w) {
//        Session s = this.factory.getObject().getCurrentSession();
//        s.merge(w);
//        return w;
//    }
//
//    @Override
//    public Workout getById(int id) {
//        Session session = this.factory.getObject().getCurrentSession();
//        return session.get(Workout.class, id);
//    }
//
//    @Override
//    public List<Workout> findDue30(Date t30, Date t30Next) {
//        Session session = this.factory.getObject().getCurrentSession();
//        CriteriaBuilder cb = session.getCriteriaBuilder();
//        CriteriaQuery<Workout> cq = cb.createQuery(Workout.class);
//        Root<Workout> root = cq.from(Workout.class);
//
//        // Xử lý cả trường hợp NULL và false cho notified30
//        Predicate notNotified = cb.or(
//                cb.isNull(root.get("notified30")),
//                cb.isFalse(root.get("notified30")));
//        Predicate inWindow = cb.between(root.get("startTime"), t30, t30Next);
//
//        cq.where(cb.and(notNotified, inWindow));
//
//        System.out.println("findDue30 - t30: " + t30 + ", t30Next: " + t30Next);
//        List<Workout> results = session.createQuery(cq).getResultList();
//        System.out.println("findDue30 - Found " + results.size() + " workouts");
//
//        return results;
//    }
//
//    @Override
//    public List<Workout> findDue15(Date t15, Date t15Next) {
//        Session session = this.factory.getObject().getCurrentSession();
//        CriteriaBuilder cb = session.getCriteriaBuilder();
//        CriteriaQuery<Workout> cq = cb.createQuery(Workout.class);
//        Root<Workout> root = cq.from(Workout.class);
//
//        // Xử lý cả trường hợp NULL và false cho notified15
//        Predicate notNotified = cb.or(
//                cb.isNull(root.get("notified15")),
//                cb.isFalse(root.get("notified15")));
//        Predicate inWindow = cb.between(root.get("startTime"), t15, t15Next);
//
//        cq.where(cb.and(notNotified, inWindow));
//
//        System.out.println("findDue15 - t15: " + t15 + ", t15Next: " + t15Next);
//        List<Workout> results = session.createQuery(cq).getResultList();
//        System.out.println("findDue15 - Found " + results.size() + " workouts");
//
//        return results;
//    }
//
//    @Transactional
//    @Override
//    public void markNotified30(Workout w) {
//        Session s = this.factory.getObject().getCurrentSession();
//        w.setNotified30(true);
//        s.update(w);
//    }
//
//    @Transactional
//    @Override
//    public void markNotified15(Workout w) {
//        Session s = this.factory.getObject().getCurrentSession();
//        w.setNotified15(true);
//        s.update(w);
//    }
//
//    @Override
//    public List<Workout> getWorkoutsBySubscriptionId(int subscriptionId) {
//        Session session = this.factory.getObject().getCurrentSession();
//        CriteriaBuilder cb = session.getCriteriaBuilder();
//        CriteriaQuery<Workout> cq = cb.createQuery(Workout.class);
//        Root<Workout> root = cq.from(Workout.class);
//
//        Predicate subEquals = cb.equal(root.get("subscriptionId").get("id"), subscriptionId);
//
//        cq.where(subEquals);
//        return session.createQuery(cq).getResultList();
//    }
//
//    @Transactional
//    @Override
//    public void deleteWorkout(Workout w) {
//        Session s = this.factory.getObject().getCurrentSession();
//        s.delete(w);
//    }
//}

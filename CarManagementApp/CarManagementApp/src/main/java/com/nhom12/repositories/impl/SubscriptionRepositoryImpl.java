///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.repositories.impl;
//
//import com.nhom12.pojo.Subscription;
//import com.nhom12.pojo.User;
//import com.nhom12.repositories.SubscriptionRepository;
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
//public class SubscriptionRepositoryImpl implements SubscriptionRepository {
//
//    @Autowired
//    private LocalSessionFactoryBean factory;
//
//    @Override
//    public Subscription addSubscription(Subscription sub) {
//        Session s = factory.getObject().getCurrentSession();
//        s.persist(sub);
//        s.flush();
//        return sub;
//    }
//
//    @Override
//    public Subscription updateSubscription(Subscription sub) {
//        Session s = factory.getObject().getCurrentSession();
//        return (Subscription) s.merge(sub);
//    }
//
//    @Override
//    public List<Subscription> getSubscriptionsByMember(User member) {
//        Session s = factory.getObject().getCurrentSession();
//        Query q = s.createQuery("FROM Subscription WHERE memberId = :member", Subscription.class);
//        q.setParameter("member", member);
//        return q.getResultList();
//    }
//
//    @Override
//    public List<Subscription> getSubscriptionsByTrainer(User trainer) {
//        Session s = factory.getObject().getCurrentSession();
//        Query q = s.createQuery("FROM Subscription WHERE trainerId = :trainer", Subscription.class);
//        q.setParameter("trainer", trainer);
//        return q.getResultList();
//    }
//
//    @Override
//    public Subscription getActiveSubscription(User member) {
//        Session s = factory.getObject().getCurrentSession();
//        Query q = s.createQuery("FROM Subscription WHERE memberId = :member AND isActive = true", Subscription.class);
//        q.setParameter("member", member);
//        return (Subscription) q.getSingleResult();
//    }
//
//    @Override
//    public boolean isTrainerAvailable(User trainer, Date startTime, Date endTime) {
//        Session s = factory.getObject().getCurrentSession();
//        Query q = s.createQuery("SELECT COUNT(*) FROM Subscription s WHERE "
//                + "s.trainerId = :trainer AND "
//                + "((s.startDate <= :end AND s.endDate >= :start))");
//        q.setParameter("trainer", trainer);
//        q.setParameter("start", startTime);
//        q.setParameter("end", endTime);
//        Long count = (Long) q.getSingleResult();
//        return count == 0;
//    }
//
//    @Override
//    public boolean cancelSubscription(int subscriptionId) {
//        Session s = factory.getObject().getCurrentSession();
//        Subscription sub = s.get(Subscription.class, subscriptionId);
//        if (sub != null) {
//            sub.setIsActive(false);
//            sub.setEndDate(new Date());
//            s.update(sub);
//            return true;
//        }
//        return false;
//    }
//
//    @Override
//    public boolean isSelfTrainingSlotAvailable(Date startTime, Date endTime) {
//        Date currentTime = new Date();
//        if (startTime.before(currentTime)) {
//            return false; // Không cho phép đăng ký giờ tập trong quá khứ
//        }
//        return true;
//    }
//
//    @Override
//    public Subscription getSubscriptionsById(int id) {
//        Session session = this.factory.getObject().getCurrentSession();
//        return session.get(Subscription.class, id);
//    }
//
//    @Override
//    public List<Subscription> findAll() {
//        Session session = this.factory.getObject().getCurrentSession();
//        return session.createQuery("FROM Subscription", Subscription.class).getResultList();
//    }
//
//    @Override
//    public List<Subscription> getSubscriptionsByMemberId(int id) {
//        Session session = this.factory.getObject().getCurrentSession();
//
//        Query q = session.createQuery("FROM Subscription s WHERE s.memberId.id = :memberId ORDER BY s.startDate DESC");
//        q.setParameter("memberId", id);
//        return q.getResultList();
//    }
//
//    @Override
//    public List<Subscription> findDue7(Date start, Date end) {
//        Session session = factory.getObject().getCurrentSession();
//        CriteriaBuilder cb = session.getCriteriaBuilder();
//        CriteriaQuery<Subscription> cq = cb.createQuery(Subscription.class);
//        Root<Subscription> root = cq.from(Subscription.class);
//
//        // Điều kiện: endDate nằm trong khoảng [start, end] và chưa được thông báo
//        // (notified7 = false)
//        Predicate notNotified = cb.isFalse(root.get("notified7"));
//        Predicate inWindow = cb.between(root.get("endDate"), start, end);
//
//        cq.where(cb.and(notNotified, inWindow));
//        return session.createQuery(cq).getResultList();
//    }
//
//    @Override
//    public List<Subscription> findSubscriptionsExpiringSoon(Date sevenDaysLater) {
//        Session session = factory.getObject().getCurrentSession();
//        CriteriaBuilder cb = session.getCriteriaBuilder();
//        CriteriaQuery<Subscription> cq = cb.createQuery(Subscription.class);
//        Root<Subscription> root = cq.from(Subscription.class);
//
//        Date now = new Date();
//
//        // Điều kiện: endDate <= sevenDaysLater và endDate >= now (chưa hết hạn) và
//        // isActive = true
//        Predicate endDateSoon = cb.lessThanOrEqualTo(root.get("endDate"), sevenDaysLater);
//        Predicate notExpired = cb.greaterThanOrEqualTo(root.get("endDate"), now);
//        Predicate isActive = cb.isTrue(root.get("isActive"));
//
//        cq.where(cb.and(endDateSoon, notExpired, isActive));
//        return session.createQuery(cq).getResultList();
//    }
//
//    @Transactional
//    @Override
//    public void markNotified7(Subscription sub) {
//        Session s = factory.getObject().getCurrentSession();
//        sub.setNotified7(true);
//        s.update(sub);
//    }
//
//    @Transactional
//    @Override
//    public void resetAllNotified7() {
//        Session session = factory.getObject().getCurrentSession();
//        // Reset tất cả notified7 về false cho các subscription đang active
//        String hql = "UPDATE Subscription SET notified7 = false WHERE isActive = true";
//        session.createQuery(hql).executeUpdate();
//    }
//
//    @Transactional
//    @Override
//    public int updateRemainingSessions(int subscriptionId, int delta) {
//        Session session = factory.getObject().getCurrentSession();
//
//        // Use atomic SQL update to avoid deadlocks
//        String hql = "UPDATE Subscription SET remainingSessions = remainingSessions + :delta " +
//                "WHERE id = :subscriptionId AND (remainingSessions + :delta) >= 0";
//
//        Query query = session.createQuery(hql);
//        query.setParameter("delta", delta);
//        query.setParameter("subscriptionId", subscriptionId);
//
//        int rowsAffected = query.executeUpdate();
//        session.flush(); // Ensure the update is committed immediately
//
//        return rowsAffected;
//    }
//}

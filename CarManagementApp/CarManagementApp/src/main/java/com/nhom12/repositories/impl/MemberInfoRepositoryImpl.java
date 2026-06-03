///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.repositories.impl;
//
//import com.nhom12.pojo.MemberInfo;
//import com.nhom12.repositories.MemberInfoRepository;
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
//public class MemberInfoRepositoryImpl implements MemberInfoRepository {
//
//    @Autowired
//    private LocalSessionFactoryBean factory;
//
//    @Override
//    public List<MemberInfo> getAllMembers() {
//        Session session = this.factory.getObject().getCurrentSession();
//        Query<MemberInfo> query = session.createQuery("FROM MemberInfo", MemberInfo.class);
//        return query.getResultList();
//    }
//
//    @Override
//    public MemberInfo addMemberInfo(MemberInfo m) {
//        Session s = this.factory.getObject().getCurrentSession();
//        s.persist(m);
//        s.flush();
//        return m;
//    }
//
//    @Override
//    public MemberInfo getMemberInfoByUserId(Integer id) {
//        Session s = this.factory.getObject().getCurrentSession();
//        Query q = s.createQuery("FROM MemberInfo m WHERE m.userId.id = :userId", MemberInfo.class);
//        q.setParameter("userId", id);
//        List<MemberInfo> results = q.getResultList();
//        return results.isEmpty() ? null : results.get(0);
//    }
//
//    @Override
//    public MemberInfo getMemberInfoById(int id) {
//        Session session = factory.getObject().getCurrentSession();
//        return session.get(MemberInfo.class, id);
//    }
//
//}

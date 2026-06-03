///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//
//package com.nhom12.repositories.impl;
//
//import com.nhom12.pojo.GymPackage;
//import com.nhom12.repositories.GymPackageRepository;
//import jakarta.persistence.Query;
//import java.util.List;
//import java.util.Map;
//import java.util.HashMap;
//import java.util.ArrayList;
//import org.hibernate.Session;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
//import org.springframework.stereotype.Repository;
//import org.springframework.transaction.annotation.Transactional;
//
//@Repository
//@Transactional
//public class GymPackageRepositoryImpl implements GymPackageRepository {
//
//    @Autowired
//    private LocalSessionFactoryBean factory;
//
//    @Override
//    public List<GymPackage> getAll() {
//        Session session = this.factory.getObject().getCurrentSession();
//        Query query = session.createQuery("FROM GymPackage", GymPackage.class); // Lấy tất cả gói tập
//        return query.getResultList();
//    }
//
//    @Override
//    public GymPackage getById(int id) {
//        Session session = this.factory.getObject().getCurrentSession();
//        return session.get(GymPackage.class, id); // Lấy gói tập theo ID
//    }
//
//    @Override
//    public boolean add(GymPackage gymPackage) {
//        try {
//            Session session = this.factory.getObject().getCurrentSession();
//            session.persist(gymPackage); // Thêm mới gói tập
//            return true;
//        } catch (Exception e) {
//            return false;
//        }
//    }
//
//    @Override
//    public boolean update(GymPackage gymPackage) {
//        try {
//            Session session = this.factory.getObject().getCurrentSession();
//            session.update(gymPackage); // Cập nhật gói tập
//            return true;
//        } catch (Exception e) {
//            return false;
//        }
//    }
//
//    @Override
//    public boolean delete(int id) {
//        try {
//            Session session = this.factory.getObject().getCurrentSession();
//            GymPackage gymPackage = session.get(GymPackage.class, id);
//            if (gymPackage != null) {
//                session.delete(gymPackage); // Xoá gói tập theo ID
//                return true;
//            }
//        } catch (Exception e) {
//            return false;
//        }
//        return false;
//    }
//
//    @Override
//    public List<GymPackage> searchByName(String name) {
//        Session session = this.factory.getObject().getCurrentSession();
//        Query query = session.createQuery("FROM GymPackage WHERE name LIKE :name", GymPackage.class);
//        query.setParameter("name", "%" + name + "%"); // Tìm kiếm gói tập theo tên
//        return query.getResultList();
//    }
//
//    @Override
//    public List<GymPackage> getAllWithPagination(int page, int size) {
//        Session session = this.factory.getObject().getCurrentSession();
//        Query query = session.createQuery("FROM GymPackage ORDER BY id DESC", GymPackage.class);
//        query.setFirstResult(page * size);
//        query.setMaxResults(size);
//        return query.getResultList();
//    }
//
//    @Override
//    public long getTotalCount() {
//        Session session = this.factory.getObject().getCurrentSession();
//        Query query = session.createQuery("SELECT COUNT(g) FROM GymPackage g", Long.class);
//        return (Long) query.getSingleResult();
//    }
//
//    @Override
//    public List<Map<String, Object>> getAllWithAverageRating(int page, int size) {
//        Session session = this.factory.getObject().getCurrentSession();
//
//        // HQL query để lấy packages với rating trung bình
//        String hql = "SELECT g.id, g.namePack, g.price, g.choice, g.description, g.dayswpt, g.discount, g.isActive, " +
//                "COALESCE(AVG(CAST(r.rating AS double)), 0.0) as avgRating, " +
//                "COUNT(r.id) as reviewCount " +
//                "FROM GymPackage g " +
//                "LEFT JOIN Subscription s ON s.packageId.id = g.id " +
//                "LEFT JOIN Review r ON r.subscriptionId.id = s.id " +
//                "GROUP BY g.id, g.namePack, g.price, g.choice, g.description, g.dayswpt, g.discount, g.isActive " +
//                "ORDER BY g.id DESC";
//
//        Query query = session.createQuery(hql);
//        query.setFirstResult(page * size);
//        query.setMaxResults(size);
//
//        List<Object[]> results = query.getResultList();
//        List<Map<String, Object>> packages = new ArrayList<>();
//
//        for (Object[] row : results) {
//            Map<String, Object> packageData = new HashMap<>();
//            packageData.put("id", row[0]);
//            packageData.put("namePack", row[1]);
//            packageData.put("price", row[2]);
//            packageData.put("choice", row[3]);
//            packageData.put("description", row[4]);
//            packageData.put("dayswpt", row[5]);
//            packageData.put("discount", row[6]);
//            packageData.put("isActive", row[7]);
//            packageData.put("avgRating", row[8]);
//            packageData.put("reviewCount", row[9]);
//            packages.add(packageData);
//        }
//
//        return packages;
//    }
//}

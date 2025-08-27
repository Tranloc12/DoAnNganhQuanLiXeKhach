
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

import com.nhom12.pojo.Driver;
import com.nhom12.repositories.DriverRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional; // <-- Đảm bảo có import này
import java.util.List;

@Repository
@Transactional
public class DriverRepositoryImpl implements DriverRepository {

    @Autowired
    private LocalSessionFactoryBean sessionFactory;

    @Override
    public List<Driver> getDrivers(String kw) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        StringBuilder hql = new StringBuilder("FROM Driver d JOIN FETCH d.userId u WHERE 1=1");
        if (kw != null && !kw.isEmpty()) {
            hql.append(" AND (u.username LIKE :kw OR d.licenseNumber LIKE :kw OR d.contactNumber LIKE :kw)");
        }
        Query<Driver> query = session.createQuery(hql.toString(), Driver.class);
        if (kw != null && !kw.isEmpty()) {
            query.setParameter("kw", "%" + kw.trim() + "%");
        }
        return query.getResultList();
    }

    @Override
    public Driver getDriverById(int id) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        Query<Driver> query = session.createQuery("FROM Driver d JOIN FETCH d.userId WHERE d.id = :id", Driver.class)
                .setParameter("id", id);
        return query.uniqueResult();
    }

    @Override
    public boolean addOrUpdateDriver(Driver driver) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        try {
            if (driver.getId() == null || driver.getId() == 0) {
                session.persist(driver);
            } else {
                session.merge(driver);
            }
            return true;
        } catch (Exception ex) {
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteDriver(int id) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        Driver driver = session.get(Driver.class, id);
        if (driver != null) {
            session.delete(driver);
            return true;
        }
        return false;
    }

    @Override
    public long countDrivers() {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        Query<Long> query = session.createQuery("SELECT COUNT(d) FROM Driver d", Long.class);
        return query.getSingleResult();
    }
    
    // <-- Phương thức mới để kiểm tra trùng lặp
    @Override
    public boolean isLicenseNumberExists(String licenseNumber, Integer driverId) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        String hql = "SELECT COUNT(d) FROM Driver d WHERE d.licenseNumber = :licenseNumber";
        if (driverId != null) {
            hql += " AND d.id != :driverId";
        }
        Query<Long> query = session.createQuery(hql, Long.class);
        query.setParameter("licenseNumber", licenseNumber);
        if (driverId != null) {
            query.setParameter("driverId", driverId);
        }
        return query.getSingleResult() > 0;
    }
}
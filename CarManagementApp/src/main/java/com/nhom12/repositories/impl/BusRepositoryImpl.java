/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

import com.nhom12.pojo.Bus;
import com.nhom12.repositories.BusRepository;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.query.Query; // Đảm bảo import đúng Query
 // Hoặc jakarta.persistence.NoResultException

import java.util.List;

@Repository
@Transactional
public class BusRepositoryImpl implements BusRepository {

    @Autowired
    private LocalSessionFactoryBean sessionFactory;

    @Override
    public List<Bus> getBuses(String kw) {
        Session session = sessionFactory.getObject().getCurrentSession();
        StringBuilder hql = new StringBuilder("FROM Bus b WHERE 1=1");

        if (kw != null && !kw.isEmpty()) {
            hql.append(" AND (b.licensePlate LIKE :kw OR b.model LIKE :kw OR b.description LIKE :kw)");
        }

        Query<Bus> query = session.createQuery(hql.toString(), Bus.class);

        if (kw != null && !kw.isEmpty()) {
            query.setParameter("kw", "%" + kw + "%");
        }

        return query.getResultList();
    }

    @Override
    public Bus getBusById(int id) {
        Session session = sessionFactory.getObject().getCurrentSession();
        return session.get(Bus.class, id);
    }

    @Override
    public boolean addOrUpdateBus(Bus bus) {
        Session session = sessionFactory.getObject().getCurrentSession();
        try {
            if (bus.getId() == null || bus.getId() == 0) {
                session.save(bus); // Thêm mới
            } else {
                session.update(bus); // Cập nhật
            }
            return true;
        } catch (Exception ex) {
            System.err.println("Lỗi khi thêm/cập nhật xe buýt: " + ex.getMessage());
            ex.printStackTrace(); // In stack trace để debug chi tiết
            return false;
        }
    }

    @Override
    public boolean deleteBus(int id) {
        Session session = sessionFactory.getObject().getCurrentSession();
        try {
            Bus bus = session.get(Bus.class, id);
            if (bus != null) {
                session.delete(bus);
                return true;
            }
            return false; // Không tìm thấy xe để xóa
        } catch (Exception ex) {
            System.err.println("Lỗi khi xóa xe buýt: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean isLicensePlateExist(String licensePlate, Integer excludeBusId) {
        Session session = sessionFactory.getObject().getCurrentSession();
        StringBuilder hql = new StringBuilder("SELECT COUNT(b) FROM Bus b WHERE b.licensePlate = :licensePlate");

        if (excludeBusId != null && excludeBusId > 0) {
            hql.append(" AND b.id != :excludeBusId");
        }

        Query<Long> query = session.createQuery(hql.toString(), Long.class);
        query.setParameter("licensePlate", licensePlate);

        if (excludeBusId != null && excludeBusId > 0) {
            query.setParameter("excludeBusId", excludeBusId);
        }

        return query.getSingleResult() > 0;
    }
}

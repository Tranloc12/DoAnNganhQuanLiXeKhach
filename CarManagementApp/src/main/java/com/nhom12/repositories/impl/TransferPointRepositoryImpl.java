/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

import com.nhom12.pojo.TransferPoint;
import com.nhom12.repositories.TransferPointRepository;
import jakarta.persistence.Query;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class TransferPointRepositoryImpl implements TransferPointRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<TransferPoint> getAllTransferPoints() {
        Session session = sessionFactory.getCurrentSession();
        Query q = session.createQuery("FROM TransferPoint");
        return q.getResultList();
    }

    @Override
    public TransferPoint getTransferPointById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(TransferPoint.class, id);
    }

    @Override
    public void addOrUpdate(TransferPoint transferPoint) {
        Session session = sessionFactory.getCurrentSession();
        if (transferPoint.getId() == null) {
            session.persist(transferPoint);  // thay save()
        } else {
            session.merge(transferPoint);    // thay update()
        }
    }

    @Override
    public void deleteTransferPoint(int id) {
        Session session = sessionFactory.getCurrentSession();
        TransferPoint tp = session.get(TransferPoint.class, id);
        if (tp != null) {
            session.remove(tp);  // thay delete()
        }
    }
}

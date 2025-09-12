/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;


import com.nhom12.pojo.TripTransfer;
import com.nhom12.repositories.TripTransferRepository;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class TripTransferRepositoryImpl implements TripTransferRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<TripTransfer> getTripTransfers() {
        Session session = this.sessionFactory.getCurrentSession();
        Query<TripTransfer> query = session.createQuery("FROM TripTransfer", TripTransfer.class);
        return query.getResultList();
    }

    @Override
    public TripTransfer getTripTransferById(int id) {
        Session session = this.sessionFactory.getCurrentSession();
        return session.get(TripTransfer.class, id);
    }

    @Override
    public void addTripTransfer(TripTransfer tripTransfer) {
        Session session = this.sessionFactory.getCurrentSession();
        session.persist(tripTransfer);
    }

    @Override
    public void updateTripTransfer(TripTransfer tripTransfer) {
        Session session = this.sessionFactory.getCurrentSession();
        session.merge(tripTransfer);
    }

    @Override
    public void deleteTripTransfer(int id) {
        Session session = this.sessionFactory.getCurrentSession();
        TripTransfer tripTransfer = session.get(TripTransfer.class, id);
        if (tripTransfer != null) {
            session.remove(tripTransfer);
        }
    }
}
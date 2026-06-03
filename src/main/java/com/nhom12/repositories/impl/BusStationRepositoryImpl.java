/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

import com.nhom12.pojo.BusStation;
import com.nhom12.repositories.BusStationRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
@Transactional
public class BusStationRepositoryImpl implements BusStationRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<BusStation> getAllBusStations() {
        Session session = sessionFactory.getCurrentSession();
        Query<BusStation> q = session.createQuery("FROM BusStation", BusStation.class);
        return q.getResultList();
    }

    @Override
    public BusStation getBusStationById(int id) {
        Session session = sessionFactory.getCurrentSession();
        return session.get(BusStation.class, id);
    }

    @Override
    public void addOrUpdate(BusStation busStation) {
        Session session = sessionFactory.getCurrentSession();
        if (busStation.getId() == null) {
            session.persist(busStation); // thay cho save()
        } else {
            session.merge(busStation); // thay cho update()
        }
    }

    @Override
    public void deleteBusStation(int id) {
        Session session = sessionFactory.getCurrentSession();
        BusStation bs = session.get(BusStation.class, id);
        if (bs != null) {
            session.remove(bs);
        }
    }

}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

import com.nhom12.pojo.Bus;
import com.nhom12.pojo.BusLocation;
import com.nhom12.repositories.BusLocationRepository;
import java.math.BigDecimal;
import java.util.Date;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class BusLocationRepositoryImpl implements BusLocationRepository {

    @Autowired
    private LocalSessionFactoryBean sessionFactory;

    @Override
    public void addBusLocation(int busId, BigDecimal latitude, BigDecimal longitude, Date timestamp) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        BusLocation busLocation = new BusLocation();
        
        // Tạo đối tượng Bus để liên kết
        Bus bus = session.get(Bus.class, busId);
        
        busLocation.setBusId(bus);
        busLocation.setLatitude(latitude);
        busLocation.setLongitude(longitude);
        busLocation.setTimestamp(timestamp);
        
        session.save(busLocation);
    }

    @Override
    public BusLocation getLatestBusLocation(int busId) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        Query q = session.createQuery("FROM BusLocation bl WHERE bl.busId.id = :busId ORDER BY bl.timestamp DESC");
        q.setParameter("busId", busId);
        q.setMaxResults(1);
        
        return (BusLocation) q.getSingleResult();
    }
}

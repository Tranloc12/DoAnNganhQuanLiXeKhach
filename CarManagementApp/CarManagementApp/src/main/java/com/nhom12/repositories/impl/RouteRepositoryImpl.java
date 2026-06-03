/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

import com.nhom12.pojo.Route;
import com.nhom12.repositories.RouteRepository;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.query.Query;
import java.util.Map;
import java.util.HashMap;



import java.util.List;

@Repository
@Transactional
public class RouteRepositoryImpl implements RouteRepository {

    @Autowired
    private LocalSessionFactoryBean sessionFactory;

    @Override
    public LocalSessionFactoryBean getSessionFactory() {
        return sessionFactory;
    }

    @Override
    public List<Route> getRoutes(String kw) {
        Session session = sessionFactory.getObject().getCurrentSession();
        StringBuilder hql = new StringBuilder("FROM Route r WHERE 1=1");

        if (kw != null && !kw.isEmpty()) {
            hql.append(" AND (r.routeName LIKE :kw OR r.origin LIKE :kw OR r.destination LIKE :kw)");
        }

        Query<Route> query = session.createQuery(hql.toString(), Route.class);

        if (kw != null && !kw.isEmpty()) {
            query.setParameter("kw", "%" + kw + "%");
        }

        return query.getResultList();
    }

    @Override
    public Route getRouteById(int id) {
        Session session = sessionFactory.getObject().getCurrentSession();
        return session.get(Route.class, id);
    }

    @Override
    public boolean addOrUpdateRoute(Route route) {
        Session session = sessionFactory.getObject().getCurrentSession();
        try {
            if (route.getId() == null || route.getId() == 0) {
                session.save(route); // Thêm mới
            } else {
                session.update(route); // Cập nhật
            }
            return true;
        } catch (Exception ex) {
            System.err.println("Lỗi khi thêm/cập nhật tuyến đường: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteRoute(int id) {
        Session session = sessionFactory.getObject().getCurrentSession();
        try {
            Route route = session.get(Route.class, id);
            if (route != null) {
                session.delete(route);
                return true;
            }
            return false; // Không tìm thấy tuyến đường để xóa
        } catch (Exception ex) {
            System.err.println("Lỗi khi xóa tuyến đường: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean isRouteNameExist(String routeName, Integer excludeRouteId) {
        Session session = sessionFactory.getObject().getCurrentSession();
        StringBuilder hql = new StringBuilder("SELECT COUNT(r) FROM Route r WHERE r.routeName = :routeName");

        if (excludeRouteId != null && excludeRouteId > 0) {
            hql.append(" AND r.id != :excludeRouteId");
        }

        Query<Long> query = session.createQuery(hql.toString(), Long.class);
        query.setParameter("routeName", routeName);

        if (excludeRouteId != null && excludeRouteId > 0) {
            query.setParameter("excludeRouteId", excludeRouteId);
        }

        return query.getSingleResult() > 0;
    }

    @Override
    public long countRoutes() {
        Session session = sessionFactory.getObject().getCurrentSession();
        Query<Long> query = session.createQuery("SELECT COUNT(r) FROM Route r", Long.class);
        return query.getSingleResult();
    }
    
    @Override
    public List<Route> findRoutes(String routeName, String origin, String destination, Double distanceFrom, Double distanceTo, Double priceFrom, Double priceTo, Boolean isActive) {
        Session session = sessionFactory.getObject().getCurrentSession();
        StringBuilder hql = new StringBuilder("FROM Route r WHERE 1=1");
        Map<String, Object> queryParams = new HashMap<>();

        if (routeName != null && !routeName.isEmpty()) {
            hql.append(" AND r.routeName LIKE :routeName");
            queryParams.put("routeName", "%" + routeName + "%");
        }

        if (origin != null && !origin.isEmpty()) {
            hql.append(" AND r.origin LIKE :origin");
            queryParams.put("origin", "%" + origin + "%");
        }

        if (destination != null && !destination.isEmpty()) {
            hql.append(" AND r.destination LIKE :destination");
            queryParams.put("destination", "%" + destination + "%");
        }
        
        if (distanceFrom != null) {
            hql.append(" AND r.distanceKm >= :distanceFrom");
            queryParams.put("distanceFrom", distanceFrom);
        }

        if (distanceTo != null) {
            hql.append(" AND r.distanceKm <= :distanceTo");
            queryParams.put("distanceTo", distanceTo);
        }

        if (priceFrom != null) {
            hql.append(" AND r.pricePerKm >= :priceFrom");
            queryParams.put("priceFrom", priceFrom);
        }

        if (priceTo != null) {
            hql.append(" AND r.pricePerKm <= :priceTo");
            queryParams.put("priceTo", priceTo);
        }

        if (isActive != null) {
            hql.append(" AND r.isActive = :isActive");
            queryParams.put("isActive", isActive);
        }

        Query<Route> query = session.createQuery(hql.toString(), Route.class);
        
        // Gán các tham số
        for (Map.Entry<String, Object> entry : queryParams.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        return query.getResultList();
    }

}

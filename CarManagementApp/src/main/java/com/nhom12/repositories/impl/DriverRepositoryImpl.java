
/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

import com.nhom12.pojo.Driver;
import com.nhom12.pojo.User; // Import User class
import com.nhom12.repositories.DriverRepository;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.query.Query;

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
            if (driver.getId() == null || driver.getId() == 0) { // Thêm mới
                // Kiểm tra xem userId đã được một driver khác sử dụng chưa
                if (driver.getUserId() != null && driver.getUserId().getId() != null) {
                    Query<Long> query = session.createQuery(
                        "SELECT COUNT(d) FROM Driver d WHERE d.userId.id = :userId", Long.class);
                    query.setParameter("userId", driver.getUserId().getId());
                    if (query.getSingleResult() > 0) {
                        // Nếu userId đã được gán cho một driver khác, không cho phép thêm mới
                        System.err.println("ERROR: User with ID " + driver.getUserId().getId() + " is already associated with another driver.");
                        return false; // Trả về false để chỉ ra rằng hoạt động thất bại do trùng lặp
                    }
                }
                session.save(driver);
            } else { // Cập nhật
                // Khi cập nhật, cũng cần kiểm tra nếu userId bị thay đổi
                // và userId mới đó đã được sử dụng bởi driver khác (không phải driver hiện tại)
                if (driver.getUserId() != null && driver.getUserId().getId() != null) {
                    Query<Long> query = session.createQuery(
                        "SELECT COUNT(d) FROM Driver d WHERE d.userId.id = :userId AND d.id != :driverId", Long.class);
                    query.setParameter("userId", driver.getUserId().getId());
                    query.setParameter("driverId", driver.getId());
                    if (query.getSingleResult() > 0) {
                        System.err.println("ERROR: User with ID " + driver.getUserId().getId() + " is already associated with another driver (not the current one).");
                        return false; // Trả về false
                    }
                }
                session.merge(driver);
            }
            return true;
        } catch (Exception ex) {
            System.err.println("Lỗi khi thêm/cập nhật tài xế: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteDriver(int id) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        try {
            Driver driver = session.get(Driver.class, id);
            if (driver != null) {
                session.delete(driver);
                return true;
            }
            return false;
        } catch (Exception ex) {
            System.err.println("Lỗi khi xóa tài xế: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public long countDrivers() {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        Query<Long> query = session.createQuery("SELECT COUNT(d) FROM Driver d", Long.class);
        return query.getSingleResult();
    }
}
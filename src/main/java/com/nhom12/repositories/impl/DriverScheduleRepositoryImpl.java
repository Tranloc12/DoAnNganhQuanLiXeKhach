/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

import com.nhom12.pojo.DriverSchedule;
import com.nhom12.repositories.DriverScheduleRepository;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class DriverScheduleRepositoryImpl implements DriverScheduleRepository {

    @Autowired
    private SessionFactory sessionFactory;

    @Override
    public List<DriverSchedule> findAllDriverSchedules() {
        Session session = this.sessionFactory.getCurrentSession();
        return session.createQuery("FROM DriverSchedule", DriverSchedule.class).getResultList();
    }

    @Override
    public DriverSchedule findDriverScheduleById(int id) {
        Session session = this.sessionFactory.getCurrentSession();
        return session.get(DriverSchedule.class, id);
    }

    @Override
    public void addOrUpdateDriverSchedule(DriverSchedule schedule) {
        Session session = this.sessionFactory.getCurrentSession();
        session.merge(schedule); // Thay thế saveOrUpdate bằng merge
    }

    @Override
    public void deleteDriverSchedule(int id) {
        Session session = this.sessionFactory.getCurrentSession();

        // Sử dụng session.get() thay vì session.load()
        // get() sẽ trả về null nếu đối tượng không tồn tại.
        DriverSchedule schedule = session.get(DriverSchedule.class, id);

        if (schedule != null) {
            // Chỉ xóa khi đối tượng thực sự tồn tại
            session.delete(schedule);
        }
    }
}

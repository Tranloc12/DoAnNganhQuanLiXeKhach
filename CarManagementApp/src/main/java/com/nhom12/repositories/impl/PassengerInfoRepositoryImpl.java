package com.nhom12.repositories.impl;

import com.nhom12.pojo.PassengerInfo;
import com.nhom12.pojo.User;
import com.nhom12.repositories.PassengerInfoRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Repository
@Transactional
public class PassengerInfoRepositoryImpl implements PassengerInfoRepository {

    private static final Logger logger = LoggerFactory.getLogger(PassengerInfoRepositoryImpl.class);

    @Autowired
    private LocalSessionFactoryBean sessionFactory;

    protected Session getSession() {
        return this.sessionFactory.getObject().getCurrentSession();
    }

    @Override
    public List<PassengerInfo> getPassengerInfos(String kw) {
        Session session = getSession();
        // Giữ nguyên p.userId
        StringBuilder hql = new StringBuilder("FROM PassengerInfo p JOIN FETCH p.userId u WHERE 1=1"); 

        if (kw != null && !kw.isEmpty()) {
            hql.append(" AND (p.fullName LIKE :kw OR u.username LIKE :kw OR p.phoneNumber LIKE :kw)");
        }

        Query<PassengerInfo> query = session.createQuery(hql.toString(), PassengerInfo.class);

        if (kw != null && !kw.isEmpty()) {
            query.setParameter("kw", "%" + kw.trim() + "%");
        }
        return query.getResultList();
    }

    @Override
    public PassengerInfo getPassengerInfoById(int id) {
        Session session = getSession();
        // Giữ nguyên p.userId
        Query<PassengerInfo> query = session.createQuery("FROM PassengerInfo p JOIN FETCH p.userId WHERE p.id = :id", PassengerInfo.class)
                                            .setParameter("id", id);
        return query.uniqueResult();
    }

    @Override
    public PassengerInfo getPassengerInfoByUserId(int userId) {
        Session session = getSession();
        // Giữ nguyên p.userId.id
        Query<PassengerInfo> query = session.createQuery("FROM PassengerInfo p WHERE p.userId.id = :userId", PassengerInfo.class)
                                            .setParameter("userId", userId);
        return query.uniqueResult();
    }

    @Override
    public boolean addOrUpdatePassengerInfo(PassengerInfo passengerInfo) {
        Session session = getSession();
        try {
            if (passengerInfo.getId() == null || passengerInfo.getId() == 0) {
                session.persist(passengerInfo); 
            } else {
                session.merge(passengerInfo);
            }
            return true;
        } catch (Exception ex) {
            logger.error("Lỗi khi thêm/cập nhật thông tin hành khách: {}", ex.getMessage(), ex);
            return false;
        }
    }

    @Override
    public boolean deletePassengerInfo(int id) {
        Session session = getSession();
        try {
            PassengerInfo passengerInfo = session.get(PassengerInfo.class, id);
            if (passengerInfo != null) {
                session.delete(passengerInfo);
                return true;
            }
            return false;
        } catch (Exception ex) {
            logger.error("Lỗi khi xóa thông tin hành khách với ID {}: {}", id, ex.getMessage(), ex);
            return false;
        }
    }

    @Override
    public long countPassengerInfos() {
        Session session = getSession();
        Query<Long> query = session.createQuery("SELECT COUNT(p) FROM PassengerInfo p", Long.class);
        return query.getSingleResult();
    }

    // Phương thức này không thuộc về PassengerInfoRepository và sẽ được chuyển
    @Override
    public List<User> getUsersWithoutPassengerInfo() {
        logger.warn("getUsersWithoutPassengerInfo() được gọi từ PassengerInfoRepositoryImpl. Nên được chuyển sang UserRepositoryImpl.");
        return List.of(); // Trả về danh sách rỗng để tránh lỗi biên dịch nếu interface vẫn yêu cầu.
    }
}
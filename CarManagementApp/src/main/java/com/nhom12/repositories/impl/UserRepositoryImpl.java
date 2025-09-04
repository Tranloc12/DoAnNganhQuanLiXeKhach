/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

// Đảm bảo bạn đang import đúng Query của Hibernate, KHÔNG PHẢI của Jakarta Persistence
import org.hibernate.query.Query; // <-- CHỖ NÀY QUAN TRỌNG

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.nhom12.pojo.User;
import com.nhom12.repositories.UserRepository;
import java.util.HashMap;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Repository
@Transactional
public class UserRepositoryImpl implements UserRepository {

    @Autowired
    private LocalSessionFactoryBean factory;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    protected Session getSession() {
        return this.factory.getObject().getCurrentSession();
    }

    @Override
    public User getUserByUsername(String username) {
        Session s = this.getSession(); // Sử dụng getSession() thay vì tạo biến s mới

        // Sử dụng org.hibernate.query.Query<User>
        Query<User> q = s.createQuery(
                "SELECT u FROM User u LEFT JOIN FETCH u.passengerInfo WHERE u.username = :username",
                User.class);
        q.setParameter("username", username);

        List<User> users = q.getResultList();
        return users.isEmpty() ? null : users.get(0);
    }

    @Override
    public User addUser(User u) {
        Session s = this.getSession();
        s.persist(u);
        s.flush();
        return u;
    }

    @Override
    public User updateUser(User user) {
        Session s = this.getSession();
        User managedUser = (User) s.merge(user); // merge trả về entity được quản lý
        s.flush(); // đảm bảo đẩy ngay xuống DB
        return managedUser;
    }

    @Override
    public void saveUser(User user) {
        Session s = this.getSession();
        if (user.getId() != null && user.getId() != 0) {
            s.merge(user);
        } else {
            s.persist(user);
        }
    }

    @Override
    public boolean authenticate(String username, String password) {
        User u = this.getUserByUsername(username);
        if (u == null) {
            return false;
        }
        return this.passwordEncoder.matches(password, u.getPassword());
    }

    @Override
    public User getUserById(Integer id) {
        Session s = this.getSession();
        return s.get(User.class, id);
    }

    @Override
    public List<User> getUsersByRole(String role) {
        Session s = this.getSession();
        // Sử dụng org.hibernate.query.Query<User> và truyền kiểu cụ thể
        Query<User> q = s.createNamedQuery("User.findByUserRole", User.class);
        q.setParameter("userRole", role);
        return q.getResultList();
    }

    @Override
    public List<User> getUsers() {
        Session s = this.getSession();
        // Sử dụng org.hibernate.query.Query<User> và truyền kiểu cụ thể
        Query<User> q = s.createNamedQuery("User.findAll", User.class);
        return q.getResultList();
    }

    @Override
    public List<User> getUsersWithoutPassengerInfo() {
        Session session = getSession();

        List<User> allUsers = getUsers();

        // Sử dụng org.hibernate.query.Query<Integer> và truyền kiểu cụ thể
        Query<Integer> queryWithPassengerInfoIds = session.createQuery(
                "SELECT p.userId.id FROM PassengerInfo p WHERE p.userId.id IS NOT NULL", Integer.class);
        Set<Integer> usersWithPassengerInfoIds = queryWithPassengerInfoIds.getResultStream().collect(Collectors.toSet());

        return allUsers.stream()
                .filter(user -> user.getId() != null && !usersWithPassengerInfoIds.contains(user.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Object[]> getUserRoleStats() {
        Session session = this.getSession();
        // Thống kê số lượng người dùng theo user_role
        Query<Object[]> q = session.createQuery(
                "SELECT u.userRole, COUNT(u.id) "
                + "FROM User u "
                + "GROUP BY u.userRole "
                + "ORDER BY u.userRole ASC", Object[].class);
        return q.getResultList();
    }

    @Override
    public List<User> findUsers(String username, String email, String userRole, Boolean isActive) {
        Session session = this.getSession();

        StringBuilder hql = new StringBuilder("SELECT u FROM User u WHERE 1=1");
        Map<String, Object> params = new HashMap<>();

        if (username != null && !username.isEmpty()) {
            hql.append(" AND u.username LIKE :username");
            params.put("username", "%" + username + "%");
        }

        if (email != null && !email.isEmpty()) {
            hql.append(" AND u.email LIKE :email");
            params.put("email", "%" + email + "%");
        }

        if (userRole != null && !userRole.isEmpty()) {
            hql.append(" AND u.userRole = :userRole");
            params.put("userRole", userRole);
        }

        if (isActive != null) {
            hql.append(" AND u.isActive = :isActive");
            params.put("isActive", isActive);
        }

        Query<User> query = session.createQuery(hql.toString(), User.class);

        // Set các tham số vào truy vấn
        for (Map.Entry<String, Object> entry : params.entrySet()) {
            query.setParameter(entry.getKey(), entry.getValue());
        }

        return query.getResultList();
    }
}

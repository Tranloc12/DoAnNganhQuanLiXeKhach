/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;

import com.cloudinary.Cloudinary;
import com.nhom12.pojo.User;
import com.nhom12.repositories.UserRepository;
import com.nhom12.services.UserService;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author HP
 */
@Service("userDetailsService")
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private Cloudinary cloudinary;

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public User getUserByUsername(String username) {
        return this.userRepo.getUserByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User u = this.getUserByUsername(username);
        if (u == null) {
            throw new UsernameNotFoundException("Invalid username!");
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(u.getUserRole()));

        return new org.springframework.security.core.userdetails.User(
                u.getUsername(), u.getPassword(), authorities);
    }

    @Override
    public User addUser(Map<String, String> params) {
        User u = new User();
        u.setUsername(params.get("username"));
        if (userRepo.getUserByUsername(u.getUsername()) != null) {
            throw new RuntimeException("Username đã tồn tại");
        }
        u.setEmail(params.get("email"));
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date dob = dateFormat.parse(params.get("dob"));
            u.setDob(dob);
        } catch (ParseException e) {
            throw new RuntimeException("Invalid date format for dob", e);
        }
        u.setPassword(this.passwordEncoder.encode(params.get("password")));

        String userRole = params.getOrDefault("user_role", "ROLE_MEMBER");
        u.setUserRole(userRole);

        u.setIsActive(true);

        // if (!avatar.isEmpty()) {
        // try {
        // Map res = cloudinary.uploader().upload(avatar.getBytes(),
        // ObjectUtils.asMap("resource_type", "auto"));
        // u.setAvatar(res.get("secure_url").toString());
        // } catch (IOException ex) {
        // Logger.getLogger(ProductServiceImpl.class.getName()).log(Level.SEVERE, null,
        // ex);
        // }
        // }
        return this.userRepo.addUser(u);
    }

    @Override
    @Transactional
    public User updateUser(User user) {
        // Gọi phương thức từ Repository đã dùng merge
        return this.userRepo.updateUser(user);
    }

    @Override
    @Transactional
    public void changePassword(User user, String newPassword) {
        user.setPassword(this.passwordEncoder.encode(newPassword));
        this.updateUser(user);
    }

    @Override
    public boolean authenticate(String username, String password) {
        return this.userRepo.authenticate(username, password);
    }

    @Override
    public void saveUser(User user) {
        this.userRepo.saveUser(user);
    }

    @Override
    public User getUserById(Integer id) {
        return this.userRepo.getUserById(id);
    }

    @Override
    public List<User> getUsersByRole(String role) {
        return this.userRepo.getUsersByRole(role);
    }

    @Override
    public List<User> getUsers() {
        return this.userRepo.getUsers();
    }

    @Override
    public List<Object[]> getUserRoleStats() {
        return this.userRepo.getUserRoleStats();
    }
}

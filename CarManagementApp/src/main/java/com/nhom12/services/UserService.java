/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.nhom12.services;

import com.nhom12.pojo.User;
import java.util.List;
import java.util.Map;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author HP
 */
public interface UserService extends UserDetailsService {
    User getUserByUsername(String username);

    User getUserById(Integer id);

    User addUser(Map<String, String> params);

    public void saveUser(User user);

    User updateUser(User user);

    void changePassword(User user, String newPassword);

    boolean authenticate(String username, String password);

    List<User> getUsersByRole(String role);

    List<User> getUsers();
    
     List<Object[]> getUserRoleStats();

}

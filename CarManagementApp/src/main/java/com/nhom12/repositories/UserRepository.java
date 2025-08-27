/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.User;
import java.util.List;

/**
 *
 * @author HP
 */
public interface UserRepository {
    User getUserByUsername(String username);

    User getUserById(Integer id);

    User addUser(User u);

    User updateUser(User user);

    void saveUser(User user);

    boolean authenticate(String username, String password);

    List<User> getUsersByRole(String role);

    List<User> getUsers();

    List<Object[]> getUserRoleStats();
    
    // Di chuyển từ PassengerInfoRepository
    List<User> getUsersWithoutPassengerInfo();
    
    
}

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.Route;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean; // Cần import để dùng trong impl
import java.util.List;

public interface RouteRepository {
    List<Route> getRoutes(String kw); // Lấy danh sách tuyến đường, có thể tìm kiếm theo từ khóa
    Route getRouteById(int id);
    boolean addOrUpdateRoute(Route route); // Thêm hoặc cập nhật tuyến đường
    boolean deleteRoute(int id);
    boolean isRouteNameExist(String routeName, Integer excludeRouteId); // Kiểm tra tên tuyến đường có trùng không
    long countRoutes(); // Để đếm tổng số tuyến đường
    
    // Thêm phương thức để truy cập sessionFactory nếu bạn cần trong lớp ServiceImpl
    LocalSessionFactoryBean getSessionFactory(); // Ví dụ: để dùng trong ServiceImpl cho countRoutes
}

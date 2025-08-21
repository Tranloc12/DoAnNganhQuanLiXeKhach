/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories;
import com.nhom12.pojo.User; // Import User class
import com.nhom12.pojo.PassengerInfo;
import java.util.List;

public interface PassengerInfoRepository {
     List<PassengerInfo> getPassengerInfos(String kw);
    PassengerInfo getPassengerInfoById(int id);
    boolean addOrUpdatePassengerInfo(PassengerInfo passengerInfo);
    boolean deletePassengerInfo(int id);
    long countPassengerInfos();
    PassengerInfo getPassengerInfoByUserId(int userId); // Tốt, giữ lại để kiểm tra ràng buộc

    // Thêm method để lấy các User chưa có PassengerInfo
    // Nên để ở UserRepo hoặc một repo chung nếu dùng cho nhiều nơi
    // Nhưng nếu chỉ dùng ở đây thì có thể tạm thời đưa vào đây để đơn giản
    List<User> getUsersWithoutPassengerInfo(); // <-- Vị trí của method này có thể xem xét lại
    
    PassengerInfo getPassengerInfoByUser(User user);
}
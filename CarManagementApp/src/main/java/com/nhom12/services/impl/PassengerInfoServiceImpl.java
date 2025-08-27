/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;

import com.nhom12.pojo.PassengerInfo;
import com.nhom12.pojo.User;
import com.nhom12.repositories.PassengerInfoRepository;
import com.nhom12.repositories.UserRepository; // Import UserRepository
import com.nhom12.services.PassengerInfoService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class PassengerInfoServiceImpl implements PassengerInfoService {

    private static final Logger logger = LoggerFactory.getLogger(PassengerInfoServiceImpl.class);

    @Autowired
    private PassengerInfoRepository passengerInfoRepo;

    @Autowired
    private UserRepository userRepo; // Inject UserRepository

    @Override
    public List<PassengerInfo> getPassengerInfos(String kw) {
        return this.passengerInfoRepo.getPassengerInfos(kw);
    }

    @Override
    public PassengerInfo getPassengerInfoById(int id) {
        return this.passengerInfoRepo.getPassengerInfoById(id);
    }

    @Override
    @Transactional // Đảm bảo transaction cho logic này
    public boolean addOrUpdatePassengerInfo(PassengerInfo passengerInfo) {
        // Logic kiểm tra User ID duy nhất
        if (passengerInfo.getUserId() != null && passengerInfo.getUserId().getId() != null) {
            PassengerInfo existingPiForUser = passengerInfoRepo.getPassengerInfoByUserId(passengerInfo.getUserId().getId());

            if (passengerInfo.getId() == null || passengerInfo.getId() == 0) { // Thêm mới
                if (existingPiForUser != null) {
                    logger.warn("Validation Error: User with ID {} already has passenger information.", passengerInfo.getUserId().getId());
                    return false; // User đã có PassengerInfo
                }
            } else { // Cập nhật
                if (existingPiForUser != null && !existingPiForUser.getId().equals(passengerInfo.getId())) {
                    logger.warn("Validation Error: The new selected user (ID {}) already has passenger information assigned to another passenger (ID {}).",
                                passengerInfo.getUserId().getId(), existingPiForUser.getId());
                    return false; // User đã có PassengerInfo bởi một người khác
                }
            }

            // Gán lại đối tượng User đầy đủ nếu chỉ nhận được ID từ form
            User userFromRepo = userRepo.getUserById(passengerInfo.getUserId().getId());
            if (userFromRepo != null) {
                passengerInfo.setUserId(userFromRepo);
            } else {
                logger.error("Error: User not found for ID: {}", passengerInfo.getUserId().getId());
                return false;
            }
        }

        return this.passengerInfoRepo.addOrUpdatePassengerInfo(passengerInfo);
    }

    @Override
    public boolean deletePassengerInfo(int id) {
        return this.passengerInfoRepo.deletePassengerInfo(id);
    }

    @Override
    public long countPassengerInfos() {
        return this.passengerInfoRepo.countPassengerInfos();
    }
    
     // ⭐ PHƯƠNG THỨC MỚI ĐÃ THÊM VÀO ⭐
    @Override
    public PassengerInfo findByUser(User user) {
        // Gọi phương thức tương ứng từ repository để tìm PassengerInfo dựa trên User
        return this.passengerInfoRepo.getPassengerInfoByUser(user);
    }
}
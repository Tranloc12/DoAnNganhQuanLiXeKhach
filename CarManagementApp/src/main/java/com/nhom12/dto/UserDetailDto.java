package com.nhom12.dto;

import com.nhom12.pojo.User;
import com.nhom12.pojo.PassengerInfo;
import java.text.SimpleDateFormat;

// Đây là lớp DTO dùng để trả về thông tin người dùng cho frontend
// Đảm bảo rằng nó có các trường cần thiết mà frontend mong đợi
public class UserDetailDto {
    private int id;
    private String username;
    private String email;
    private String userRole;
    private String dob; // Định dạng YYYY-MM-DD
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private String avatar; // <-- THÊM TRƯỜNG AVATAR VÀO ĐÂY

    // Constructor để ánh xạ dữ liệu từ User và PassengerInfo
    public UserDetailDto(User user, PassengerInfo passengerInfo) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.userRole = user.getUserRole();
        
        // Định dạng ngày sinh
        if (user.getDob() != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            this.dob = sdf.format(user.getDob());
        }
        
        // Gán giá trị cho trường avatar
        this.avatar = user.getAvatar(); // <-- LẤY URL AVATAR TỪ ĐỐI TƯỢNG USER

        // Ánh xạ thông tin từ PassengerInfo (nếu có)
        if (passengerInfo != null) {
            // Tách FullName thành firstName và lastName
            String fullName = passengerInfo.getFullName();
            if (fullName != null && !fullName.isEmpty()) {
                String[] fullNameParts = fullName.split(" ", 2);
                this.firstName = fullNameParts.length > 0 ? fullNameParts[0] : "";
                this.lastName = fullNameParts.length > 1 ? fullNameParts[1] : "";
            }
            this.phone = passengerInfo.getPhoneNumber();
            this.address = passengerInfo.getAddress();
        } else {
            // Nếu không có PassengerInfo, có thể gán các giá trị mặc định hoặc rỗng
            this.firstName = "";
            this.lastName = "";
            this.phone = "";
            this.address = "";
        }
    }

    // --- Getters ---
    // Các setters không cần thiết nếu đây chỉ là DTO dùng để gửi dữ liệu đi
    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getUserRole() {
        return userRole;
    }

    public String getDob() {
        return dob;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public String getAvatar() {
        return avatar;
    }
}

package com.nhom12.repositories;

import com.nhom12.pojo.Payment;
import java.util.List;

/**
 * Interface Repository cho đối tượng Payment.
 * Định nghĩa các phương thức thao tác với database cho Payment.
 */
public interface PaymentRepository {
    /**
     * Lấy tất cả các đối tượng Payment từ database.
     * @return Danh sách các Payment.
     */
    List<Payment> findAll();
    
    /**
     * Lấy danh sách Payment theo ID người dùng
     * @param userId ID của người dùng
     * @return Danh sách các Payment của người dùng đó.
     */
    List<Payment> getPaymentsByUserId(int userId);

    /**
     * Tìm một Payment theo ID.
     * @param id ID của Payment.
     * @return Đối tượng Payment nếu tìm thấy, ngược lại trả về null.
     */
    Payment findById(int id);

    /**
     * Lưu hoặc cập nhật một đối tượng Payment vào database.
     * Phương thức này sẽ xử lý cả việc lưu mới và cập nhật.
     * @param payment Đối tượng Payment cần lưu hoặc cập nhật.
     */
    void saveOrUpdate(Payment payment);

    /**
     * Xóa một đối tượng Payment khỏi database.
     * @param payment Đối tượng Payment cần xóa.
     */
    void delete(Payment payment);

    // Phương thức 'save' riêng biệt (chỉ dùng cho entity mới) được loại bỏ để tránh trùng lặp với saveOrUpdate
    // Nếu bạn thực sự cần sự khác biệt giữa save (new only) và update, bạn có thể giữ riêng.
    // Tuy nhiên, saveOrUpdate (dùng merge) thường đủ cho đa số trường hợp.
}

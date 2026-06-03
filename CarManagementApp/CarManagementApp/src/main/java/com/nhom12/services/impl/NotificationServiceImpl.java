///*
// * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
// * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
// */
//package com.nhom12.services.impl;
//
//import com.nhom12.pojo.GymPackage;
//import com.nhom12.pojo.Subscription;
//import com.nhom12.pojo.User;
//import com.nhom12.pojo.Workout;
//import com.nhom12.services.NotificationService;
//import com.nhom12.services.SubscriptionService;
//import com.nhom12.services.UserService;
//import com.nhom12.services.WorkoutService;
//import java.text.SimpleDateFormat;
//import java.util.Calendar;
//import java.util.Date;
//import java.util.List;
//import java.util.concurrent.CompletableFuture;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Async;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//
///**
// *
// * @author HP
// */
//@Service
//public class NotificationServiceImpl implements NotificationService {
//
//    @Autowired
//    private WorkoutService workoutService;
//
//    @Autowired
//    private SubscriptionService subService;
//
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private EmailServiceImpl emailService;
//
//    @Override
//    @Scheduled(cron = "0 * * * * *", zone = "Asia/Ho_Chi_Minh") // lên lịch chạy mỗi phút
//    public void checkAndSendAdvanceReminders() {
//        // Chỉ xử lý thông báo lịch tập (15 phút và 30 phút trước) - giữ logic ban đầu
//        System.out.println(
//                "com.nhom12.services.impl.NotificationServiceImpl.checkAndSendAdvanceReminders() ======================== TỰ ĐỘNG ĐÂY NÈ");
//        Date now = new Date(); // Thời điểm hiện tại
//
//        Calendar cal = Calendar.getInstance();
//        cal.setTime(now);
//
//        // Tính t30
//        cal.add(Calendar.MINUTE, 30);
//        Date t30 = cal.getTime();
//
//        // Tính t30Next = t30 + 1 phút
//        cal.add(Calendar.MINUTE, 1);
//        Date t30Next = cal.getTime();
//
//        // Reset về now rồi tính t15
//        cal.setTime(now);
//        cal.add(Calendar.MINUTE, 15);
//        Date t15 = cal.getTime();
//
//        cal.add(Calendar.MINUTE, 1);
//        Date t15Next = cal.getTime();
//
//        System.out.println("T30: " + t30);
//        System.out.println("T30Next: " + t30Next);
//
//        System.out.println("T15: " + t15);
//        System.out.println("T15Next: " + t15Next);
//
//        // 2. Lấy các reminder cần thông báo (giữ logic ban đầu)
//        List<Workout> due30 = this.workoutService.findDue30(t30, t30Next);
//        for (Workout r : due30) {
//            System.out.println("có chừng này workout:   ============== 1" + r.getId());
//            sendAdvanceNotification(r, 30);
//            workoutService.markNotified30(r);
//        }
//
//        List<Workout> due15 = this.workoutService.findDue15(t15, t15Next);
//        for (Workout r : due15) {
//            System.out.println("có chừng này workout:   ============== 2" + r.getId());
//            sendAdvanceNotification(r, 15);
//            workoutService.markNotified15(r);
//        }
//    }
//
//    // Method riêng để gửi thông báo subscription sắp hết hạn - chạy mỗi ngày lúc
//    // 9:00 sáng
//    @Scheduled(cron = "0 21 20 * * *", zone = "Asia/Ho_Chi_Minh") // 9:00 AM mỗi ngày
//    public void checkAndSendSubscriptionExpiryNotifications() {
//        System.out.println(
//                "com.nhom12.services.impl.NotificationServiceImpl.checkAndSendSubscriptionExpiryNotifications() ======================== THÔNG BÁO SUBSCRIPTION");
//
//        // Reset tất cả notified7 về false để có thể gửi lại mỗi ngày
//        subService.resetAllNotified7();
//
//        Date now = new Date();
//        Calendar cal = Calendar.getInstance();
//        cal.setTime(now);
//        cal.add(Calendar.DAY_OF_YEAR, 7); // 7 ngày từ bây giờ
//        Date sevenDaysLater = cal.getTime();
//
//        // Tìm tất cả subscription có endDate <= 7 ngày từ hiện tại
//        List<Subscription> subscriptions = subService.findSubscriptionsExpiringSoon(sevenDaysLater);
//
//        for (Subscription sub : subscriptions) {
//            System.out.println("Subscription sắp hết hạn: " + sub.getId() + " - Còn " +
//                    ((sub.getEndDate().getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) + " ngày");
//            sendSubscriptionExpiryNotification(sub);
//            subService.markNotified7(sub);
//        }
//
//        System.out.println("Đã gửi thông báo cho " + subscriptions.size() + " subscription sắp hết hạn");
//    }
//
//    @Override
//    public void sendAdvanceNotification(Workout w, int minutesBefore) {
//        String when = minutesBefore + " phút";
//        String subject = "Còn " + when + " đến buổi tập " + w.getType();
//        String body = "Nhắc nhở buổi tập " + w.getType() + " hôm nay"
//                + "\n\nThời gian bắt đầu: "
//                + new SimpleDateFormat("HH:mm")
//                        .format(w.getStartTime());
//
//        // Lưu vào DB
//        // Notification n = new Notification();
//        // n.setUser(r.getUser());
//        // n.setTitle(subject);
//        // n.setMessage(body);
//        // n.setSentAt(new Date());
//        // notificationRepo.save(n);
//        // Gửi email
//        emailService.sendSimpleEmail(w.getSubscriptionId().getMemberId().getEmail(), subject, body);
//    }
//
//    private void sendSubscriptionExpiryNotification(Subscription sub) {
//        String subject = "Gói tập của bạn sắp hết hạn";
//
//        // Tính số ngày còn lại
//        Date now = new Date();
//        long diffInMillies = sub.getEndDate().getTime() - now.getTime();
//        long daysLeft = diffInMillies / (1000 * 60 * 60 * 24);
//
//        String body = "Chào " + sub.getMemberId().getUsername() + ",\n\n"
//                + "Gói tập của bạn sẽ hết hạn trong " + daysLeft + " ngày.\n"
//                + "Ngày hết hạn: " + new SimpleDateFormat("dd/MM/yyyy").format(sub.getEndDate()) + "\n\n"
//                + "Vui lòng gia hạn để tiếp tục sử dụng dịch vụ.\n\n"
//                + "Trân trọng,\nGym Management Team";
//
//        emailService.sendSimpleEmail(sub.getMemberId().getEmail(), subject, body);
//    }
//
//    @Override
//    @Async("emailTaskExecutor")
//    public CompletableFuture<Void> sendDiscountNotificationToAllMembers(GymPackage gymPackage, Double oldDiscount,
//            Double newDiscount) {
//        System.out.println("Gửi thông báo discount cho tất cả members - Package: " + gymPackage.getNamePack());
//
//        // Lấy tất cả user có role ROLE_MEMBER
//        List<User> members = userService.getUsersByRole("ROLE_MEMBER");
//
//        if (members.isEmpty()) {
//            System.out.println("Không có member nào để gửi thông báo");
//            return CompletableFuture.completedFuture(null);
//        }
//
//        // Tạo nội dung email
//        String subject = "🎉 Cập nhật giá ưu đãi gói tập " + gymPackage.getNamePack();
//
//        String discountInfo = "";
//        if (oldDiscount == null || oldDiscount == 0) {
//            if (newDiscount != null && newDiscount > 0) {
//                discountInfo = "✨ Tin tuyệt vời! Gói tập " + gymPackage.getNamePack() + " hiện có ưu đãi " + newDiscount
//                        + "% cho tất cả thành viên!";
//            }
//        } else {
//            if (newDiscount == null || newDiscount == 0) {
//                discountInfo = "Gói tập " + gymPackage.getNamePack() + " đã kết thúc chương trình ưu đãi.";
//            } else {
//                discountInfo = "🔥 Cập nhật ưu đãi! Gói tập " + gymPackage.getNamePack() + " thay đổi từ " + oldDiscount
//                        + "% thành " + newDiscount + "% ưu đãi!";
//            }
//        }
//
//        // Tính giá sau ưu đãi
//        double finalPrice = gymPackage.getPrice();
//        if (newDiscount != null && newDiscount > 0) {
//            finalPrice = gymPackage.getPrice() * (100 - newDiscount) / 100;
//        }
//
//        String body = "Chào bạn,\n\n"
//                + discountInfo + "\n\n"
//                + "📋 Thông tin gói tập:\n"
//                + "• Tên gói: " + gymPackage.getNamePack() + "\n"
//                + "• Giá gốc: " + String.format("%.0f", gymPackage.getPrice()) + " VND\n"
//                + "• Ưu đãi: " + (newDiscount != null && newDiscount > 0 ? newDiscount + "%" : "Không có") + "\n"
//                + "• Giá sau ưu đãi: " + String.format("%.0f", finalPrice) + " VND\n"
//                + "• Thời hạn: "
//                + (gymPackage.getDayswpt() != null ? gymPackage.getDayswpt() + " ngày" : "Không giới hạn") + "\n\n"
//                + "📝 Mô tả: " + (gymPackage.getDescription() != null ? gymPackage.getDescription() : "Không có mô tả")
//                + "\n\n"
//                + "🏃‍♂️ Đừng bỏ lỡ cơ hội tuyệt vời này! Liên hệ ngay với chúng tôi để đăng ký.\n\n"
//                + "Trân trọng,\n"
//                + "Gym Management Team";
//
//        // Gửi email cho tất cả members
//        int successCount = 0;
//        int failCount = 0;
//
//        for (User member : members) {
//            try {
//                emailService.sendSimpleEmail(member.getEmail(), subject, body);
//                successCount++;
//                System.out.println("Đã gửi email cho member: " + member.getUsername() + " (" + member.getEmail() + ")");
//            } catch (Exception e) {
//                failCount++;
//                System.err.println("Lỗi gửi email cho member: " + member.getUsername() + " - " + e.getMessage());
//            }
//        }
//
//        System.out.println("Hoàn thành gửi thông báo discount:");
//        System.out.println("- Thành công: " + successCount + " emails");
//        System.out.println("- Thất bại: " + failCount + " emails");
//        System.out.println("- Tổng members: " + members.size());
//
//        return CompletableFuture.completedFuture(null);
//    }
//
//}

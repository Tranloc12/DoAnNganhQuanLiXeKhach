/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

import com.nhom12.pojo.Trip;
import com.nhom12.repositories.TripRepository;
import java.time.LocalDateTime;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.query.Query;

import java.util.List;

@Repository
@Transactional
public class TripRepositoryImpl implements TripRepository {

    @Autowired
    private LocalSessionFactoryBean sessionFactory;

    @Override
    public LocalSessionFactoryBean getSessionFactory() {
        return sessionFactory;
    }

    @Override
    public List<Trip> getTrips(String kw) {
        Session session = sessionFactory.getObject().getCurrentSession();

        // SỬA ĐỔI TẠI ĐÂY (NẾU CẦN THIẾT):
        // Nếu bạn cần JOIN FETCH User của Driver, bạn cần chỉ rõ d.driverId.userId
        // Tuy nhiên, lỗi hiện tại chỉ ra vấn đề ở WHERE clause.
        // Dòng JOIN FETCH này có thể giữ nguyên nếu cấu trúc Trip của bạn là
        // Trip -> BusId (Bus), Trip -> DriverId (Driver), Trip -> RouteId (Route)
        // và bạn muốn eager load chúng.
        StringBuilder hql = new StringBuilder("FROM Trip t JOIN FETCH t.busId JOIN FETCH t.driverId JOIN FETCH t.routeId WHERE 1=1");

        if (kw != null && !kw.isEmpty()) {
            // SỬA LỖI QUAN TRỌNG TẠI ĐÂY: t.driverId.user.username THÀNH t.driverId.userId.username
            hql.append(" AND (t.busId.licensePlate LIKE :kw OR t.driverId.userId.username LIKE :kw OR t.routeId.routeName LIKE :kw)"); // <--- DÒNG ĐÃ SỬA
        }

        hql.append(" ORDER BY t.departureTime DESC"); // Sắp xếp theo thời gian khởi hành mới nhất

        Query<Trip> query = session.createQuery(hql.toString(), Trip.class);

        if (kw != null && !kw.isEmpty()) {
            query.setParameter("kw", "%" + kw + "%");
        }

        return query.getResultList();
    }

    @Override
    public Trip getTripById(int id) {
        Session session = sessionFactory.getObject().getCurrentSession();
        // Dòng này có thể không cần sửa nếu chỉ là JOIN FETCH t.driverId
        // và sau đó bên ngoài truy cập .getDriverId().getUserId().getUsername()
        // Nhưng để nhất quán và an toàn, nếu có thể, hãy đảm bảo rằng mọi truy vấn
        // đi qua Driver để lấy User đều dùng userId
        return session.createQuery("FROM Trip t JOIN FETCH t.busId JOIN FETCH t.driverId JOIN FETCH t.routeId WHERE t.id = :id", Trip.class)
                .setParameter("id", id)
                .getSingleResult();
    }

    @Override
    public boolean addOrUpdateTrip(Trip trip) {
        Session session = sessionFactory.getObject().getCurrentSession();
        try {
            if (trip.getId() == null || trip.getId() == 0) {
                session.save(trip); // Thêm mới
            } else {
                session.update(trip); // Cập nhật
            }
            return true;
        } catch (Exception ex) {
            System.err.println("Lỗi khi thêm/cập nhật chuyến đi: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public boolean deleteTrip(int id) {
        Session session = sessionFactory.getObject().getCurrentSession();
        try {
            Trip trip = session.get(Trip.class, id);
            if (trip != null) {
                session.delete(trip);
                return true;
            }
            return false;
        } catch (Exception ex) {
            System.err.println("Lỗi khi xóa chuyến đi: " + ex.getMessage());
            ex.printStackTrace();
            return false;
        }
    }

    @Override
    public long countTrips() {
        Session session = sessionFactory.getObject().getCurrentSession();
        Query<Long> query = session.createQuery("SELECT COUNT(t) FROM Trip t", Long.class);
        return query.getSingleResult();
    }

    @Override
    public boolean decreaseAvailableSeats(int tripId, int numberOfSeats) {
        Session session = sessionFactory.getObject().getCurrentSession();
        Trip trip = session.get(Trip.class, tripId);
        if (trip != null && trip.getAvailableSeats() != null && trip.getAvailableSeats() >= numberOfSeats) {
            trip.setAvailableSeats(trip.getAvailableSeats() - numberOfSeats);
            trip.setTotalBookedSeats(trip.getTotalBookedSeats() + numberOfSeats);
            session.merge(trip);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean increaseAvailableSeats(int tripId, int numberOfSeats) {
        Session session = sessionFactory.getObject().getCurrentSession();
        Trip trip = session.get(Trip.class, tripId);
        if (trip != null && trip.getTotalBookedSeats() != null && trip.getTotalBookedSeats() >= numberOfSeats) {
            trip.setAvailableSeats(trip.getAvailableSeats() + numberOfSeats);
            trip.setTotalBookedSeats(trip.getTotalBookedSeats() - numberOfSeats);
            session.merge(trip);
            return true;
        }
        return false;
    }

    @Override
    public List<Object[]> getMonthlyRevenueStats(int year) {
        Session session = sessionFactory.getObject().getCurrentSession();
        // Câu truy vấn HQL để tính tổng doanh thu theo tháng
        // Lưu ý: EXTRACT(MONTH FROM ...) là hàm chuẩn SQL, Hibernate sẽ chuyển đổi phù hợp
        // Cho LocalDateTime, dùng YEAR() và MONTH() hoặc các hàm tương đương của Hibernate
        Query<Object[]> q = session.createQuery(
                "SELECT FUNCTION('MONTH', b.bookingDate), SUM(b.totalAmount) "
                + "FROM Booking b JOIN b.tripId t "
                + "WHERE FUNCTION('YEAR', b.bookingDate) = :year "
                + "AND b.paymentStatus = 'Paid' "
                + // Chỉ tính doanh thu của các booking đã thanh toán
                "GROUP BY FUNCTION('MONTH', b.bookingDate) "
                + "ORDER BY FUNCTION('MONTH', b.bookingDate) ASC", Object[].class);
        q.setParameter("year", year);
        return q.getResultList();
    }

    @Override
    public List<Object[]> getTripCountByRouteStats() {
        Session session = sessionFactory.getObject().getCurrentSession();
        // Thống kê số lượng chuyến đi theo tuyến đường
        Query<Object[]> q = session.createQuery(
                "SELECT r.routeName, COUNT(t.id) "
                + "FROM Trip t JOIN t.routeId r "
                + "GROUP BY r.routeName "
                + "ORDER BY COUNT(t.id) DESC", Object[].class);
        return q.getResultList();
    }

    @Override
    public List<Trip> findTrips(LocalDateTime departureTime, LocalDateTime arrivalTime,
                                Integer routeId, Integer busId, Integer driverId,
                                String status, String origin, String destination,
                                Integer page, Integer pageSize) {
        Session session = this.sessionFactory.getObject().getCurrentSession();
        StringBuilder hql = new StringBuilder("FROM Trip t JOIN FETCH t.routeId r JOIN FETCH t.busId b JOIN FETCH t.driverId d WHERE 1=1");

        // Xử lý các tham số có thể null bằng cách sử dụng logic OR với IS NULL
        if (departureTime != null) {
            hql.append(" AND t.departureTime BETWEEN :startOfDay AND :endOfDay");
        }
        if (arrivalTime != null) {
            hql.append(" AND t.arrivalTime BETWEEN :startOfDayArrival AND :endOfDayArrival");
        }
        if (routeId != null) {
            hql.append(" AND r.id = :routeId");
        }
        if (busId != null) {
            hql.append(" AND b.id = :busId");
        }
        if (driverId != null) {
            hql.append(" AND d.id = :driverId");
        }
        if (status != null && !status.isEmpty()) {
            hql.append(" AND LOWER(t.status) = LOWER(:status)");
        }
        if (origin != null && !origin.isEmpty()) {
            hql.append(" AND LOWER(r.origin) LIKE :origin");
        }
        if (destination != null && !destination.isEmpty()) {
            hql.append(" AND LOWER(r.destination) LIKE :destination");
        }

        hql.append(" ORDER BY t.departureTime DESC");

        Query<Trip> query = session.createQuery(hql.toString(), Trip.class);
        
        // Chỉ gán tham số nếu nó không null
        if (departureTime != null) {
            LocalDateTime startOfDay = departureTime.toLocalDate().atStartOfDay();
            LocalDateTime endOfDay = departureTime.toLocalDate().atTime(23, 59, 59);
            query.setParameter("startOfDay", startOfDay);
            query.setParameter("endOfDay", endOfDay);
        }
        if (arrivalTime != null) {
            LocalDateTime startOfDayArrival = arrivalTime.toLocalDate().atStartOfDay();
            LocalDateTime endOfDayArrival = arrivalTime.toLocalDate().atTime(23, 59, 59);
            query.setParameter("startOfDayArrival", startOfDayArrival);
            query.setParameter("endOfDayArrival", endOfDayArrival);
        }
        if (routeId != null) {
            query.setParameter("routeId", routeId);
        }
        if (busId != null) {
            query.setParameter("busId", busId);
        }
        if (driverId != null) {
            query.setParameter("driverId", driverId);
        }
        if (status != null && !status.isEmpty()) {
            query.setParameter("status", status.toLowerCase());
        }
        if (origin != null && !origin.isEmpty()) {
            query.setParameter("origin", "%" + origin.toLowerCase() + "%");
        }
        if (destination != null && !destination.isEmpty()) {
            query.setParameter("destination", "%" + destination.toLowerCase() + "%");
        }
        
         if (page != null && page > 0 && pageSize != null && pageSize > 0) {
            query.setFirstResult((page - 1) * pageSize);
            query.setMaxResults(pageSize);
        }

        return query.getResultList();
    }

}

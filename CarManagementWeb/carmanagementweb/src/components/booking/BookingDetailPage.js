// src/components/booking/BookingDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../../configs/Apis';
import dayjs from 'dayjs';

const BookingDetailPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await authApis().get(`${endpoints.bookings}/${id}`);
        setBooking(res.data);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết booking:", err);
        if (err.response?.status === 404) {
          alert("Không tìm thấy vé!");
          nav("/bookings");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id, nav]);

  if (loading) return <p>⏳ Đang tải...</p>;
  if (!booking) return <p>🚫 Không tìm thấy dữ liệu</p>;

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">📄 Chi tiết vé #{booking.id}</h2>
      <p><strong>Chuyến đi:</strong> {booking.tripId?.routeId?.name}</p>
      <p><strong>Ngày khởi hành:</strong> {dayjs(booking.tripId?.departureTime).format("HH:mm DD/MM/YYYY")}</p>
      <p><strong>Số ghế:</strong> {booking.seatNumbers?.join(', ')}</p>
      <p><strong>Trạng thái:</strong> {booking.status}</p>
    </div>
  );
};

export default BookingDetailPage;

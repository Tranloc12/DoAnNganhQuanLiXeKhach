import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Apis, { authApis, endpoints } from "../../configs/Apis";

const BookingPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [form, setForm] = useState({ fullname: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await Apis.get(endpoints.tripDetail(tripId));
        setTrip(res.data);
      } catch (err) {
        console.error("Không thể load thông tin chuyến:", err);
      }
    };
    fetchTrip();
  }, [tripId]);

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prev) =>
      prev.includes(seatNumber)
        ? prev.filter((s) => s !== seatNumber)
        : [...prev, seatNumber]
    );
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (token) {
        // ✅ User đã login
        await authApis().post(endpoints.bookings, {
          tripId: parseInt(tripId),
          numberOfSeats: selectedSeats.length,
          seatNumbers: selectedSeats,
        });
      } else {
        // ✅ Guest booking
        await Apis.post(endpoints.guestBookings, {
          tripId: parseInt(tripId),
          numberOfSeats: selectedSeats.length,
          seatNumbers: selectedSeats,
          fullname: form.fullname,
          phone: form.phone,
          email: form.email,
        });
      }
      alert("Đặt vé thành công!");
    } catch (err) {
      alert("Đặt vé thất bại!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!trip) return <p>Đang tải thông tin chuyến đi...</p>;

  return (
    <form onSubmit={handleBooking} className="space-y-6">
      <h2 className="text-2xl font-bold">Chọn ghế cho chuyến đi: {trip.routeName}</h2>
      <p>Thời gian khởi hành: {trip.departureTime}</p>

      {/* Ghế */}
      <div className="grid grid-cols-5 gap-2">
        {[...Array(trip.busCapacity || 40).keys()].map((seat) => {
          const seatNumber = seat + 1;
          const selected = selectedSeats.includes(seatNumber);
          return (
            <div
              key={seatNumber}
              onClick={() => handleSeatClick(seatNumber)}
              className={`p-3 rounded cursor-pointer text-center ${
                selected ? "bg-green-500 text-white" : "bg-gray-200"
              }`}
            >
              {seatNumber}
            </div>
          );
        })}
      </div>

      {/* Form cho khách chưa login */}
      {!token && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Họ và tên"
            value={form.fullname}
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-xl transition duration-300"
          disabled={loading}
        >
          Quay lại
        </button>
        <button
          type="submit"
          disabled={
            selectedSeats.length === 0 ||
            loading ||
            (!token && (!form.fullname || !form.phone || !form.email))
          }
          className="font-bold py-3 px-6 rounded-xl shadow-lg transition duration-300 text-xl"
          style={{
            background: "linear-gradient(90deg,#1976d2 0%,#64b5f6 100%)",
            color: "#fff",
          }}
        >
          {loading ? "Đang đặt chỗ..." : "Đặt Chỗ"}
        </button>
      </div>
    </form>
  );
};

export default BookingPage;

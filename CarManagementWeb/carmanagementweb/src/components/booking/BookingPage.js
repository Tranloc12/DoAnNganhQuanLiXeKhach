// src/pages/BookingPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";


const BookingPage = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await authApis().get(endpoints.tripDetail(tripId));
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

  const handleBooking = async () => {
    try {
      const res = await authApis().post(endpoints.bookings, {
        tripId: parseInt(tripId),
        numberOfSeats: selectedSeats.length,
        seatNumbers: selectedSeats,
      });
      alert("Đặt vé thành công!");
    } catch (err) {
      alert("Đặt vé thất bại!");
      console.error(err);
    }
  };

  if (!trip) return <p>Đang tải thông tin chuyến đi...</p>;

  return (
    <div>
      <h2>Chọn ghế cho chuyến đi: {trip.routeName}</h2>
      <p>Thời gian khởi hành: {trip.departureTime}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 50px)", gap: 10 }}>
        {[...Array(trip.busCapacity || 40).keys()].map((seat) => {
          const seatNumber = seat + 1;
          const selected = selectedSeats.includes(seatNumber);
          return (
            <div
              key={seatNumber}
              onClick={() => handleSeatClick(seatNumber)}
              style={{
                padding: 10,
                backgroundColor: selected ? "green" : "lightgray",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              {seatNumber}
            </div>
          );
        })}
      </div>
      <button onClick={handleBooking}>Đặt vé</button>
    </div>
  );
};

export default BookingPage;

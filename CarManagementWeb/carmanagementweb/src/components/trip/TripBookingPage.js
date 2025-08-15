// src/components/booking/TripBookingPage.js
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { endpoints, authApis } from "../../configs/Apis";
import { Button, Spinner } from "react-bootstrap";

const TripBookingPage = () => {
  const { id } = useParams(); // tripId
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    const loadTrip = async () => {
      try {
        const res = await authApis().get(endpoints.tripDetail(id));
        setTrip(res.data);
      } catch (err) {
        console.error("Failed to load trip", err);
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id]);

  const handleSeatSelect = (seat) => {
    setSelectedSeat(seat);
  };

  const handleBooking = async () => {
    try {
      await authApis().post(endpoints.bookings, {
        tripId: trip.id,
        seatNumber: selectedSeat
      });
      alert("Đặt vé thành công!");
    } catch (err) {
      console.error("Đặt vé thất bại", err);
      alert("Lỗi khi đặt vé");
    }
  };

  if (loading) return <Spinner animation="border" />;

  if (!trip) return <p>🚫 Không tìm thấy chuyến đi</p>;

  return (
    <div>
      <h2>Chọn ghế cho chuyến đi #{trip.id}</h2>
      <p>Thời gian khởi hành: {trip.departureTime}</p>
      <p>Số ghế còn lại: {trip.availableSeats}</p>

      <div className="d-flex flex-wrap gap-2 mt-3">
        {[...Array(trip.bus.totalSeats).keys()].map((seat) => {
          const seatNumber = seat + 1;
          const isBooked = trip.bookedSeats?.includes(seatNumber); // nếu API có trả danh sách ghế đã đặt

          return (
            <Button
              key={seatNumber}
              variant={
                isBooked
                  ? "secondary"
                  : selectedSeat === seatNumber
                  ? "success"
                  : "outline-primary"
              }
              disabled={isBooked}
              onClick={() => handleSeatSelect(seatNumber)}
            >
              Ghế {seatNumber}
            </Button>
          );
        })}
      </div>

      <Button className="mt-3" onClick={handleBooking} disabled={!selectedSeat}>
        Đặt vé
      </Button>
    </div>
  );
};

export default TripBookingPage;

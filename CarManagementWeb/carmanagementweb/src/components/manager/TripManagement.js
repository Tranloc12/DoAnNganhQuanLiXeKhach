import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Table, Alert, Spinner, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const TripManagement = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = async () => {
    try {
      const res = await authApis().get(endpoints.trips);
      setTrips(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách chuyến đi:", err);
      setError("Không thể tải danh sách chuyến đi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const deleteTrip = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá chuyến đi này không?")) return;

    try {
      await authApis().delete(endpoints.deleteTrip(id));
      setTrips(trips.filter((t) => t.id !== id));
    } catch (err) {
      console.error("❌ Xoá thất bại:", err);
      alert("Xoá chuyến đi thất bại.");
    }
  };

  const formatDateTime = (arr) => {
    if (!arr || arr.length < 5) return "---";
    const [y, m, d, h, min] = arr;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")} ${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

  const renderStatusBadge = (status) => {
    const map = {
      SCHEDULED: "primary",
      DONE: "success",
      CANCELLED: "danger",
      DELAYED: "warning",
    };
    return <Badge bg={map[status] || "secondary"}>{status}</Badge>;
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">🚌 Quản lý chuyến đi</h2>
        <Link to="/manager/trips/add">
          <Button variant="success">➕ Thêm chuyến đi</Button>
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <Table bordered hover responsive className="align-middle text-center table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Tuyến</th>
              <th>Xe</th>
              <th>Tài xế</th>
              <th>Đi</th>
              <th>Đến</th>
              <th>Thực tế đến</th>
              <th>Giá vé</th>
              <th>Ghế trống</th>
              <th>Đã đặt</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.id}>
                <td>{trip.id}</td>
                <td>{trip.routeName}</td>
                <td>{trip.busLicensePlate}</td>
                <td>{trip.driverName}</td>
                <td>{formatDateTime(trip.departureTime)}</td>
                <td>{formatDateTime(trip.arrivalTime)}</td>
                <td>{formatDateTime(trip.actualArrivalTime)}</td>
                <td>{trip.fare?.toLocaleString()}đ</td>
                <td>{trip.availableSeats}</td>
                <td>{trip.totalBookedSeats}</td>
                <td>{renderStatusBadge(trip.status)}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Link to={`/manager/trips/edit/${trip.id}`}>
                      <Button variant="warning" size="sm">
                        ✏️
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteTrip(trip.id)}
                    >
                      🗑️
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default TripManagement;

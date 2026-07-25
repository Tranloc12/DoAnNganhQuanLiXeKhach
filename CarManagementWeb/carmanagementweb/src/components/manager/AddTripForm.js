import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import moment from 'moment';

const AddTripForm = () => {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState({
    routeId: "",
    busId: "",
    driverId: "",
    departureTime: "",
    arrivalTime: "",
    actualArrivalTime: "",
    fare: "",
  });
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Sử dụng `Promise.all` để tải dữ liệu đồng thời, tối ưu hiệu suất
        const [routesRes, busesRes, driversRes] = await Promise.all([
          authApis().get(endpoints.routes),
          authApis().get(endpoints.buses),
          authApis().get(endpoints.drivers),
        ]);
        setRoutes(routesRes.data);
        setBuses(busesRes.data);
        setDrivers(driversRes.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu cần thiết. Vui lòng thử lại.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (new Date(tripData.departureTime) >= new Date(tripData.arrivalTime)) {
      setError("Thời gian đến phải sau thời gian khởi hành.");
      setLoading(false);
      return;
    }

    try {
      const departureDate = new Date(tripData.departureTime);
      const arrivalDate = new Date(tripData.arrivalTime);

      // Xử lý actualArrivalTime: gửi null nếu không có giá trị, nếu không thì chuyển đổi
      let actualArrivalTimePayload = null;
      if (tripData.actualArrivalTime) {
        const actualArrivalDate = new Date(tripData.actualArrivalTime);
        actualArrivalTimePayload = [
          actualArrivalDate.getFullYear(),
          actualArrivalDate.getMonth() + 1,
          actualArrivalDate.getDate(),
          actualArrivalDate.getHours(),
          actualArrivalDate.getMinutes(),
        ];
      }

      const payload = {
        fare: parseFloat(tripData.fare),
        routeId: parseInt(tripData.routeId),
        busId: parseInt(tripData.busId),
        driverId: parseInt(tripData.driverId),
        departureTime: [
          departureDate.getFullYear(),
          departureDate.getMonth() + 1,
          departureDate.getDate(),
          departureDate.getHours(),
          departureDate.getMinutes()
        ],
        arrivalTime: [
          arrivalDate.getFullYear(),
          arrivalDate.getMonth() + 1,
          arrivalDate.getDate(),
          arrivalDate.getHours(),
          arrivalDate.getMinutes()
        ],
        actualArrivalTime: actualArrivalTimePayload, // Gửi giá trị đã xử lý
        status: tripData.actualArrivalTime ? "Arrived" : "Scheduled", // Cập nhật trạng thái
      };

      await authApis().post(endpoints.trips, payload);
      alert("✅ Thêm chuyến đi thành công!");
      navigate("/trip-management");
    } catch (err) {
      console.error("❌ Lỗi khi thêm chuyến đi:", err);
      if (err.response && err.response.data) {
        setError(`Thêm chuyến đi thất bại: ${err.response.data.message || err.response.data.detail}`);
      } else {
        setError("Thêm chuyến đi thất bại. Vui lòng kiểm tra lại thông tin.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="text-center fw-bold mb-4">➕ Thêm chuyến đi mới</h2>
      <Row className="justify-content-md-center">
        <Col md={8}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tuyến đường</Form.Label>
              <Form.Control
                as="select"
                name="routeId"
                value={tripData.routeId}
                onChange={handleChange}
                required
              >
                <option value="">Chọn tuyến đường</option>
                {routes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.origin} → {route.destination}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Xe</Form.Label>
              <Form.Control
                as="select"
                name="busId"
                value={tripData.busId}
                onChange={handleChange}
                required
              >
                <option value="">Chọn xe</option>
                {buses.map((bus) => (
                  <option key={bus.id} value={bus.id}>
                    {bus.licensePlate} ({bus.capacity} chỗ)
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tài xế</Form.Label>
              <Form.Control
                as="select"
                name="driverId"
                value={tripData.driverId}
                onChange={handleChange}
                required
              >
                <option value="">Chọn tài xế</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.userId.username} - ({driver.licenseNumber})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thời gian khởi hành</Form.Label>
              <Form.Control
                type="datetime-local"
                name="departureTime"
                value={tripData.departureTime}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Thời gian dự kiến đến</Form.Label>
              <Form.Control
                type="datetime-local"
                name="arrivalTime"
                value={tripData.arrivalTime}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Giá vé</Form.Label>
              <Form.Control
                type="number"
                name="fare"
                value={tripData.fare}
                onChange={handleChange}
                placeholder="Nhập giá vé"
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => navigate("/manager/trips")}>
                Hủy
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Đang thêm...
                  </>
                ) : (
                  "Thêm chuyến đi"
                )}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddTripForm;
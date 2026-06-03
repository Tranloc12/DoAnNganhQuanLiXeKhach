import { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";

const EditScheduleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [scheduleData, setScheduleData] = useState({
    tripId: "",
    busId: "",
    driverId: "",
    departureTime: "",
    estimatedArrivalTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // State để lưu danh sách lựa chọn từ API
  const [trips, setTrips] = useState([]);
  const [buses, setBuses] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // Lấy dữ liệu của lịch trình và các danh sách lựa chọn
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, tripsRes, busesRes, driversRes] = await Promise.all([
          authApis().get(endpoints.scheduleDetail(id)),
          authApis().get(endpoints.trips),
          authApis().get(endpoints.buses),
          authApis().get(endpoints.drivers),
        ]);

        const schedule = scheduleRes.data;
        setScheduleData({
          tripId: schedule.trip.id,
          busId: schedule.bus.id,
          driverId: schedule.driver.id,
          departureTime: new Date(schedule.departureTime).toISOString().slice(0, 16),
          estimatedArrivalTime: new Date(schedule.estimatedArrivalTime).toISOString().slice(0, 16),
        });

        setTrips(tripsRes.data);
        setBuses(busesRes.data);
        setDrivers(driversRes.data);

      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu lịch trình. Vui lòng thử lại.");
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({ ...scheduleData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await authApis().put(endpoints.scheduleDetail(id), scheduleData);
      alert("✅ Cập nhật lịch trình thành công!");
      navigate("/manager/schedules");
    } catch (err) {
      console.error("Lỗi khi cập nhật lịch trình:", err);
      setError("❌ Lỗi khi cập nhật. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="mt-4 mb-3">Chỉnh sửa lịch trình</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Chuyến đi</Form.Label>
          <Form.Control
            as="select"
            name="tripId"
            value={scheduleData.tripId}
            onChange={handleChange}
            required
          >
            <option value="">Chọn chuyến đi...</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name} - {trip.route?.origin} &rarr; {trip.route?.destination}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Xe buýt</Form.Label>
          <Form.Control
            as="select"
            name="busId"
            value={scheduleData.busId}
            onChange={handleChange}
            required
          >
            <option value="">Chọn xe buýt...</option>
            {buses.map((bus) => (
              <option key={bus.id} value={bus.id}>
                {bus.licensePlate} ({bus.type})
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tài xế</Form.Label>
          <Form.Control
            as="select"
            name="driverId"
            value={scheduleData.driverId}
            onChange={handleChange}
            required
          >
            <option value="">Chọn tài xế...</option>
            {drivers.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thời gian khởi hành</Form.Label>
          <Form.Control
            type="datetime-local"
            name="departureTime"
            value={scheduleData.departureTime}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thời gian đến dự kiến</Form.Label>
          <Form.Control
            type="datetime-local"
            name="estimatedArrivalTime"
            value={scheduleData.estimatedArrivalTime}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />{" "}
              Đang cập nhật...
            </>
          ) : (
            "Cập nhật lịch trình"
          )}
        </Button>
      </Form>
    </>
  );
};

export default EditScheduleForm;
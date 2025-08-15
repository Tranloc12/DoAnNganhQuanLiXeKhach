// src/components/buses/AddBusForm.js
import { useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";

const AddBusForm = () => {
  const [bus, setBus] = useState({
    licensePlate: "",
    model: "",
    capacity: "",
    yearManufacture: "",
    status: "",
    description: "",
    isActive: true,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const busStatuses = ["Active", "Maintenance", "Inactive"]; // Có thể điều chỉnh nếu lấy từ API

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBus((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const preparedBus = {
        ...bus,
        capacity: parseInt(bus.capacity),
        yearManufacture: parseInt(bus.yearManufacture),
      };

      await authApis().post(endpoints.buses, preparedBus);
      setSuccess("🟢 Thêm xe buýt thành công!");
      setTimeout(() => navigate("/bus-management"), 1500);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403)
        setError("🔴 Bạn không có quyền thực hiện hành động này.");
      else if (err.response?.data?.message)
        setError(`🔴 Lỗi: ${err.response.data.message}`);
      else setError("🔴 Có lỗi xảy ra khi thêm xe buýt.");
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">🚌 Thêm Xe Buýt Mới</h2>

      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Biển số xe:</Form.Label>
          <Form.Control
            type="text"
            name="licensePlate"
            value={bus.licensePlate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Kiểu xe:</Form.Label>
          <Form.Control
            type="text"
            name="model"
            value={bus.model}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Sức chứa (số ghế):</Form.Label>
          <Form.Control
            type="number"
            name="capacity"
            value={bus.capacity}
            onChange={handleChange}
            required
            min={1}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Năm sản xuất:</Form.Label>
          <Form.Control
            type="number"
            name="yearManufacture"
            value={bus.yearManufacture}
            onChange={handleChange}
            required
            min={1900}
            max={new Date().getFullYear()}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Trạng thái:</Form.Label>
          <Form.Select
            name="status"
            value={bus.status}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn trạng thái --</option>
            {busStatuses.map((status, idx) => (
              <option key={idx} value={status}>
                {status}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mô tả:</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={bus.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 form-check">
          <Form.Check
            type="checkbox"
            name="isActive"
            checked={bus.isActive}
            onChange={handleChange}
            label="Hoạt động"
          />
        </Form.Group>

        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">
            Lưu
          </Button>
          <Button variant="secondary" onClick={() => navigate("/manager/buses")}>
            Hủy
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default AddBusForm;

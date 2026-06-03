import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { authApis, endpoints } from "../../configs/Apis.js";

const BusForm = ({ bus, onClose, onSuccess }) => {
  const [form, setForm] = useState(
    bus || { licensePlate: "", seatCount: "", type: "" }
  );

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (bus) {
        await authApis().put(endpoints.updateBus(bus.id), form);
      } else {
        await authApis().post(endpoints.buses, form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert("Lỗi khi lưu xe!");
    }
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{bus ? "Sửa xe" : "Thêm xe"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Biển số</Form.Label>
            <Form.Control
              name="licensePlate"
              value={form.licensePlate}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số ghế</Form.Label>
            <Form.Control
              type="number"
              name="seatCount"
              value={form.seatCount}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Loại xe</Form.Label>
            <Form.Control
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="VD: Giường nằm, Ghế ngồi"
            />
          </Form.Group>
          <Button type="submit" variant="primary">
            Lưu
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BusForm;

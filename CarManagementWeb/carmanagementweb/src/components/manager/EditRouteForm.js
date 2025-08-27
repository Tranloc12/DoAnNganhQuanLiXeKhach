import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Form, Spinner } from "react-bootstrap";

const EditRouteForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [route, setRoute] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const res = await authApis().get(`${endpoints.routes}/${id}`);
        setRoute(res.data);
      } catch (err) {
        console.error("❌ Lỗi khi tải tuyến đường:", err);
      }
    };
    fetchRoute();
  }, [id]);

  const handleChange = (e) => {
    setRoute({ ...route, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authApis().put(`${endpoints.routes}/${id}`, route);
      navigate("/manager/routes");
    } catch (err) {
      console.error("❌ Lỗi khi cập nhật tuyến đường:", err);
    }
  };

  if (!route) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <h2>Chỉnh sửa tuyến đường</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Tên tuyến</Form.Label>
          <Form.Control
            type="text"
            name="routeName"
            value={route.routeName}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Điểm đầu</Form.Label>
          <Form.Control
            type="text"
            name="origin"
            value={route.origin}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Điểm cuối</Form.Label>
          <Form.Control
            type="text"
            name="destination"
            value={route.destination}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Khoảng cách (km)</Form.Label>
          <Form.Control
            type="number"
            name="distanceKm"
            value={route.distanceKm}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thời gian dự kiến</Form.Label>
          <Form.Control
            type="text"
            name="estimatedTravelTime"
            value={route.estimatedTravelTime}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Giá/km</Form.Label>
          <Form.Control
            type="number"
            name="pricePerKm"
            value={route.pricePerKm}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Hoạt động"
            name="isActive"
            checked={route.isActive}
            onChange={(e) => setRoute({ ...route, isActive: e.target.checked })}
          />
        </Form.Group>

        <Button type="submit" variant="primary">Cập nhật</Button>
      </Form>
    </>
  );
};

export default EditRouteForm;

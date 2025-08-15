import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner, Row, Col } from "react-bootstrap";
import { FaSave } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import moment from 'moment';
import { authApis, endpoints } from "../../configs/Apis";

const EditTripForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        routeId: "",
        busId: "",
        driverId: "",
        departureTime: "",
        arrivalTime: "",
        actualArrivalTime: "",
        fare: ""
    });

    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);
    const [drivers, setDrivers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [tripRes, routesRes, busesRes, driversRes] = await Promise.all([
                    authApis().get(endpoints.getTripById(id)),
                    authApis().get(endpoints.routes),
                    authApis().get(endpoints.buses),
                    authApis().get(endpoints.drivers),
                ]);

                const formatTimeArrayToString = (timeArray) => {
                    if (!timeArray || timeArray.length < 5) return "";
                    return moment(timeArray.slice(0, 5)).format('YYYY-MM-DDTHH:mm');
                };

                const fetchedTrip = tripRes.data;
                setFormData({
                    ...fetchedTrip,
                    departureTime: formatTimeArrayToString(fetchedTrip.departureTime),
                    arrivalTime: formatTimeArrayToString(fetchedTrip.arrivalTime),
                    actualArrivalTime: fetchedTrip.actualArrivalTime ? formatTimeArrayToString(fetchedTrip.actualArrivalTime) : "",
                    fare: fetchedTrip.fare ? fetchedTrip.fare.toString() : "",
                    routeId: fetchedTrip.routeId ? fetchedTrip.routeId.toString() : "",
                    busId: fetchedTrip.busId ? fetchedTrip.busId.toString() : "",
                    driverId: fetchedTrip.driverId ? fetchedTrip.driverId.toString() : ""
                });

                setRoutes(routesRes.data);
                setBuses(busesRes.data);
                setDrivers(driversRes.data);
            } catch (e) {
                console.error("❌ Lỗi khi tải dữ liệu:", e);
                setError("Không thể tải dữ liệu chuyến đi hoặc các thông tin liên quan!");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await authApis().put(endpoints.updateTrip(id), formData);
            alert("Cập nhật chuyến đi thành công!");
            navigate("/trip-management");
        } catch (e) {
            console.error("❌ Lỗi khi gửi form:", e);
            setError("Lỗi khi cập nhật dữ liệu. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-2">Đang tải dữ liệu chuyến đi...</p>
            </Container>
        );
        }

    return (
        <Container className="my-5">
            <h2 className="text-center fw-bold mb-4">✏️ Chỉnh sửa chuyến đi</h2>
            <Row className="justify-content-md-center">
                <Col md={8}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tuyến đường</Form.Label>
                            <Form.Select name="routeId" value={formData.routeId} onChange={handleChange} required>
                                <option value="">-- Chọn tuyến đường --</option>
                                {routes.map((r) => (<option key={r.id} value={r.id}>{r.origin} → {r.destination}</option>))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Xe buýt</Form.Label>
                            <Form.Select name="busId" value={formData.busId} onChange={handleChange} required>
                                <option value="">-- Chọn xe buýt --</option>
                                {buses.map((b) => (<option key={b.id} value={b.id}>{b.licensePlate} ({b.capacity} chỗ)</option>))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tài xế</Form.Label>
                            <Form.Select name="driverId" value={formData.driverId} onChange={handleChange} required>
                                <option value="">-- Chọn tài xế --</option>
                                {drivers.map((d) => (<option key={d.id} value={d.id}>{d.userId.username} - ({d.licenseNumber})</option>))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Giá vé</Form.Label>
                            <Form.Control type="number" name="fare" value={formData.fare} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian khởi hành</Form.Label>
                            <Form.Control type="datetime-local" name="departureTime" value={formData.departureTime} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian đến dự kiến</Form.Label>
                            <Form.Control type="datetime-local" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} required />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Thời gian đến thực tế</Form.Label>
                            <Form.Control type="datetime-local" name="actualArrivalTime" value={formData.actualArrivalTime} onChange={handleChange} />
                        </Form.Group>

                        <div className="d-flex justify-content-between mt-4">
                            <Button variant="outline-secondary" onClick={() => navigate("/trip-management")} disabled={saving} className="d-flex align-items-center">
                                <MdOutlineCancel className="me-2" /> Hủy
                            </Button>
                            <Button variant="primary" type="submit" disabled={saving} className="d-flex align-items-center">
                                {saving ? <Spinner as="span" animation="border" size="sm" /> : <FaSave className="me-2" />}
                                Lưu thay đổi
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default EditTripForm;
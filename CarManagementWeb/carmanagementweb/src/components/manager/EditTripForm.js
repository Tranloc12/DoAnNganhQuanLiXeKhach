import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert, Spinner, Row, Col, Modal } from "react-bootstrap";
import { FaSave } from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import moment from 'moment'; // Đảm bảo thư viện moment đã được cài đặt: npm install moment
import { authApis, endpoints } from "../../configs/Apis"; // Đảm bảo đường dẫn này đúng

const EditTripForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // State mới cho thông báo thành công
    const [showModal, setShowModal] = useState(false); // State cho modal

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

    // Hàm tiện ích để định dạng mảng thời gian từ backend thành chuỗi cho input datetime-local
    const formatTimeArrayToString = (timeArray) => {
        if (!timeArray || timeArray.length < 5) return "";
        return moment(timeArray.slice(0, 5)).format('YYYY-MM-DDTHH:mm');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Sử dụng Promise.all để tải tất cả dữ liệu cần thiết song song
                const [tripRes, routesRes, busesRes, driversRes] = await Promise.all([
                    authApis().get(endpoints.getTripById(id)),
                    authApis().get(endpoints.routes),
                    authApis().get(endpoints.buses),
                    authApis().get(endpoints.drivers),
                ]);

                const fetchedTrip = tripRes.data;
                // Cập nhật formData với dữ liệu chuyến đi đã lấy
                // Chuyển đổi ID thành chuỗi để khớp với giá trị của select input
                setFormData({
                    ...fetchedTrip,
                    departureTime: formatTimeArrayToString(fetchedTrip.departureTime),
                    arrivalTime: formatTimeArrayToString(fetchedTrip.arrivalTime),
                    actualArrivalTime: fetchedTrip.actualArrivalTime ? formatTimeArrayToString(fetchedTrip.actualArrivalTime) : "",
                    fare: fetchedTrip.fare ? fetchedTrip.fare.toString() : "", // Đảm bảo fare là chuỗi cho input type="number"
                    // CÁC THAY ĐỔI Ở ĐÂY: Dựa trên TripDTO, routeId, busId, driverId là các số nguyên trực tiếp, không phải đối tượng có thuộc tính .id
                    routeId: fetchedTrip.routeId ? fetchedTrip.routeId.toString() : "", 
                    busId: fetchedTrip.busId ? fetchedTrip.busId.toString() : "",       
                    driverId: fetchedTrip.driverId ? fetchedTrip.driverId.toString() : "" 
                });

                setRoutes(routesRes.data);
                setBuses(busesRes.data);
                setDrivers(driversRes.data);
            } catch (e) {
                console.error("❌ Lỗi khi tải dữ liệu:", e);
                setError("Không thể tải dữ liệu chuyến đi hoặc các thông tin liên quan. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]); // id là dependency, useEffect sẽ chạy lại khi id thay đổi

    // Xử lý thay đổi input của form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMessage(null);

        // --- Client-side validation ---
        const departureMoment = moment(formData.departureTime);
        const arrivalMoment = moment(formData.arrivalTime);

        if (!departureMoment.isValid() || !arrivalMoment.isValid()) {
            setError("Vui lòng nhập thời gian khởi hành và thời gian đến hợp lệ.");
            setSaving(false);
            return;
        }

        if (arrivalMoment.isBefore(departureMoment)) {
            setError("Thời gian đến dự kiến không thể sớm hơn thời gian khởi hành.");
            setSaving(false);
            return;
        }

        // Chuyển đổi fare thành số trước khi gửi đi
        const tripDataToSend = {
            ...formData,
            fare: parseFloat(formData.fare), // Chuyển đổi sang số thực
            // Các trường ID đã là chuỗi, backend sẽ tự parse lại thành số khi nhận được
        };

        try {
            await authApis().put(endpoints.updateTrip(id), tripDataToSend);
            setSuccessMessage("Cập nhật chuyến đi thành công!");
            setShowModal(true); // Hiển thị modal thông báo thành công
        } catch (e) {
            console.error("❌ Lỗi khi gửi form:", e);
            // Cố gắng lấy thông báo lỗi chi tiết từ backend nếu có
            const errorMessage = e.response?.data?.message || "Lỗi khi cập nhật dữ liệu. Vui lòng thử lại.";
            setError(errorMessage);
            setShowModal(true); // Hiển thị modal thông báo lỗi
        } finally {
            setSaving(false);
        }
    };

    // Đóng modal và điều hướng
    const handleCloseModal = () => {
        setShowModal(false);
        if (successMessage) {
            navigate("/trip-management");
        }
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
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
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Tuyến đường</Form.Label>
                            <Form.Select name="routeId" value={formData.routeId} onChange={handleChange} required>
                                <option value="">-- Chọn tuyến đường --</option>
                                {routes.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.origin} → {r.destination}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Xe buýt</Form.Label>
                            <Form.Select name="busId" value={formData.busId} onChange={handleChange} required>
                                <option value="">-- Chọn xe buýt --</option>
                                {buses.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.licensePlate} ({b.capacity} chỗ)
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Tài xế</Form.Label>
                            <Form.Select name="driverId" value={formData.driverId} onChange={handleChange} required>
                                <option value="">-- Chọn tài xế --</option>
                                {drivers.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.userId.username} - ({d.licenseNumber})
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Giá vé</Form.Label>
                            <Form.Control type="number" name="fare" value={formData.fare} onChange={handleChange} required min="0" step="0.01" />
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
                            <Button variant="outline-secondary" onClick={() => navigate("/trip-management")} disabled={saving} className="d-flex align-items-center rounded">
                                <MdOutlineCancel className="me-2" /> Hủy
                            </Button>
                            <Button variant="primary" type="submit" disabled={saving} className="d-flex align-items-center rounded">
                                {saving ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> : <FaSave className="me-2" />}
                                Lưu thay đổi
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>

            {/* Modal để hiển thị thông báo thành công hoặc lỗi */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{successMessage ? "Thành công" : "Lỗi"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={successMessage ? "primary" : "danger"} onClick={handleCloseModal}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default EditTripForm;

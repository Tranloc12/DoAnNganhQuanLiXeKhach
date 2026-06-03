import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Table, Alert, Spinner, Badge, Modal, Form, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import moment from "moment"; // Sử dụng thư viện moment để định dạng ngày giờ

// Modal xác nhận xóa
const ConfirmationModal = ({ show, handleClose, handleConfirm, message }) => (
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Hủy
            </Button>
            <Button variant="danger" onClick={handleConfirm}>
                Xác nhận
            </Button>
        </Modal.Footer>
    </Modal>
);

// Modal thông báo
const AlertDialog = ({ show, handleClose, message }) => (
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>
                Đóng
            </Button>
        </Modal.Footer>
    </Modal>
);

const TripManagement = () => {
    const [trips, setTrips] = useState([]);
    const [routes, setRoutes] = useState([]); // Thêm state cho routes
    const [buses, setBuses] = useState([]);   // Thêm state cho buses
    const [drivers, setDrivers] = useState([]); // Thêm state cho drivers
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [tripToDeleteId, setTripToDeleteId] = useState(null);

    // ✅ State cho các tham số lọc
    const [filterParams, setFilterParams] = useState({
        departureTime: "",
        arrivalTime: "",
        routeId: "",
        busId: "",
        driverId: "",
        status: "",
        origin: "",
        destination: ""
    });

    const fetchTrips = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const query = new URLSearchParams(params).toString();
            const res = await authApis().get(`${endpoints.trips}?${query}`);
            setTrips(res.data);
        } catch (err) {
            console.error("❌ Lỗi khi tải danh sách chuyến đi:", err);
            setError("Không thể tải danh sách chuyến đi.");
        } finally {
            setLoading(false);
        }
    };
    
    // ✅ Hàm tải dữ liệu liên quan cho bộ lọc
    const fetchFilterData = async () => {
        try {
            const [routesRes, busesRes, driversRes] = await Promise.all([
                authApis().get(endpoints.routes),
                authApis().get(endpoints.buses),
                authApis().get(endpoints.drivers)
            ]);
            setRoutes(routesRes.data);
            setBuses(busesRes.data);
            setDrivers(driversRes.data);
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu bộ lọc:", err);
        }
    };

    useEffect(() => {
        fetchTrips(filterParams);
        fetchFilterData();
    }, []);

    const handleParamChange = (e) => {
        const { name, value } = e.target;
        setFilterParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchTrips(filterParams);
    };

    const deleteTripClick = (id) => {
        setTripToDeleteId(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        setShowConfirmModal(false);
        if (!tripToDeleteId) return;
        try {
            await authApis().delete(endpoints.deleteTrip(tripToDeleteId));
            setTrips(trips.filter((t) => t.id !== tripToDeleteId));
            setAlertMessage("Xóa chuyến đi thành công!");
            setShowAlertDialog(true);
        } catch (err) {
            console.error("❌ Xoá thất bại:", err);
            setAlertMessage("Xóa chuyến đi thất bại.");
            setShowAlertDialog(true);
        } finally {
            setTripToDeleteId(null);
        }
    };

    // Hàm format datetime
    const formatDateTime = (arr) => {
        if (!arr || arr.length < 5) return "---";
        const [y, m, d, h, min] = arr;
        return moment(`${y}-${m}-${d} ${h}:${min}`).format("YYYY-MM-DD HH:mm");
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
        <div className="container-fluid mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">🚌 Quản lý chuyến đi</h2>
                <Link to="/manager/trips/add">
                    <Button variant="success">➕ Thêm chuyến đi</Button>
                </Link>
            </div>

            {/* ✅ Form Bộ Lọc */}
            <Card className="mb-4 p-4 shadow-sm">
                <Card.Title className="mb-3">Bộ Lọc Chuyến Đi</Card.Title>
                <Form onSubmit={handleSearch}>
                    <Row className="g-3">
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Thời gian khởi hành từ</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="departureTime"
                                    value={filterParams.departureTime}
                                    onChange={handleParamChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Thời gian đến từ</Form.Label>
                                <Form.Control
                                    type="datetime-local"
                                    name="arrivalTime"
                                    value={filterParams.arrivalTime}
                                    onChange={handleParamChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Tuyến đường</Form.Label>
                                <Form.Select
                                    name="routeId"
                                    value={filterParams.routeId}
                                    onChange={handleParamChange}
                                >
                                    <option value="">Tất cả</option>
                                    {routes.map(r => (
                                        <option key={r.id} value={r.id}>{r.routeName}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Xe</Form.Label>
                                <Form.Select
                                    name="busId"
                                    value={filterParams.busId}
                                    onChange={handleParamChange}
                                >
                                    <option value="">Tất cả</option>
                                    {buses.map(b => (
                                        <option key={b.id} value={b.id}>{b.licensePlate}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Tài xế</Form.Label>
                                <Form.Select
                                    name="driverId"
                                    value={filterParams.driverId}
                                    onChange={handleParamChange}
                                >
                                    <option value="">Tất cả</option>
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.licenseNumber}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Select
                                    name="status"
                                    value={filterParams.status}
                                    onChange={handleParamChange}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="SCHEDULED">SCHEDULED</option>
                                    <option value="DONE">DONE</option>
                                    <option value="CANCELLED">CANCELLED</option>
                                    <option value="DELAYED">DELAYED</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Điểm xuất phát</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="origin"
                                    placeholder="Điểm đầu..."
                                    value={filterParams.origin}
                                    onChange={handleParamChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Điểm đến</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="destination"
                                    placeholder="Điểm cuối..."
                                    value={filterParams.destination}
                                    onChange={handleParamChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs={12} className="text-end mt-3">
                            <Button variant="primary" type="submit">
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

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
                            <th>Điểm đầu</th>
                            <th>Điểm cuối</th>
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
                        {trips.length > 0 ? (
                            trips.map((trip) => (
                                <tr key={trip.id}>
                                    <td>{trip.id}</td>
                                    <td>{trip.routeName}</td>
                                    <td>{trip.origin}</td>
                                    <td>{trip.destination}</td>
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
                                                onClick={() => deleteTripClick(trip.id)}
                                            >
                                                🗑️
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="14" className="text-center">Không tìm thấy chuyến đi nào.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            <ConfirmationModal
                show={showConfirmModal}
                handleClose={() => setShowConfirmModal(false)}
                handleConfirm={confirmDelete}
                message="Bạn có chắc chắn muốn xoá chuyến đi này không?"
            />
            <AlertDialog
                show={showAlertDialog}
                handleClose={() => setShowAlertDialog(false)}
                message={alertMessage}
            />
        </div>
    );
};

export default TripManagement;
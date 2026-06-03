import React, { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Table, Alert, Spinner, Modal, Form, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

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

const RouteManagement = () => {
    const [routes, setRoutes] = useState([]);
    const [stations, setStations] = useState([]); // ✅ Thêm state để lưu danh sách bến xe
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [routeToDeleteId, setRouteToDeleteId] = useState(null);

    // ✅ State cho các tham số lọc
    const [filterParams, setFilterParams] = useState({
        routeName: "",
        origin: "",
        destination: "",
        distanceFrom: "",
        distanceTo: "",
        priceFrom: "",
        priceTo: "",
        isActive: ""
    });

    // Hàm tải danh sách các tuyến đường từ API
    const fetchRoutes = async (params) => {
        setLoading(true);
        setError(null);
        try {
            const query = new URLSearchParams(params).toString();
            const res = await authApis().get(`${endpoints.routes}?${query}`);
            console.log("✅ Dữ liệu tuyến đường:", res.data);
            setRoutes(res.data);
        } catch (err) {
            console.error("❌ Lỗi khi tải tuyến đường:", err);
            setError("Không thể tải danh sách tuyến đường.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Hàm tải danh sách bến xe từ API
    const fetchStations = async () => {
        try {
            const res = await authApis().get(endpoints.busStations);
            setStations(res.data);
            console.log("✅ Dữ liệu bến xe:", res.data);
        } catch (err) {
            console.error("❌ Lỗi khi tải bến xe:", err);
            setError("Không thể tải danh sách bến xe.");
        }
    };

    useEffect(() => {
        fetchStations(); // ✅ Gọi hàm tải bến xe
        fetchRoutes(filterParams);
    }, []);

    // ✅ Hàm tiện ích để lấy tên bến xe từ ID
    const getStationName = (stationId) => {
        // Find the station object in the 'stations' state by its ID
        const station = stations.find(s => s.id === stationId);
        // Return the station's name if found, otherwise return a default value
        return station ? station.name : "Không xác định";
    };

    // ✅ Hàm xử lý thay đổi input của bộ lọc
    const handleParamChange = (e) => {
        const { name, value } = e.target;
        setFilterParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ✅ Hàm xử lý khi người dùng nhấn nút tìm kiếm
    const handleSearch = (e) => {
        e.preventDefault();
        fetchRoutes(filterParams);
    };

    // Hàm xử lý khi người dùng nhấn nút xóa
    const handleDeleteClick = (routeId) => {
        setRouteToDeleteId(routeId);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        setShowConfirmModal(false);
        if (!routeToDeleteId) return;

        try {
            await authApis().delete(`${endpoints.routes}/${routeToDeleteId}`);
            setAlertMessage("✅ Đã xóa tuyến đường thành công!");
            setShowAlertDialog(true);
            
            // Cập nhật state để loại bỏ tuyến đường đã xóa khỏi UI
            setRoutes((prev) => prev.filter((r) => r.id !== routeToDeleteId));
        } catch (err) {
            console.error("❌ Lỗi khi xóa tuyến:", err);
            const errorMessage = err.response?.data?.detail || err.response?.data || "Không thể xóa tuyến đường!";
            setAlertMessage(errorMessage);
            setShowAlertDialog(true);
        } finally {
            setRouteToDeleteId(null);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Quản lý tuyến đường</h1>

            {/* ✅ Form Bộ Lọc */}
            <Card className="mb-4 p-4 shadow-sm">
                <Card.Title className="mb-3">Bộ Lọc Tuyến Đường </Card.Title>
                <Form onSubmit={handleSearch}>
                    <Row className="g-3">
                        <Col md={6} lg={4}>
                            <Form.Group>
                                <Form.Label>Tên tuyến</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="routeName"
                                    placeholder="Nhập tên tuyến..."
                                    value={filterParams.routeName}
                                    onChange={handleParamChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={4}>
                            <Form.Group>
                                <Form.Label>Điểm đầu</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="origin"
                                    placeholder="Nhập điểm đầu..."
                                    value={filterParams.origin}
                                    onChange={handleParamChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={4}>
                            <Form.Group>
                                <Form.Label>Điểm cuối</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="destination"
                                    placeholder="Nhập điểm cuối..."
                                    value={filterParams.destination}
                                    onChange={handleParamChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Khoảng cách từ (km)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="distanceFrom"
                                    placeholder="Từ..."
                                    value={filterParams.distanceFrom}
                                    onChange={handleParamChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Khoảng cách đến (km)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="distanceTo"
                                    placeholder="Đến..."
                                    value={filterParams.distanceTo}
                                    onChange={handleParamChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Giá từ (VNĐ)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="priceFrom"
                                    placeholder="Từ..."
                                    value={filterParams.priceFrom}
                                    onChange={handleParamChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Giá đến (VNĐ)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="priceTo"
                                    placeholder="Đến..."
                                    value={filterParams.priceTo}
                                    onChange={handleParamChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group>
                                <Form.Label>Trạng thái</Form.Label>
                                <Form.Select
                                    name="isActive"
                                    value={filterParams.isActive}
                                    onChange={handleParamChange}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="true">Đang hoạt động</option>
                                    <option value="false">Không hoạt động</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs={12} className="text-end">
                            <Button variant="primary" type="submit">
                                Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Link to="/manager/routes/add">
                <Button className="mb-3">Thêm tuyến đường</Button>
            </Link>

            {error && <Alert variant="danger">{error}</Alert>}

            {loading ? (
                <div className="text-center my-4">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-2">Đang tải dữ liệu...</p>
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên tuyến</th>
                            <th>Điểm đầu</th>
                            <th>Điểm cuối</th>
                            <th>Bến đi</th> {/* ✅ Cột mới */}
                            <th>Bến đến</th> {/* ✅ Cột mới */}
                            <th>Số km</th>
                            <th>Thời gian dự kiến</th>
                            <th>Giá mỗi km</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.length > 0 ? (
                            routes.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.routeName}</td>
                                    <td>{r.origin}</td>
                                    <td>{r.destination}</td>
                                    <td>{getStationName(r.originStationId?.id)}</td> {/* ✅ Sử dụng hàm để hiển thị tên bến */}
                                    <td>{getStationName(r.destinationStationId?.id)}</td> {/* ✅ Sử dụng hàm để hiển thị tên bến */}
                                    <td>{r.distanceKm} km</td>
                                    <td>{r.estimatedTravelTime}</td>
                                    <td>{r.pricePerKm} VNĐ</td>
                                    <td>
                                        <Link to={`/manager/routes/edit/${r.id}`}>
                                            <Button variant="warning" size="sm" className="me-2">
                                                Sửa
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDeleteClick(r.id)}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center">Không tìm thấy tuyến đường nào.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            )}

            <ConfirmationModal
                show={showConfirmModal}
                handleClose={() => setShowConfirmModal(false)}
                handleConfirm={confirmDelete}
                message="Bạn có chắc chắn muốn xóa tuyến đường này không? Hành động này không thể hoàn tác."
            />
            <AlertDialog
                show={showAlertDialog}
                handleClose={() => setShowAlertDialog(false)}
                message={alertMessage}
            />
        </div>
    );
};

export default RouteManagement;
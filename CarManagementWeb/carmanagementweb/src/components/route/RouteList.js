import React, { useState, useEffect } from 'react';
import Apis from '../../configs/Apis.js';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap'; // Added Alert for error messages

function RouteList() {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await Apis.get('/routes');
                setRoutes(response.data);
            } catch (err) {
                console.error("Error fetching routes:", err);
                setError("Không thể tải danh sách tuyến đường. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoutes();
    }, []);

    const handleDeleteRoute = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa tuyến đường này không?")) {
            try {
                await Apis.delete(`/routes/${id}`);
                setRoutes(routes.filter(route => route.id !== id));
                alert("Đã xóa tuyến đường thành công!");
            } catch (err) {
                console.error("Error deleting route:", err);
                alert("Không thể xóa tuyến đường. Vui lòng thử lại.");
            }
        }
    };

    if (loading) {
        return <div className="text-center my-5">Đang tải danh sách tuyến đường...</div>;
    }

    if (error) {
        return <Alert variant="danger" className="my-3">{error}</Alert>;
    }

    return (
        <div className="route-list-container my-4">
            <h2 className="text-center mb-4">Danh sách Tuyến đường</h2>



            {routes.length === 0 ? (
                <Alert variant="info" className="text-center">Không có tuyến đường nào được tìm thấy.</Alert>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4"> {/* Responsive grid */}
                    {routes.map(route => (
                        <Col key={route.id}>
                            <Card className="h-100 shadow-sm"> {/* h-100 for equal height cards */}
                                <Card.Body>
                                    <Card.Title className="text-primary">{route.routeName}</Card.Title>
                                    <Card.Text>
                                        <strong>Điểm bắt đầu:</strong> {route.origin}<br />
                                        <strong>Điểm kết thúc:</strong> {route.destination}<br />
                                        <strong>Quãng đường:</strong> {route.distanceKm} km<br />
                                        <strong>Thời gian ước tính:</strong> {route.estimatedTravelTime}<br />
                                        <strong>Giá mỗi km:</strong> {route.pricePerKm.toLocaleString('vi-VN')} VNĐ<br />
                                        <strong>Trạng thái:</strong> <span className={route.isActive ? 'text-success' : 'text-danger'}>
                                            {route.isActive ? 'Hoạt động' : 'Không hoạt động'}
                                        </span>
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="d-flex justify-content-around">
                                    {/* View button */}
                                    <Button
                                        variant="info"
                                        size="sm"
                                        onClick={() => navigate(`/routes/${route.id}`)}
                                    >
                                        Xem Chi Tiết
                                    </Button>

                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}

export default RouteList;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Form, Spinner, Alert } from "react-bootstrap";

const EditRouteForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [route, setRoute] = useState(null);
    const [stations, setStations] = useState([]); // ✅ State để lưu danh sách bến xe
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitMessage, setSubmitMessage] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchRouteAndStations = async () => {
            try {
                // ✅ Tải danh sách bến xe trước
                const stationsRes = await authApis().get(endpoints.busStations);
                setStations(stationsRes.data);
                
                // Tải thông tin tuyến đường
                const routeRes = await authApis().get(`${endpoints.routes}/${id}`);
                setRoute(routeRes.data);
            } catch (err) {
                console.error("❌ Lỗi khi tải dữ liệu:", err);
                setError("Không thể tải dữ liệu tuyến đường hoặc bến xe.");
            } finally {
                setLoading(false);
            }
        };
        fetchRouteAndStations();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Xử lý riêng cho checkbox
        if (type === 'checkbox') {
            setRoute({ ...route, [name]: checked });
        } else {
            setRoute({ ...route, [name]: value });
        }
    };

    const handleStationChange = (e) => {
        const { name, value } = e.target;
        // Giá trị value là ID, cần chuyển đổi sang số nguyên
        const stationId = parseInt(value);
        setRoute({ 
            ...route, 
            [`${name}Id`]: { id: stationId } // ✅ Cập nhật state với ID bến xe
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitMessage({ type: '', message: '' });

        // Tạo payload chỉ với các ID bến xe, không gửi toàn bộ đối tượng
        const payload = {
            ...route,
            originStationId: route.originStationId.id,
            destinationStationId: route.destinationStationId.id,
        };

        try {
            await authApis().put(`${endpoints.routes}/${id}`, payload);
            setSubmitMessage({ type: 'success', message: '✅ Cập nhật tuyến đường thành công!' });
            setTimeout(() => {
                navigate("/manager/routes");
            }, 2000);
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật tuyến đường:", err);
            setSubmitMessage({ type: 'danger', message: '❌ Lỗi: Không thể cập nhật tuyến đường. Vui lòng thử lại.' });
        }
    };

    if (loading) {
        return <div className="text-center"><Spinner animation="border" /></div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center">Chỉnh sửa tuyến đường</h2>
            {submitMessage.message && <Alert variant={submitMessage.type}>{submitMessage.message}</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Tên tuyến</Form.Label>
                    <Form.Control
                        type="text"
                        name="routeName"
                        value={route.routeName || ''}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Điểm đầu</Form.Label>
                    <Form.Control
                        type="text"
                        name="origin"
                        value={route.origin || ''}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Điểm cuối</Form.Label>
                    <Form.Control
                        type="text"
                        name="destination"
                        value={route.destination || ''}
                        onChange={handleChange}
                    />
                </Form.Group>

                {/* ✅ Thêm trường Bến đi */}
                <Form.Group className="mb-3">
                    <Form.Label>Bến đi</Form.Label>
                    <Form.Select 
                        name="originStation" 
                        value={route.originStationId?.id || ''} 
                        onChange={handleStationChange}
                    >
                        <option value="">-- Chọn bến đi --</option>
                        {stations.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                {/* ✅ Thêm trường Bến đến */}
                <Form.Group className="mb-3">
                    <Form.Label>Bến đến</Form.Label>
                    <Form.Select 
                        name="destinationStation" 
                        value={route.destinationStationId?.id || ''} 
                        onChange={handleStationChange}
                    >
                        <option value="">-- Chọn bến đến --</option>
                        {stations.map(station => (
                            <option key={station.id} value={station.id}>
                                {station.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Khoảng cách (km)</Form.Label>
                    <Form.Control
                        type="number"
                        name="distanceKm"
                        value={route.distanceKm || ''}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Thời gian dự kiến</Form.Label>
                    <Form.Control
                        type="text"
                        name="estimatedTravelTime"
                        value={route.estimatedTravelTime || ''}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Giá/km</Form.Label>
                    <Form.Control
                        type="number"
                        name="pricePerKm"
                        value={route.pricePerKm || ''}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        label="Hoạt động"
                        name="isActive"
                        checked={route.isActive}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Button type="submit" variant="primary">Cập nhật</Button>
            </Form>
        </div>
    );
};

export default EditRouteForm;
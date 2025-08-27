import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Apis, { endpoints } from "../configs/Apis";

const Home = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useState({
        from: "",
        to: "",
        date: "",
    });
    // State mới để lưu danh sách các địa điểm có sẵn
    const [availableLocations, setAvailableLocations] = useState([]);

    // Hàm chung để tải các chuyến đi và trích xuất địa điểm
    const fetchTrips = async (params = {}) => {
        setLoading(true);
        try {
            const res = await Apis.get(endpoints.trips, {
                params: {
                    from: params.from,
                    to: params.to,
                    date: params.date,
                },
            });
            if (Array.isArray(res.data)) {
                setTrips(res.data);

                // Trích xuất các địa điểm duy nhất từ dữ liệu chuyến đi
                const locations = new Set();
                res.data.forEach(trip => {
                    // Cập nhật với tên thuộc tính chính xác của bạn nếu cần
                    locations.add(trip.from);
                    locations.add(trip.to);
                });
                setAvailableLocations(Array.from(locations).sort());

            } else {
                setTrips([]);
                setAvailableLocations([]);
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách chuyến đi:", err);
            setTrips([]);
            setAvailableLocations([]);
        } finally {
            setLoading(false);
        }
    };

    // Load danh sách chuyến đi mặc định khi component được mount
    useEffect(() => {
        fetchTrips();
    }, []);

    // Xử lý thay đổi trong form tìm kiếm
    const handleSearchChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    // Xử lý khi nhấn nút tìm kiếm
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchTrips(searchParams);
    };

    // Xử lý chuyển đổi điểm đi và điểm đến
    const handleSwapLocations = () => {
        setSearchParams(prevParams => ({
            ...prevParams,
            from: prevParams.to,
            to: prevParams.from,
        }));
    };

    // Hàm định dạng ngày giờ
    const formatDepartureTime = (departureTime) => {
        if (!departureTime) return { time: "N/A", date: "N/A" };
        const [year, month, day, hour, minute] = departureTime;
        const formattedDate = new Date(year, month - 1, day, hour, minute);
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return {
            time: formattedDate.toLocaleTimeString('vi-VN', timeOptions),
            date: formattedDate.toLocaleDateString('vi-VN', dateOptions)
        };
    };

    return (
        <div className="home-page">
            <style>
                {`
                    .home-page {
                        font-family: 'Quicksand', sans-serif;
                    }

                    .hero-section {
                        background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://res.cloudinary.com/dwynd11t6/image/upload/v1722867803/car_booking/d9171b3e401185f69a91_y0fdrd.jpg');
                        background-size: cover;
                        background-position: center;
                        height: 70vh;
                        min-height: 500px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        text-align: center;
                        position: relative;
                        padding: 2rem 0;
                    }

                    .hero-section::before {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.3); /* Dark overlay */
                        z-index: 1;
                    }

                    .hero-section .container {
                        position: relative;
                        z-index: 2;
                    }

                    .hero-title {
                        font-size: 3.5rem;
                        font-weight: 800;
                        margin-bottom: 1rem;
                        text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
                        animation: fadeInDown 1s ease-in-out;
                    }

                    .hero-subtitle {
                        font-size: 1.25rem;
                        font-weight: 500;
                        max-width: 700px;
                        margin: 0 auto 3rem;
                        animation: fadeInUp 1s ease-in-out;
                    }

                    .search-form-container {
                        background-color: rgba(255, 255, 255, 0.98);
                        padding: 30px;
                        border-radius: 16px;
                        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
                        transform: translateY(50px);
                        position: relative;
                        z-index: 3;
                        animation: slideUp 1s ease-out;
                    }

                    .search-label {
                        font-weight: 600;
                        color: #343a40;
                        font-size: 1.1rem;
                        margin-bottom: 0.5rem;
                    }

                    .search-button {
                        background-color: #e75702 !important;
                        border-color: #e75702 !important;
                        font-size: 1.5rem;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: all 0.3s ease;
                    }

                    .search-button:hover {
                        background-color: #d64c00 !important;
                        border-color: #d64c00 !important;
                        transform: scale(1.05);
                        box-shadow: 0 5px 15px rgba(231, 87, 2, 0.4);
                    }
                    
                    .swap-button {
                        background-color: transparent !important;
                        border: none !important;
                        color: #e75702;
                        font-size: 1.5rem;
                        padding: 0;
                        transition: transform 0.3s ease;
                    }
                    
                    .swap-button:hover {
                        transform: rotate(180deg);
                        color: #d64c00;
                    }

                    .main-content {
                        margin-top: 8rem;
                        padding-bottom: 4rem;
                    }

                    .section-title {
                        text-align: center;
                        margin-bottom: 3rem;
                        color: #e75702;
                        font-weight: 700;
                        font-size: 2.5rem;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }

                    .trip-card {
                        height: 100%;
                        border: none;
                        border-radius: 16px;
                        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
                        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                        overflow: hidden;
                    }

                    .trip-card:hover {
                        transform: translateY(-10px);
                        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
                    }
                    
                    .trip-card .card-body {
                        padding: 2rem;
                    }

                    .trip-card-title {
                        font-weight: 700;
                        color: #343a40;
                        font-size: 1.5rem;
                        margin-bottom: 1rem;
                    }

                    .trip-card-detail {
                        font-size: 1rem;
                        color: #555;
                        display: flex;
                        align-items: center;
                        margin-bottom: 0.75rem;
                    }

                    .trip-card-detail i {
                        color: #e75702;
                        width: 25px;
                    }

                    .trip-price {
                        font-weight: 800;
                        color: #28a745;
                        font-size: 1.8rem;
                    }

                    .book-button {
                        background-color: #e75702 !important;
                        border-color: #e75702 !important;
                        font-weight: 600;
                        padding: 0.75rem 1.5rem;
                        border-radius: 8px;
                        transition: background-color 0.3s ease;
                    }

                    .book-button:hover {
                        background-color: #d64c00 !important;
                        border-color: #d64c00 !important;
                    }

                    .message-text {
                        text-align: center;
                        color: #6c757d;
                        font-size: 1.2rem;
                        margin-top: 2rem;
                    }
                    
                    @keyframes fadeInDown {
                        from { opacity: 0; transform: translateY(-20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(80px); }
                        to { opacity: 1; transform: translateY(50px); }
                    }
                `}
            </style>

            {/* Phần Banner và Form tìm kiếm */}
            <div className="hero-section">
                <Container>
                    <h1 className="hero-title">Tìm kiếm chuyến đi hoàn hảo của bạn</h1>
                    <p className="hero-subtitle">
                        Khám phá và đặt vé xe khách một cách nhanh chóng và tiện lợi.
                    </p>
                    <div className="search-form-container">
                        <Form onSubmit={handleSearchSubmit}>
                            <Row className="g-3 align-items-end">
                                <Col md={4}>
                                    <Form.Group controlId="formFrom">
                                        <Form.Label className="search-label"><i className="fa-solid fa-location-dot me-2"></i>Điểm đi</Form.Label>
                                        <Form.Select 
                                            name="from" 
                                            onChange={handleSearchChange} 
                                            value={searchParams.from} 
                                            required
                                        >
                                            <option value="">Chọn điểm đi</option>
                                            {availableLocations.map((location, index) => (
                                                <option key={index} value={location}>{location}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md="auto" className="d-flex align-items-center justify-content-center">
                                    <Button variant="outline-secondary" className="mb-2 swap-button" onClick={handleSwapLocations}>
                                        <i className="fa-solid fa-arrows-up-down"></i>
                                    </Button>
                                </Col>
                                <Col md={4}>
                                    <Form.Group controlId="formTo">
                                        <Form.Label className="search-label"><i className="fa-solid fa-location-dot me-2"></i>Điểm đến</Form.Label>
                                        <Form.Select 
                                            name="to" 
                                            onChange={handleSearchChange} 
                                            value={searchParams.to} 
                                            required
                                        >
                                            <option value="">Chọn điểm đến</option>
                                            {availableLocations.map((location, index) => (
                                                <option key={index} value={location}>{location}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group controlId="formDate">
                                        <Form.Label className="search-label"><i className="fa-regular fa-calendar-alt me-2"></i>Ngày khởi hành</Form.Label>
                                        <Form.Control type="date" name="date" onChange={handleSearchChange} value={searchParams.date} required />
                                    </Form.Group>
                                </Col>
                                <Col md={1}>
                                    <Button variant="primary" type="submit" className="search-button">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Container>
            </div>

            {/* Phần danh sách chuyến đi */}
            <Container className="main-content">
                <h2 className="section-title">{searchParams.from || searchParams.to || searchParams.date ? "Kết quả tìm kiếm" : "Các Chuyến đi Sắp tới"}</h2>
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="warning" role="status" />
                        <p className="message-text mt-3">Đang tải danh sách chuyến đi...</p>
                    </div>
                ) : !trips.length ? (
                    <div className="text-center my-5">
                        <i className="fa-solid fa-bus-simple fa-4x text-muted mb-3"></i>
                        <p className="message-text text-danger">Không có chuyến đi nào phù hợp với tìm kiếm của bạn.</p>
                        <Button variant="outline-warning" onClick={() => fetchTrips()} className="mt-3">
                            <i className="fa-solid fa-arrow-rotate-left me-2"></i>
                            Xem tất cả chuyến đi
                        </Button>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {trips.map((trip) => {
                            const { time, date } = formatDepartureTime(trip.departureTime);
                            return (
                                <Col key={trip.id}>
                                    <Card className="trip-card">
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="trip-card-title text-center mb-3">
                                                <i className="fa-solid fa-map-location-dot me-2"></i>
                                                {trip.routeName}
                                            </Card.Title>
                                            <Card.Text className="flex-grow-1">
                                                <p className="trip-card-detail">
                                                    <i className="fa-regular fa-clock me-2"></i>
                                                    Thời gian: <strong>{time}</strong> | <strong>{date}</strong>
                                                </p>
                                                <p className="trip-card-detail">
                                                    <i className="fa-solid fa-car-side me-2"></i>
                                                    Biển số xe: <strong>{trip.busLicensePlate}</strong>
                                                </p>
                                                <p className="trip-card-detail">
                                                    <i className="fa-solid fa-user-tie me-2"></i>
                                                    Tài xế: <strong>{trip.driverName}</strong>
                                                </p>
                                                <p className="trip-card-detail">
                                                    <i className="fa-solid fa-chair me-2"></i>
                                                    Ghế trống: <strong>{trip.availableSeats}</strong>
                                                </p>
                                            </Card.Text>
                                            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                                                <div className="text-start">
                                                    <span className="trip-price">
                                                        {trip.fare?.toLocaleString('vi-VN')} VNĐ
                                                    </span>
                                                    <small className="text-muted d-block">mỗi vé</small>
                                                </div>
                                                <Link to={`/book/${trip.id}`} className="btn book-button">
                                                    Đặt vé ngay
                                                </Link>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Home;
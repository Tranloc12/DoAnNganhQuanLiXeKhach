import React, { useState, useEffect, useContext } from "react";
import { Container, Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Apis, { endpoints } from "../configs/Apis";
import { MyUserContext } from "../contexts/Contexts";
import busLogo1 from '../components/images/icons/xekhach.jpg';
import busLogo2 from '../components/images/icons/xekhach2.jpg';
import busLogo3 from '../components/images/icons/xekhach3.jpg';
import busLogo4 from '../components/images/icons/xekhach4.jpg';
import './Home.css';

const Home = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);  // ✅ thêm state review
    const [loadingReviews, setLoadingReviews] = useState(true); // ✅ loading review

    const [searchParams, setSearchParams] = useState({
        from: "",
        to: "",
        date: "",
        routeId: "",
        busId: "",
        driverId: "",
        status: "",
    });
    // Đã xóa state không dùng đến: availableLocations, availableRoutes, availableBuses, availableDrivers
    const [isSearching, setIsSearching] = useState(false);
    const busLogos = [busLogo1, busLogo2, busLogo3, busLogo4];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const currentUser = useContext(MyUserContext);
    const styles = {
        inputField: {
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #ced4da',
            fontSize: '1em',
            color: '#495057',
            transition: 'all 0.3s ease',
        },
    };

    // Hàm định dạng ngày giờ, không cần thay đổi
    const formatDateTime = (arr) => {
        if (!arr) return "";
        const [year, month, day, hour, minute] = arr;
        const date = new Date(year, month - 1, day, hour, minute);
        return date.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };


    useEffect(() => {
        fetchFeaturedTrips();
        fetchReviews(); // ✅ gọi luôn khi load trang
    }, []);

    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            const res = await Apis.get(endpoints.reviews);
            if (Array.isArray(res.data)) {
                setReviews(res.data);
            } else {
                setReviews([]);
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách đánh giá:", err);
            setReviews([]);
        } finally {
            setLoadingReviews(false);
        }
    };

    // Hàm này sẽ fetch chuyến đi dựa trên tham số tìm kiếm
    const padTo2Digits = (num) => {
        return num.toString().padStart(2, '0');
    };


    const fetchTrips = async (params = {}) => {
        setLoading(true);
        setIsSearching(true);
        try {
            let departureTime = undefined;
            if (params.date) {
                // Tách các thành phần của ngày
                const [year, month, day] = params.date.split('-');
                // Định dạng lại chuỗi ngày tháng với zero-padding
                departureTime = `${year}-${padTo2Digits(month)}-${padTo2Digits(day)}T00:00:00`;
            }

            // Chỉnh sửa tại đây: Loại bỏ khoảng trắng thừa từ đầu và cuối chuỗi
            const cleanOrigin = params.from.trim() || undefined;
            const cleanDestination = params.to.trim() || undefined;

            const res = await Apis.get(endpoints.trips, {
                params: {
                    origin: cleanOrigin,
                    destination: cleanDestination,
                    departureTime: departureTime,
                    routeId: params.routeId || undefined,
                    busId: params.busId || undefined,
                    driverId: params.driverId || undefined,
                    status: params.status || undefined,
                },
            });

            if (Array.isArray(res.data)) {
                setTrips(res.data);
            } else {
                setTrips([]);
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách chuyến đi:", err);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };

    // Hàm này sẽ fetch các chuyến đi nổi bật
    const fetchFeaturedTrips = async () => {
        setLoading(true);
        setIsSearching(false);
        try {
            const res = await Apis.get(endpoints.trips);
            if (Array.isArray(res.data)) {
                // Chỉ lấy 6 chuyến đầu tiên để hiển thị nổi bật
                const featured = res.data.slice(0, 6);
                setTrips(featured);
            } else {
                setTrips([]);
            }
        } catch (err) {
            console.error("Lỗi khi tải danh sách chuyến đi nổi bật:", err);
            setTrips([]);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchFeaturedTrips();
    }, []);

    // Hiệu ứng chuyển đổi ảnh nền
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % busLogos.length);
        }, 3000);
        return () => clearInterval(intervalId);
    }, [busLogos.length]);

    const handleSearchChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchTrips(searchParams);
    };

    const handleSwapLocations = () => {
        setSearchParams(prevParams => ({
            ...prevParams,
            from: prevParams.to,
            to: prevParams.from,
        }));
    };

    const formatTimeArray = (timeArray) => {
        if (!timeArray) return { time: "N/A", date: "N/A" };
        const [year, month, day, hour, minute] = timeArray;
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
            <div className="hero-section">
                <div
                    className="hero-slider"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                    {busLogos.map((logo, index) => (
                        <div
                            key={index}
                            className="hero-slide"
                            style={{ backgroundImage: `url(${logo})` }}
                        ></div>
                    ))}
                </div>
                <div className="hero-content">
                    <h1 className="hero-title">Tìm kiếm chuyến đi hoàn hảo của bạn</h1>
                    <p className="hero-subtitle">
                        Khám phá và đặt vé xe khách một cách nhanh chóng và tiện lợi.
                    </p>
                </div>
            </div>

            <div className="search-form-wrapper">
                <Container>
                    <div className="search-form-wrapper">
                        <Container>
                            <div className="search-form-container" style={{ padding: '30px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                                <Form onSubmit={handleSearchSubmit}>
                                    <Row className="g-3 align-items-end">
                                        {/* Điểm đi */}
                                        <Col md={3}>
                                            <Form.Group controlId="formFrom">
                                                <Form.Label>Điểm đi</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="from"
                                                    value={searchParams.from}
                                                    onChange={handleSearchChange}
                                                    placeholder="Nhập điểm đi"
                                                    style={styles.inputField}
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* Swap */}
                                        <Col md="auto" className="d-flex align-items-center justify-content-center">
                                            <Button variant="outline-secondary" className="mb-2" onClick={handleSwapLocations}>
                                                <i className="fa-solid fa-arrows-up-down"></i>
                                            </Button>
                                        </Col>

                                        {/* Điểm đến */}
                                        <Col md={3}>
                                            <Form.Group controlId="formTo">
                                                <Form.Label>Điểm đến</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="to"
                                                    value={searchParams.to}
                                                    onChange={handleSearchChange}
                                                    placeholder="Nhập điểm đến"
                                                    style={styles.inputField}
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* Ngày khởi hành */}
                                        <Col md={3}>
                                            <Form.Group controlId="formDate">
                                                <Form.Label>Ngày khởi hành</Form.Label>
                                                <Form.Control
                                                    type="date"
                                                    name="date"
                                                    value={searchParams.date}
                                                    onChange={handleSearchChange}
                                                    style={styles.inputField}
                                                />
                                            </Form.Group>
                                        </Col>

                                        {/* Nút tìm kiếm */}
                                        <Col md={2}>
                                            <Button variant="primary" type="submit" style={{ width: '100%', marginTop: '24px' }}>
                                                <i className="fa-solid fa-magnifying-glass"></i> Tìm
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Container>
                    </div>
                </Container>
            </div>

            {/* Trips list */}
            <Container className="main-content">
                <h2 className="section-title">
                    {isSearching ? "Kết quả tìm kiếm" : "Các Chuyến đi Tiêu biểu"}
                </h2>
                {loading ? (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="warning" role="status" />
                        <p className="message-text mt-3">Đang tải danh sách chuyến đi...</p>
                    </div>
                ) : !trips.length ? (
                    <div className="text-center my-5">
                        <i className="fa-solid fa-bus-simple fa-4x text-muted mb-3"></i>
                        <p className="message-text text-danger">Không có chuyến đi nào phù hợp với tìm kiếm của bạn.</p>
                        <Button variant="outline-warning" onClick={fetchFeaturedTrips} className="mt-3 book-button">
                            <i className="fa-solid fa-arrow-rotate-left me-2"></i>
                            Xem các chuyến đi tiêu biểu
                        </Button>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {trips.map(trip => {
                            // định nghĩa các biến trong scope của map
                            const departure = formatTimeArray(trip.departureTime);
                            const arrival = formatTimeArray(trip.arrivalTime);
                            return (
                                <Col key={trip.id}>
                                    <Card className="trip-card">
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="trip-card-title text-center mb-3">
                                                <i className="fa-solid fa-map-location-dot me-2"></i>
                                                {trip.origin} → {trip.destination}
                                            </Card.Title>
                                            <Card.Text className="flex-grow-1 mt-3">
                                                <p className="trip-card-detail">
                                                    <i className="fa-regular fa-clock me-2"></i>
                                                    Khởi hành: <strong>{departure.time}</strong> | <strong>{departure.date}</strong>
                                                </p>
                                                <p className="trip-card-detail">
                                                    <i className="fa-regular fa-clock me-2"></i>
                                                    Thời gian đến: <strong>{arrival.time}</strong> | <strong>{arrival.date}</strong>
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

                                                <p className="trip-card-detail">
                                                    <i className="fa-solid fa-chair me-2"></i>
                                                    Bến xuất phát: <strong>{trip.originStationName}</strong>
                                                </p>
                                                <p className="trip-card-detail">
                                                    <i className="fa-solid fa-chair me-2"></i>
                                                    Bến đến: <strong>{trip.destinationStationName}</strong>
                                                </p>


                                            </Card.Text>
                                            <div className="d-flex justify-content-center mt-3 pt-3 border-top">
                                                <div className="text-start">
                                                    <span className="trip-price">
                                                        {trip.fare?.toLocaleString('vi-VN')} VNĐ
                                                    </span>
                                                    <small className="text-muted d-block">mỗi vé</small>
                                                </div>
                                                <Link to={`/book/${trip.id}`} className="btn book-button ms-3">
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
            <Container className="main-content">
                <Card className="reviews-card mt-5 shadow-lg rounded-4">
                    <Card.Body>
                        <Card.Title className="reviews-card-title text-center mb-4 fs-3 fw-bold text-primary">
                            <i className="fa-solid fa-star me-2 text-warning"></i>
                            Đánh giá của Khách hàng
                        </Card.Title>

                        {loadingReviews ? (
                            <div className="text-center my-4">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2">Đang tải đánh giá...</p>
                            </div>
                        ) : reviews.length === 0 ? (
                            <p className="text-center text-muted">Chưa có đánh giá nào.</p>
                        ) : (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {reviews.map((r) => {
                                    // Chuyển mảng [year, month, day, hour, minute, second] thành Date
                                    const createdAt = new Date(
                                        r.createdAt[0],
                                        r.createdAt[1] - 1,
                                        r.createdAt[2],
                                        r.createdAt[3] || 0,
                                        r.createdAt[4] || 0,
                                        r.createdAt[5] || 0
                                    );

                                    return (
                                        <Col key={r.id}>
                                            <Card className="h-100 shadow-sm border-0 rounded-3  border-start border-4 border-primary ps-3">
                                                <Card.Body>
                                                    <div className="d-flex align-items-center mb-3">
                                                        {/* Avatar nếu có, nếu không thì lấy chữ cái đầu */}
                                                        {r.userId?.avatar ? (
                                                            <img
                                                                src={r.userId.avatar}
                                                                alt={r.userId.username}
                                                                className="rounded-circle me-3"
                                                                style={{ width: 45, height: 45, objectFit: "cover" }}
                                                            />
                                                        ) : (
                                                            <div className="avatar-circle me-3">
                                                                {r.userId?.username?.charAt(0).toUpperCase() || "?"}
                                                            </div>
                                                        )}

                                                        <div>
                                                            <strong>{r.userId?.username || "Người dùng ẩn danh"}</strong>
                                                            <div className="text-warning">
                                                                {Array.from({ length: 5 }, (_, i) => (
                                                                    <i
                                                                        key={i}
                                                                        className={
                                                                            i < r.rating ? "fa-solid fa-star" : "fa-regular fa-star"
                                                                        }
                                                                    ></i>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Card.Text className="fst-italic">
                                                        “{r.comment || "Không có nội dung"}”
                                                    </Card.Text>

                                                    <small className="text-muted d-block mt-2">
                                                        {createdAt.toLocaleDateString("vi-VN")}
                                                    </small>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        )}
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};
export default Home;
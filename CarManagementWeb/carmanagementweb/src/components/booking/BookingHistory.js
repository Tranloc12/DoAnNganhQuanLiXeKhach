// src/components/booking/BookingHistory.js
import React, { useEffect, useState, useContext } from "react";
import { Container, Table, Spinner, Alert, Card, Badge, Form, Row, Col, Button } from "react-bootstrap";
import MyAxios, { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../contexts/Contexts";
import moment from "moment";

// Định dạng ngày từ mảng [year, month, day, hour, minute]
const formatArrayDate = (dateArray) => {
    if (!dateArray || dateArray.length < 5) return 'N/A';
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return moment(date).format('HH:mm DD-MM-YYYY');
};

const BookingHistory = () => {
    const [bookings, setBookings] = useState([]);
    const [originalBookings, setOriginalBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useContext(MyUserContext);

    // State cho bộ lọc
    const [filterRoute, setFilterRoute] = useState('');
    const [filterTripStatus, setFilterTripStatus] = useState('');
    const [filterPaymentStatus, setFilterPaymentStatus] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            if (!user) {
                setError("Bạn cần đăng nhập để xem lịch sử mua vé.");
                setLoading(false);
                return;
            }
            try {
                const res = await authApis().get(endpoints.myBookings);
                setOriginalBookings(res.data);
                setBookings(res.data);
            } catch (err) {
                console.error("Lỗi khi tải lịch sử mua vé:", err);
                setError("Không thể tải lịch sử mua vé. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    // Hàm xử lý lọc dữ liệu
    const handleFilter = () => {
        let filteredBookings = originalBookings;

        if (filterRoute) {
            filteredBookings = filteredBookings.filter(b => 
                b.tripId?.routeId?.routeName?.toLowerCase().includes(filterRoute.toLowerCase())
            );
        }

        if (filterTripStatus) {
            filteredBookings = filteredBookings.filter(b => 
                b.tripId?.status === filterTripStatus
            );
        }

        if (filterPaymentStatus) {
            filteredBookings = filteredBookings.filter(b => 
                b.paymentStatus?.toLowerCase() === filterPaymentStatus.toLowerCase()
            );
        }

        setBookings(filteredBookings);
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Đang tải lịch sử mua vé...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="my-5">
                <Alert variant="danger" className="text-center">{error}</Alert>
            </Container>
        );
    }
    
    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Lịch sử mua vé</h2>
            
            {/* Bộ lọc tìm kiếm */}
            <Card className="p-4 mb-4 shadow-sm border-0">
                <h4 className="mb-3">Bộ lọc</h4>
                <Form>
                    <Row className="g-3">
                        <Col md={4}>
                            <Form.Group controlId="filterRoute">
                                <Form.Label>Tuyến đường</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Tìm theo tên tuyến đường..."
                                    value={filterRoute}
                                    onChange={(e) => setFilterRoute(e.target.value)}
                                />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group controlId="filterTripStatus">
                                <Form.Label>Trạng thái chuyến đi</Form.Label>
                                <Form.Select
                                    value={filterTripStatus}
                                    onChange={(e) => setFilterTripStatus(e.target.value)}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="Scheduled">Đã xác nhận</option>
                                    <option value="Completed">Đã hoàn thành</option>
                                    <option value="Cancelled">Đã hủy</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group controlId="filterPaymentStatus">
                                <Form.Label>Trạng thái thanh toán</Form.Label>
                                <Form.Select
                                    value={filterPaymentStatus}
                                    onChange={(e) => setFilterPaymentStatus(e.target.value)}
                                >
                                    <option value="">Tất cả</option>
                                    <option value="paid">Đã thanh toán</option>
                                    <option value="pending">Chưa thanh toán</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                            <Button variant="primary" onClick={handleFilter} className="w-100">
                                Lọc
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Card>

            {bookings.length === 0 ? (
                <Alert variant="info" className="text-center">Không có vé nào phù hợp với bộ lọc.</Alert>
            ) : (
                <Card className="p-4 shadow-sm border-0">
                    <div className="table-responsive">
                        <Table bordered hover className="booking-history-table">
                            <thead className="thead-light">
                                <tr>
                                    <th>Mã đặt vé</th>
                                    <th>Số ghế</th>
                                    <th>Tuyến đường</th>
                                    <th>Ngày đi</th>
                                    <th>Số tiền</th>
                                    <th>Thanh toán</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.id}>
                                        <td>{booking.id}</td>
                                        <td>{booking.seatNumbers || 'N/A'}</td>
                                        <td>{booking.tripId?.routeId?.routeName || 'N/A'}</td>
                                        <td>{formatArrayDate(booking.tripId?.departureTime)}</td>
                                        <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount)}</td>
                                        <td>
                                            <Badge bg={booking.paymentStatus?.toLowerCase() === 'paid' ? 'success' : 'warning'}>
                                                {booking.paymentStatus?.toLowerCase() === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge bg={booking.tripId?.status === 'Scheduled' ? 'primary' : 'secondary'}>
                                                {booking.tripId?.status === 'Scheduled' ? 'Đã xác nhận' : 'Khác'}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            )}
        </Container>
    );
};

export default BookingHistory;
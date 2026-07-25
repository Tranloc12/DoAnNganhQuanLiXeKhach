// src/components/booking/BookingHistory.js
import React, { useEffect, useState, useContext } from "react";
import { Container, Table, Spinner, Alert, Card, Badge, Form, Row, Col, Button, Modal } from "react-bootstrap";
import QRCode from "react-qr-code";
import MyAxios, { authApis, endpoints } from "../../configs/Apis";
import { MyUserContext } from "../../contexts/Contexts";
import moment from "moment";
import html2pdf from "html2pdf.js";

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

    // Modal state for QR code
    const [showQR, setShowQR] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const handleShowQR = (booking) => {
        setSelectedTicket(booking);
        setShowQR(true);
    };

    const handleCloseQR = () => {
        setShowQR(false);
        setSelectedTicket(null);
    };

    const handleDownloadPDF = () => {
        const element = document.getElementById("ticket-content");
        const opt = {
            margin:       10,
            filename:     `VeDienTu_${selectedTicket?.id}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2 },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

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
                                    <th>Hành động</th>
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
                                        <td>
                                            <Button variant="outline-warning" size="sm" onClick={() => handleShowQR(booking)}>
                                                <i className="fa-solid fa-qrcode me-1"></i> Xem vé
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card>
            )}

            {/* Modal hiển thị Vé điện tử (QR Code) */}
            <Modal show={showQR} onHide={handleCloseQR} centered>
                <Modal.Header closeButton style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <Modal.Title style={{ color: '#1a1410', fontWeight: 700 }}>
                        <i className="fa-solid fa-ticket me-2" style={{ color: '#e8832a' }}></i>
                        Vé Điện Tử
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center p-4">
                    {selectedTicket && (
                        <div id="ticket-content" style={{ padding: '20px', background: '#fff', borderRadius: '12px' }}>
                            <div style={{ background: '#fff', padding: '16px', display: 'inline-block', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
                                <QRCode 
                                    value={`TICKET:${selectedTicket.id}|ROUTE:${selectedTicket.tripId?.routeId?.routeName}|SEAT:${selectedTicket.seatNumbers}|DATE:${formatArrayDate(selectedTicket.tripId?.departureTime)}`} 
                                    size={200}
                                    fgColor="#1a1410"
                                />
                            </div>
                            <h5 style={{ fontWeight: 700, color: '#1a1410' }}>Mã vé: #{selectedTicket.id}</h5>
                            <p style={{ color: '#5c4f3a', marginBottom: '8px' }}>
                                <strong>Tuyến:</strong> {selectedTicket.tripId?.routeId?.routeName}
                            </p>
                            <p style={{ color: '#5c4f3a', marginBottom: '8px' }}>
                                <strong>Ghế:</strong> {selectedTicket.seatNumbers}
                            </p>
                            <p style={{ color: '#5c4f3a', marginBottom: '0' }}>
                                <strong>Khởi hành:</strong> {formatArrayDate(selectedTicket.tripId?.departureTime)}
                            </p>
                            <div style={{ marginTop: '20px', borderTop: '1px dashed #ccc', paddingTop: '10px', fontSize: '0.8rem', color: '#9c8c78' }}>
                                Cảm ơn quý khách đã sử dụng dịch vụ của XeKhách. Vui lòng xuất trình mã QR này khi lên xe.
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ borderTop: 'none', justifyContent: 'center', gap: '10px' }}>
                    <Button variant="outline-secondary" onClick={() => window.print()}>
                        <i className="fa-solid fa-print me-1"></i> In vé
                    </Button>
                    <Button variant="primary" onClick={handleDownloadPDF} style={{ background: 'linear-gradient(135deg, #e8832a, #f09a40)', border: 'none' }}>
                        <i className="fa-solid fa-file-pdf me-1"></i> Tải file PDF
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default BookingHistory;
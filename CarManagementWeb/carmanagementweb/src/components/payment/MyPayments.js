import React, { useEffect, useState, useContext } from "react";
import { Container, Spinner, Alert, Card, Badge, Row, Col, Modal, Button } from "react-bootstrap";
import moment from "moment";
import { MyUserContext } from "../../contexts/Contexts";
import { authApis, endpoints } from "../../configs/Apis";

// Utility function to format date from an array [year, month, day, hour, minute, second]
const formatArrayDate = (dateArray) => {
    if (!dateArray || dateArray.length < 5) return 'N/A';
    const [year, month, day, hour, minute] = dateArray;
    // Note: month - 1 because JavaScript months are 0-indexed
    const date = new Date(year, month - 1, day, hour, minute);
    return moment(date).format('HH:mm DD/MM/YYYY');
};

const AlertDialog = ({ show, handleClose, message }) => (
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handleClose}>Đóng</Button>
        </Modal.Footer>
    </Modal>
);

const PaymentItem = ({ payment }) => (
    <Card className="mb-4" style={{
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e0e0e0',
        transition: 'transform 0.3s ease-in-out',
        backgroundColor: '#fff',
        // Hover effect to make it feel more interactive
        transform: 'scale(1.00)'
    }}>
        <Card.Body className="p-4">
            <Row className="align-items-center mb-3">
                <Col xs={12} md={8}>
                    <Card.Title className="mb-0 fs-5 fw-bold" style={{ color: '#34495e' }}>
                        Thanh toán <span style={{ color: '#2980b9' }}>#{payment.id}</span>
                    </Card.Title>
                    <small style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
                        Ngày thanh toán: {formatArrayDate(payment.paymentDate)}
                    </small>
                </Col>
                <Col xs={12} md={4} className="text-md-end mt-2 mt-md-0">
                    <Badge
                        bg={payment.status === 'paid' ? 'success' : 'danger'}
                        className="p-2 px-3 rounded-pill shadow-sm"
                        style={{ fontSize: '0.85rem' }}
                    >
                        {payment.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </Badge>
                </Col>
            </Row>
            
            <hr style={{ borderTop: '1px solid #ecf0f1', margin: '1.5rem 0' }} />

            <Row className="mb-3" style={{ color: '#34495e' }}>
                <Col xs={12} md={6}>
                    <Card.Subtitle className="mb-2">
                        <strong>Tuyến:</strong> {payment.bookingId?.tripId?.routeId?.routeName || 'N/A'}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-2">
                        <strong>Tổng tiền:</strong> <span style={{ color: '#e74c3c', fontWeight: 'bold' }}>{payment.amount?.toLocaleString('vi-VN')} VNĐ</span>
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-0">
                        <strong>Số ghế:</strong> {payment.bookingId?.seatNumbers || 'N/A'}
                    </Card.Subtitle>
                </Col>
                <Col xs={12} md={6}>
                    <Card.Subtitle className="mb-2">
                        <strong>Hình thức:</strong> {payment.method || 'N/A'}
                    </Card.Subtitle>
                    <Card.Subtitle className="mb-0">
                        <strong>Khởi hành:</strong> {formatArrayDate(payment.bookingId?.tripId?.departureTime)}
                    </Card.Subtitle>
                </Col>
            </Row>

            {payment.receiptUrl && (
                <div className="text-end mt-3">
                    <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            style={{
                                borderRadius: '20px',
                                border: '1px solid #bdc3c7',
                                color: '#7f8c8d',
                                transition: 'all 0.3s'
                            }}
                            onMouseOver={e => e.currentTarget.style.cssText = 'border: 1px solid #34495e; color: #34495e;'}
                            onMouseOut={e => e.currentTarget.style.cssText = 'border: 1px solid #bdc3c7; color: #7f8c8d;'}
                        >
                            Xem hóa đơn
                        </Button>
                    </a>
                </div>
            )}
        </Card.Body>
    </Card>
);

const MyPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const user = useContext(MyUserContext);

    useEffect(() => {
        const fetchMyPayments = async () => {
            if (!user) {
                setError("Bạn cần đăng nhập để xem lịch sử thanh toán.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const res = await authApis().get(endpoints.myPayments);
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setPayments(res.data);
                } else {
                    setPayments([]);
                    setError("Bạn chưa có lịch sử thanh toán nào.");
                }
            } catch (err) {
                console.error("Lỗi khi tải lịch sử thanh toán:", err);
                const errorMessage = err.response?.data?.detail || "Không thể tải lịch sử thanh toán. Vui lòng thử lại sau.";
                setAlertMessage(errorMessage);
                setShowAlertDialog(true);
                setError("Không thể tải lịch sử thanh toán.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyPayments();
    }, [user]);

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-3">Đang tải lịch sử thanh toán của bạn...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-5">
                <Alert variant="info">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5 mb-5">
            <h3 className="mb-4 text-center fw-bold" style={{ color: '#2c3e50' }}>Lịch sử thanh toán</h3>
            {payments.length > 0 ? (
                payments.map((payment) => (
                    <PaymentItem key={payment.id} payment={payment} />
                ))
            ) : (
                <Alert variant="info" className="text-center my-4">
                    Bạn chưa có lịch sử thanh toán nào.
                </Alert>
            )}

            <AlertDialog
                show={showAlertDialog}
                handleClose={() => setShowAlertDialog(false)}
                message={alertMessage}
            />
        </Container>
    );
};

export default MyPayments;
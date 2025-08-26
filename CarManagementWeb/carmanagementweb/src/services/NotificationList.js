import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Badge, Row, Col } from 'react-bootstrap'; // Đã thêm Row, Col
import moment from 'moment'; // Đảm bảo bạn đã cài đặt moment.js (npm install moment)

const NotificationList = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const loadNotifications = () => {
            const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
            setNotifications(storedNotifications);
        };

        loadNotifications();

        const handleStorageChange = (e) => {
            if (e.key === 'notifications' || e.key === null) {
                loadNotifications();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const markAsRead = (id) => {
        const updatedNotifications = notifications.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
        );
        setNotifications(updatedNotifications);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        window.dispatchEvent(new Event("storage"));
    };

    return (
        <Container className="my-5">
            <h2 className="text-center fw-bold mb-4 text-primary">🔔 Thông báo của bạn</h2>
            {notifications.length === 0 ? (
                <Card className="text-center p-4 shadow-sm">
                    <Card.Body>
                        <Card.Text className="text-muted">Bạn không có thông báo nào vào lúc này. Hãy kiểm tra lại sau nhé!</Card.Text>
                    </Card.Body>
                </Card>
            ) : (
                <ListGroup className="shadow-sm">
                    {notifications.map((notif) => (
                        <ListGroup.Item 
                            key={notif.id} 
                            action
                            onClick={() => !notif.read && markAsRead(notif.id)}
                            className={`d-flex flex-column align-items-start ${notif.read ? 'bg-light text-muted' : ''}`}
                            style={{ 
                                borderLeft: notif.read ? '5px solid #e9ecef' : '5px solid #007bff',
                                marginBottom: '8px', 
                                borderRadius: '8px'
                            }}
                        >
                            <div className="d-flex w-100 justify-content-between align-items-center mb-1">
                                <h5 className="mb-0 fw-bold" style={{ color: notif.read ? '#6c757d' : '#343a40' }}>
                                    {notif.title}
                                </h5>
                                {!notif.read && (
                                    <Badge bg="primary" className="ms-auto">Mới</Badge>
                                )}
                            </div>
                            <p className="mb-1">{notif.body}</p>

                            {/* ✨ HIỂN THỊ THÔNG TIN CHI TIẾT CHUYẾN ĐI ✨ */}
                            {notif.tripDetails && (
                                <Card className="w-100 mt-2 p-3 bg-white border shadow-sm">
                                    <Card.Title className="h6 text-primary mb-2">Chi tiết chuyến đi:</Card.Title>
                                    <Row className="mb-1">
                                        <Col xs={12} md={6}><strong>Tuyến đường:</strong> {notif.tripDetails.routeName}</Col>
                                        <Col xs={12} md={6}><strong>Biển số xe:</strong> {notif.tripDetails.busLicensePlate}</Col>
                                    </Row>
                                    <Row className="mb-1">
                                        <Col xs={12} md={6}><strong>Tài xế:</strong> {notif.tripDetails.driverName}</Col>
                                        <Col xs={12} md={6}><strong>Giá vé:</strong> {notif.tripDetails.fare ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(notif.tripDetails.fare) : 'N/A'}</Col>
                                    </Row>
                                    <Row>
                                        <Col xs={12} md={6}><strong>Khởi hành:</strong> {moment(notif.tripDetails.departureTime).format('HH:mm DD/MM/YYYY')}</Col>
                                        <Col xs={12} md={6}><strong>Dự kiến đến:</strong> {moment(notif.tripDetails.arrivalTime).format('HH:mm DD/MM/YYYY')}</Col>
                                    </Row>
                                </Card>
                            )}
                            {/* ✨ KẾT THÚC HIỂN THỊ CHI TIẾT ✨ */}

                            <small className="text-muted mt-2 w-100 text-end">
                                {moment(notif.timestamp).fromNow()} {/* Hiển thị thời gian thân thiện (ví dụ: 5 phút trước) */}
                                ({moment(notif.timestamp).format('HH:mm DD/MM/YYYY')}) {/* Thời gian chi tiết */}
                            </small>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </Container>
    );
};

export default NotificationList;

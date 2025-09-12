/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
// src/components/manager/ReviewManagement.js
import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert, ListGroup, Card, Badge, Button, Row, Col, Modal, Form } from "react-bootstrap";
import moment from "moment";
import { Link } from "react-router-dom";
import MyAxios, { endpoints, authApis } from "../../configs/Apis";
import { ROLES } from "../../utils/roleUtils";
import { MyUserContext } from "../../contexts/Contexts";
import { useContext } from "react";

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

// Component hiển thị một review
const ReviewItem = ({ review, onDelete }) => (
    <Card className="mb-4 shadow-sm border-0 rounded-3">
        <Card.Body className="p-4">
            <Row className="align-items-center mb-3">
                <Col xs={12} md={8}>
                    <Card.Title className="mb-0 text-primary fs-5 fw-bold">
                        {review.userId?.username || 'Người dùng ẩn danh'}
                    </Card.Title>
                    <small className="text-muted">
                        Đánh giá vào: {moment(new Date(...review.createdAt)).format('HH:mm DD/MM/YYYY')}
                    </small>
                </Col>
                <Col xs={12} md={4} className="text-md-end mt-2 mt-md-0">
                    <Badge bg="warning" text="dark" className="p-2 px-3 fs-5 rounded-pill shadow-sm">
                        {Array(review.rating).fill('⭐').join('')}
                    </Badge>
                </Col>
            </Row>

            <hr className="my-3" />

            <Row className="mb-3 text-muted">
                <Col xs={12} md={6}>
                    <Card.Subtitle className="mb-1">
                        <strong>Tuyến:</strong> {review.tripId?.routeId?.routeName || 'N/A'}
                    </Card.Subtitle>
                </Col>
                <Col xs={12} md={6}>
                    <Card.Subtitle className="mb-0">
                        <strong>Khởi hành:</strong> {moment(new Date(...review.tripId.departureTime)).format('HH:mm DD/MM/YYYY')}
                    </Card.Subtitle>
                </Col>
            </Row>

            <Card.Text className="lead text-dark mt-3">{review.comment}</Card.Text>

            <div className="text-end mt-3 d-flex justify-content-end gap-2">
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(review.id)}>
                    Xóa
                </Button>
            </div>
        </Card.Body>
    </Card>
);

// Component chính
const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [reviewToDeleteId, setReviewToDeleteId] = useState(null);
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const currentUser = useContext(MyUserContext);

    // ✅ State mới cho các tham số lọc
    const [filterParams, setFilterParams] = useState({
        keyword: "",
        rating: "",
        startDate: "",
        endDate: "",
    });

    // ✅ Hàm fetch API chung
    const fetchReviews = async () => {
        setLoading(true);
        setError(null);
        try {
            // Xây dựng chuỗi truy vấn dựa trên filterParams
            const params = new URLSearchParams();
            for (const key in filterParams) {
                if (filterParams[key]) {
                    params.append(key, filterParams[key]);
                }
            }

            const res = await authApis().get(`${endpoints.reviews}?${params.toString()}`);
            
            if (Array.isArray(res.data)) {
                setReviews(res.data);
            } else {
                setReviews([]);
                setError("Không có đánh giá nào trên hệ thống.");
            }
        } catch (err) {
            console.error("Lỗi khi tải đánh giá:", err);
            setError("Không thể tải đánh giá. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };
    
    // ✅ Hàm xử lý khi người dùng thay đổi input
    const handleParamChange = (event) => {
        const { name, value } = event.target;
        setFilterParams(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // ✅ Hàm xử lý khi người dùng nhấn nút Tìm kiếm
    const handleSearch = (event) => {
        event.preventDefault();
        fetchReviews();
    };

    // Chạy fetchReviews lần đầu khi component mount
    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDeleteClick = (reviewId) => {
        setReviewToDeleteId(reviewId);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        setShowConfirmModal(false);
        if (!reviewToDeleteId) return;

        try {
            await authApis().delete(endpoints.deleteReview(reviewToDeleteId));
            setAlertMessage("✅ Đã xóa đánh giá thành công!");
            setShowAlertDialog(true);
            setReviews((prev) => prev.filter((r) => r.id !== reviewToDeleteId));
        } catch (err) {
            console.error("❌ Lỗi khi xóa đánh giá:", err);
            const errorMessage = err.response?.data?.error || "Không thể xóa đánh giá! Có thể bạn không có quyền hoặc có lỗi xảy ra.";
            setAlertMessage(errorMessage);
            setShowAlertDialog(true);
        } finally {
            setReviewToDeleteId(null);
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <h3 className="mb-4 text-center text-secondary">
                Quản lý tất cả đánh giá
            </h3>

            {/* ✅ Thêm Form Lọc */}
            <Card className="mb-4 shadow-sm border-0 rounded-3">
                <Card.Body>
                    <h5 className="mb-3 text-secondary">Bộ Lọc</h5>
                    <Form onSubmit={handleSearch}>
                        <Row className="g-3">
                            
                             <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Đánh giá (sao)</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="rating"
                                        value={filterParams.rating}
                                        onChange={handleParamChange}
                                    >
                                        <option value="">Tất cả</option>
                                        {[1, 2, 3, 4, 5].map(r => (
                                            <option key={r} value={r}>{r} sao</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Ngày bắt đầu</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="startDate"
                                        value={filterParams.startDate}
                                        onChange={handleParamChange}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Ngày kết thúc</Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="endDate"
                                        value={filterParams.endDate}
                                        onChange={handleParamChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <div className="text-end mt-3">
                            <Button variant="primary" type="submit">
                                Tìm kiếm
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>

            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="text-muted mt-3">Đang tải đánh giá...</p>
                </div>
            )}

            {!loading && reviews.length > 0 ? (
                reviews.map((review) => (
                    <ReviewItem key={review.id} review={review} onDelete={handleDeleteClick} />
                ))
            ) : (
                !loading && (
                    <Alert variant="info" className="text-center my-4">
                        {error || "Không có đánh giá nào được tìm thấy."}
                    </Alert>
                )
            )}

            <ConfirmationModal
                show={showConfirmModal}
                handleClose={() => setShowConfirmModal(false)}
                handleConfirm={confirmDelete}
                message="Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác."
            />

            <AlertDialog
                show={showAlertDialog}
                handleClose={() => setShowAlertDialog(false)}
                message={alertMessage}
            />
        </Container>
    );
};

export default ReviewManagement;
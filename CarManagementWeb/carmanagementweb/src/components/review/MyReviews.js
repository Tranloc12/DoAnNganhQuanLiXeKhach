// src/components/review/MyReviews.js
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Spinner, Alert, ListGroup, Card, Badge, Button, Row, Col, Modal } from "react-bootstrap";
import moment from "moment";
import { MyUserContext } from "../../contexts/Contexts";
import MyAxios, { endpoints, authApis } from "../../configs/Apis";

// Utility function to format date from an array [year, month, day, hour, minute]
const formatArrayDate = (dateArray) => {
    if (!dateArray || dateArray.length < 5) return 'N/A';
    const [year, month, day, hour, minute] = dateArray;
    const date = new Date(year, month - 1, day, hour, minute);
    return moment(date).format('HH:mm DD/MM/YYYY');
};

const ConfirmationModal = ({ show, handleClose, handleConfirm, message }) => (
    <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Hủy</Button>
            <Button variant="danger" onClick={handleConfirm}>Xác nhận</Button>
        </Modal.Footer>
    </Modal>
);

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

const ReviewItem = ({ review, onDelete }) => (
    <Card className="mb-4 shadow-sm border-0 rounded-3">
        <Card.Body className="p-4">
            <Row className="align-items-center mb-3">
                <Col xs={12} md={8}>
                    <Card.Title className="mb-0 text-primary fs-5 fw-bold">
                        {review.userId?.username || 'Bạn'}
                    </Card.Title>
                    <small className="text-muted">
                        Đánh giá vào: {moment(new Date(review.createdAt[0], review.createdAt[1] - 1, review.createdAt[2], review.createdAt[3], review.createdAt[4])).format('HH:mm DD/MM/YYYY')}
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
                        <strong>Khởi hành:</strong> {formatArrayDate(review.tripId?.departureTime)}
                    </Card.Subtitle>
                </Col>
            </Row>

            <Card.Text className="lead text-dark mt-3">{review.comment}</Card.Text>

            <div className="text-end mt-3 d-flex justify-content-end gap-2">
                <Link to={`/reviews/edit/${review.id}`}>
                    <Button variant="outline-primary" size="sm">Chỉnh sửa</Button>
                </Link>
                <Button variant="outline-danger" size="sm" onClick={() => onDelete(review.id)}>Xóa</Button>
            </div>
        </Card.Body>
    </Card>
);

const MyReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [reviewToDeleteId, setReviewToDeleteId] = useState(null);
    const [showAlertDialog, setShowAlertDialog] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const user = useContext(MyUserContext);

    useEffect(() => {
        const fetchMyReviews = async () => {
            if (!user) {
                setError("Bạn cần đăng nhập để xem đánh giá.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const res = await authApis().get(endpoints.myReviews);
                if (Array.isArray(res.data) && res.data.length > 0) {
                    setReviews(res.data);
                } else {
                    setReviews([]);
                    setError("Bạn chưa có đánh giá nào.");
                }
            } catch (err) {
                console.error("Lỗi khi tải đánh giá của bạn:", err);
                setError("Không thể tải đánh giá. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyReviews();
    }, [user]);

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
            const errorMessage = err.response?.data?.detail || err.response?.data || "Không thể xóa đánh giá! Có thể bạn không có quyền hoặc có lỗi xảy ra.";
            setAlertMessage(errorMessage);
            setShowAlertDialog(true);
        } finally {
            setReviewToDeleteId(null);
        }
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-3">Đang tải đánh giá của bạn...</p>
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
            <h3 className="mb-4 text-center text-secondary">Đánh giá của bạn</h3>
            {reviews.length > 0 ? (
                <ListGroup className="list-group-flush">
                    {reviews.map((review) => (
                        <ListGroup.Item key={review.id} className="p-0 border-0 bg-transparent">
                            <ReviewItem review={review} onDelete={handleDeleteClick} />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            ) : (
                <Alert variant="info" className="text-center my-4">
                    Bạn chưa có đánh giá nào.
                </Alert>
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

export default MyReviews;
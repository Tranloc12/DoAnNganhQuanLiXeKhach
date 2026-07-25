import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../configs/Apis";
import { Container, Form, Button, Spinner, Alert, Card, Row, Col } from "react-bootstrap";
import { MyUserContext } from "../../contexts/Contexts";

const EditReview = () => {
    const { reviewId } = useParams();
    const navigate = useNavigate();
    const currentUser = useContext(MyUserContext);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // ✅ CẬP NHẬT: Thêm các state mới để lưu trữ các tiêu chí đánh giá chi tiết
    const [overallRating, setOverallRating] = useState('');
    const [driverRating, setDriverRating] = useState('');
    const [busComfortRating, setBusComfortRating] = useState('');
    const [punctualityRating, setPunctualityRating] = useState('');
    const [customerServiceRating, setCustomerServiceRating] = useState('');
    const [comment, setComment] = useState('');
    
    const [tripId, setTripId] = useState(null);

    // Hàm kiểm tra validate rating
    const validateRating = (ratingValue) => {
        return ratingValue !== '' && parseInt(ratingValue) >= 1 && parseInt(ratingValue) <= 5;
    };

    useEffect(() => {
        const fetchReview = async () => {
            if (!reviewId) {
                setError("Không tìm thấy ID đánh giá.");
                setLoading(false);
                return;
            }

            if (!currentUser) {
                setError("Vui lòng đăng nhập để chỉnh sửa đánh giá.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // ✅ LẤY THÔNG TIN ĐÁNH GIÁ TỪ API
                const res = await authApis().get(endpoints.reviewDetail(reviewId));
                const reviewData = res.data;

                // Kiểm tra quyền chỉnh sửa
                if (reviewData.userId.id !== currentUser.id) {
                    setError("Bạn không có quyền chỉnh sửa đánh giá này.");
                    setLoading(false);
                    return;
                }
                
                // ✅ CẬP NHẬT CÁC STATE MỚI VỚI DỮ LIỆU ĐÃ TẢI XUỐNG
                setOverallRating(reviewData.rating || '');
                setDriverRating(reviewData.driverRating || '');
                setBusComfortRating(reviewData.busComfortRating || '');
                setPunctualityRating(reviewData.punctualityRating || '');
                setCustomerServiceRating(reviewData.customerServiceRating || '');
                setComment(reviewData.comment || '');

                setTripId(reviewData.tripId.id);
            } catch (err) {
                console.error("❌ Lỗi khi tải đánh giá để chỉnh sửa:", err);
                const errorMessage = err.response?.data?.detail || "Không thể tải đánh giá. Vui lòng thử lại sau.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchReview();
    }, [reviewId, currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        // ✅ VALIDATE DỮ LIỆU ĐẦU VÀO
        if (!validateRating(overallRating) ||
            !validateRating(driverRating) ||
            !validateRating(busComfortRating) ||
            !validateRating(punctualityRating) ||
            !validateRating(customerServiceRating)) {
            setError("Vui lòng chọn số sao đánh giá (từ 1 đến 5) cho tất cả các tiêu chí.");
            setSubmitting(false);
            return;
        }

        if (!comment.trim()) {
            setError("Bình luận không được để trống.");
            setSubmitting(false);
            return;
        }

        // ✅ TẠO PAYLOAD VỚI TẤT CẢ CÁC TIÊU CHÍ MỚI
        const payload = {
            rating: parseInt(overallRating),
            comment: comment.trim(),
            driverRating: parseInt(driverRating),
            busComfortRating: parseInt(busComfortRating),
            punctualityRating: parseInt(punctualityRating),
            customerServiceRating: parseInt(customerServiceRating),
        };

        try {
            await authApis().put(endpoints.updateReview(reviewId), payload);
            setSuccessMessage("✅ Đánh giá đã được cập nhật thành công!");
            
            if (tripId) {
                setTimeout(() => {
                    navigate(`/trips/${tripId}/reviews`);
                }, 2000);
            } else {
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (err) {
            console.error("❌ Lỗi khi cập nhật đánh giá:", err);
            const errorMessage = err.response?.data?.detail || "❌ Cập nhật đánh giá thất bại! Vui lòng thử lại.";
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-3">Đang tải dữ liệu đánh giá...</p>
            </div>
        );
    }
    
    if (error && !currentUser) {
        return <Alert variant="warning" className="text-center m-5">{error}</Alert>
    }

    return (
        <Container className="add-review-form mt-4 p-4 border rounded shadow-sm" style={{ maxWidth: '700px' }}>
            <Card className="shadow-lg p-4">
                <Card.Body>
                    <h4 className="text-center mb-4 text-primary">Chỉnh sửa đánh giá #{reviewId}</h4>
                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    {!error && (
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="overallRating">
                                        <Form.Label>Đánh giá tổng quan:</Form.Label>
                                        <Form.Select
                                            value={overallRating}
                                            onChange={(e) => setOverallRating(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Chọn số sao --</option>
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={`overall-${num}`} value={num}>{num} sao {Array(num).fill('⭐').join('')}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="driverRating">
                                        <Form.Label>Chất lượng tài xế:</Form.Label>
                                        <Form.Select
                                            value={driverRating}
                                            onChange={(e) => setDriverRating(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Chọn số sao --</option>
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={`driver-${num}`} value={num}>{num} sao {Array(num).fill('⭐').join('')}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="busComfortRating">
                                        <Form.Label>Sự thoải mái của xe:</Form.Label>
                                        <Form.Select
                                            value={busComfortRating}
                                            onChange={(e) => setBusComfortRating(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Chọn số sao --</option>
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={`bus-${num}`} value={num}>{num} sao {Array(num).fill('⭐').join('')}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="punctualityRating">
                                        <Form.Label>Đúng giờ:</Form.Label>
                                        <Form.Select
                                            value={punctualityRating}
                                            onChange={(e) => setPunctualityRating(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Chọn số sao --</option>
                                            {[1, 2, 3, 4, 5].map(num => (
                                                <option key={`punctuality-${num}`} value={num}>{num} sao {Array(num).fill('⭐').join('')}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3" controlId="customerServiceRating">
                                <Form.Label>Dịch vụ khách hàng:</Form.Label>
                                <Form.Select
                                    value={customerServiceRating}
                                    onChange={(e) => setCustomerServiceRating(e.target.value)}
                                    required
                                >
                                    <option value="">-- Chọn số sao --</option>
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <option key={`service-${num}`} value={num}>{num} sao {Array(num).fill('⭐').join('')}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="comment">
                                <Form.Label>Bình luận chi tiết:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
                                    required
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => navigate(`/trips/${tripId}`)} disabled={submitting}>
                                    Hủy
                                </Button>
                                <Button variant="primary" type="submit" disabled={submitting}>
                                    {submitting ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : 'Cập nhật đánh giá'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditReview;
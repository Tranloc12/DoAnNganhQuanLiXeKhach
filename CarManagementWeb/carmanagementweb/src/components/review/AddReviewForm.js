import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authApis, endpoints } from '../../configs/Apis';
import { Form, Button, Alert, Container, Spinner, Card, Row, Col } from 'react-bootstrap';
import { MyUserContext } from '../../contexts/Contexts'; // Import user context để kiểm tra đăng nhập

const AddReviewForm = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const user = useContext(MyUserContext); // Lấy thông tin người dùng

    // States cho các tiêu chí đánh giá
    const [overallRating, setOverallRating] = useState(''); // Tổng quan
    const [driverRating, setDriverRating] = useState('');    // Chất lượng tài xế
    const [busComfortRating, setBusComfortRating] = useState(''); // Sự thoải mái của xe
    const [punctualityRating, setPunctualityRating] = useState(''); // Đúng giờ
    const [customerServiceRating, setCustomerServiceRating] = useState(''); // Dịch vụ khách hàng

    const [comment, setComment] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false); // State để kiểm soát việc hiển thị form

    // Kiểm tra nếu người dùng chưa đăng nhập, chuyển hướng về trang đăng nhập
    useEffect(() => {
        if (!user) {
            // Không dùng alert() theo hướng dẫn. Sử dụng modal hoặc thông báo trên UI.
            // Để đơn giản, mình sẽ cho phép hiển thị thông báo lỗi ngay trên form.
            // setGlobalAlert("Bạn cần đăng nhập để thêm đánh giá."); // Nếu có global alert system
            setError("Bạn cần đăng nhập để thêm đánh giá.");
            // Chuyển hướng sau một khoảng thời gian để người dùng kịp đọc
            setTimeout(() => navigate('/login'), 2000); 
        }
    }, [user, navigate]);

    const validateRating = (ratingValue) => {
        return ratingValue !== '' && parseInt(ratingValue) >= 1 && parseInt(ratingValue) <= 5;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Kiểm tra validation cho tất cả các trường rating
        if (!validateRating(overallRating) ||
            !validateRating(driverRating) ||
            !validateRating(busComfortRating) ||
            !validateRating(punctualityRating) ||
            !validateRating(customerServiceRating)) {
            setError("Vui lòng chọn số sao đánh giá (từ 1 đến 5) cho tất cả các tiêu chí.");
            setLoading(false);
            return;
        }

        if (!comment.trim()) {
            setError("Bình luận không được để trống.");
            setLoading(false);
            return;
        }

        // Tạo payload với các đánh giá chi tiết
        const payload = {
            rating: parseInt(overallRating), // Giữ 'rating' tổng quan cho API hiện tại
            comment: comment.trim(),
            // Thêm các đánh giá chi tiết
            driverRating: parseInt(driverRating),
            busComfortRating: parseInt(busComfortRating),
            punctualityRating: parseInt(punctualityRating),
            customerServiceRating: parseInt(customerServiceRating),
        };

        try {
            await authApis().post(endpoints.addReview(tripId), payload);
            setSuccess("✅ Đánh giá của bạn đã được gửi thành công!");
            // Reset form sau khi gửi thành công
            setOverallRating('');
            setDriverRating('');
            setBusComfortRating('');
            setPunctualityRating('');
            setCustomerServiceRating('');
            setComment('');
            // Tự động chuyển hướng về trang danh sách reviews sau một thời gian
            setTimeout(() => navigate(`/trips/${tripId}/reviews`), 1500);
        } catch (err) {
            console.error("❌ Lỗi khi gửi review:", err);
            if (err.response?.status === 401) {
                setError("🔴 Bạn cần đăng nhập để đánh giá.");
                setTimeout(() => navigate('/login'), 2000); 
            } else if (err.response?.data?.message) {
                setError(`🔴 Lỗi: ${err.response.data.message}`);
            } else {
                setError("🔴 Có lỗi xảy ra khi gửi đánh giá.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        // Nếu chưa đăng nhập, hiển thị thông báo và chờ useEffect chuyển hướng
        return (
            <Container className="text-center my-5">
                <Alert variant="warning">Bạn cần đăng nhập để thêm đánh giá.</Alert>
                <Spinner animation="border" /> Đang chuyển hướng đến trang đăng nhập...
            </Container>
        );
    }

    return (
        <Container className="add-review-form mt-4 p-4 border rounded shadow-sm" style={{ maxWidth: '700px' }}>
                <Card className="shadow-lg p-4">
                    <Card.Body>
                        <h4 className="text-center mb-4 text-primary">Viết đánh giá cho chuyến đi #{tripId}</h4>
                        {success && <Alert variant="success">{success}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        
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
                                    placeholder="Chia sẻ thêm về trải nghiệm của bạn (ví dụ: thái độ tài xế, tiện nghi xe, sự cố,...)"
                                    required
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end gap-2">
                                <Button variant="secondary" onClick={() => navigate(`/trips/${tripId}/reviews`)} disabled={loading}>
                                    Hủy
                                </Button>
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? <Spinner as="span" animation="border" size="sm" className="me-2" /> : 'Gửi đánh giá'}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
          
        </Container>
    );
};

export default AddReviewForm;

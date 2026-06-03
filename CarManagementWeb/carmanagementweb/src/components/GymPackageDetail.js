import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Apis, { endpoints } from "../configs/Apis";
import { Card, Container, Spinner, Alert, Badge, Button } from "react-bootstrap";
import { FaUser, FaCalendarAlt, FaStar } from "react-icons/fa";
import Pagination from "./common/Pagination";
import { formatPrice, getChoiceLabel, formatDate } from "../utils/apiUtils";

const GymPackageDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pkg, setPkg] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [starFilter, setStarFilter] = useState(null);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [avgRating, setAvgRating] = useState(0);
    const pageSize = 5;

    const fetchDetail = async () => {
        try {
            const res = await Apis.get(endpoints["gym-packages-detail"](id));
            setPkg(res.data);
        } catch (err) {
            console.error(err);
            setError("Không thể tải thông tin gói tập.");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (page = 0) => {
        setReviewsLoading(true);
        try {
            const res = await Apis.get(endpoints["reviews-by-package"], {
                params: {
                    packageId: id,
                    page: page,
                    size: pageSize
                }
            });

            if (res.data && res.data.content) {
                setReviews(res.data.content);
                setTotalPages(res.data.totalPages);
                setTotalElements(res.data.totalElements);
                setCurrentPage(page);
            }
        } catch (err) {
            console.error(err);
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    const fetchAverageRating = async () => {
        try {
            const res = await Apis.get(endpoints["reviews-average-by-package"], {
                params: { packageId: id }
            });
            setAvgRating(res.data || 0);
        } catch (err) {
            console.error(err);
            setAvgRating(0);
        }
    };

    useEffect(() => {
        fetchDetail();
        fetchReviews(0);
        fetchAverageRating();
    }, [id]);

    const handlePageChange = (page) => {
        fetchReviews(page);
    };



    // Hàm render sao
    const renderStars = (rating) => {
        const stars = [];
        const ratingNum = Number(rating) || 0;
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(ratingNum)) {
                stars.push(
                    <FaStar
                        key={i}
                        color="#ffc107"
                        style={{ marginRight: 2 }}
                    />
                );
            } else if (i === Math.floor(ratingNum) + 1 && ratingNum % 1 >= 0.5) {
                stars.push(
                    <FaStar
                        key={i}
                        color="#ffc107"
                        style={{
                            marginRight: 2,
                            position: "relative",
                            clipPath: "polygon(0 0, 50% 0, 50% 100%, 0% 100%)",
                            WebkitClipPath: "polygon(0 0, 50% 0, 50% 100%, 0% 100%)",
                        }}
                    />
                );
                stars.push(
                    <FaStar
                        key={i + "-empty"}
                        color="#e4e5e9"
                        style={{
                            marginRight: 2,
                            position: "relative",
                            left: "-16px",
                            zIndex: -1,
                        }}
                    />
                );
            } else {
                stars.push(
                    <FaStar
                        key={i}
                        color="#e4e5e9"
                        style={{ marginRight: 2 }}
                    />
                );
            }
        }
        return stars;
    };



    if (loading)
        return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    // Lọc đánh giá theo starFilter nếu có (chỉ áp dụng cho hiển thị, không ảnh hưởng đến pagination)
    const filteredReviews = starFilter
        ? reviews.filter((r) => Math.round(Number(r.rating)) === starFilter)
        : reviews;

    return (
        <Container className="mt-4">
            <Card className="mb-4">
                <Card.Body>
                    <h3 className="mb-3">{pkg.namePack}</h3>

                    <h4 className="text-danger mb-3">
                        {formatPrice(pkg.price)}
                        {pkg.discount > 0 && (
                            <Badge bg="warning" text="dark" className="ms-2">
                                -{pkg.discount}%
                            </Badge>
                        )}
                    </h4>

                    <p className="mb-2">
                        <strong>Thời hạn:</strong> {getChoiceLabel(pkg.choice)}
                    </p>
                    <p className="mb-2">
                        <strong>Quyền lợi:</strong> {pkg.description}
                    </p>
                    <p className="mb-2">
                        <strong>Số buổi PT:</strong> {pkg.dayswpt}
                    </p>
                    <p className="mb-3">
                        <strong>Trạng thái:</strong>{" "}
                        {pkg.isActive ? (
                            <span className="text-success">Còn hiệu lực</span>
                        ) : (
                            <span className="text-muted">Ngừng hoạt động</span>
                        )}
                    </p>

                    <div className="d-flex justify-content-center">
                        <Button
                            variant="success"
                            size="sm"
                            onClick={() => navigate(`/create-subscription?packageId=${pkg.id}`)}
                            disabled={!pkg.isActive}
                            style={{ fontWeight: "600", fontSize: "0.85rem" }}
                        >
                            Đăng ký gói tập
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <Card className="mb-4">
                <Card.Body>
                    <h4 className="mb-4">Đánh giá người dùng ({totalElements})</h4>

                    <div className="mb-3 d-flex align-items-center">
                        <span className="me-3">Lọc theo đánh giá:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`btn btn-sm me-2 ${starFilter === star ? "btn-warning" : "btn-outline-secondary"
                                    }`}
                                onClick={() => setStarFilter(star === starFilter ? null : star)}
                            >
                                {star} <FaStar color="#ffc107" />
                            </button>
                        ))}
                    </div>

                    <div className="mb-4 text-center">
                        <h3 className="text-warning">
                            {Number(avgRating).toFixed(1)}{" "}
                            <span>{renderStars(avgRating)}</span>
                        </h3>
                        <p className="text-muted">trên 5</p>
                    </div>

                    {reviewsLoading ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                            <p className="mt-2">Đang tải đánh giá...</p>
                        </div>
                    ) : filteredReviews.length > 0 ? (
                        <>
                            {filteredReviews.map((r, idx) => (
                                <Card key={idx} className="mb-3">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0 d-flex align-items-center">
                                                <FaUser className="me-2" />
                                                {r.subscriptionId?.memberId?.username || "Người dùng"}
                                            </h6>
                                            <div className="d-flex align-items-center">
                                                {renderStars(r.rating)}
                                                <span className="ms-2">({r.rating}/5)</span>
                                            </div>
                                        </div>

                                        <small className="text-muted d-block mb-2">
                                            <FaCalendarAlt className="me-1" />
                                            {formatDate(r.createdAt)}
                                        </small>

                                        <div className="mb-2">
                                            {r.reviewTrainer && (
                                                <p className="mb-1">
                                                    <strong>Huấn luyện viên:</strong> {r.reviewTrainer}
                                                </p>
                                            )}
                                            {r.reviewPack && (
                                                <p className="mb-1">
                                                    <strong>Gói tập:</strong> {r.reviewPack}
                                                </p>
                                            )}
                                            {r.reviewGym && (
                                                <p className="mb-1">
                                                    <strong>Phòng gym:</strong> {r.reviewGym}
                                                </p>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}

                            {!starFilter && totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    className="mt-4"
                                />
                            )}
                        </>
                    ) : (
                        <p className="text-muted">Chưa có đánh giá nào cho gói tập này.</p>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default GymPackageDetail;

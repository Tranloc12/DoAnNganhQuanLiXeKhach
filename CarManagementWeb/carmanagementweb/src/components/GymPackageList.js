import { useEffect, useState } from "react";
import Apis, { endpoints } from "../configs/Apis.js";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Container, Button, Spinner } from "react-bootstrap";
import { formatPrice, getChoiceLabel } from "../utils/apiUtils";
import { FaStar } from "react-icons/fa";
import Pagination from "./common/Pagination";

const GymPackageList = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const pageSize = 6;
  const navigate = useNavigate();

  const fetchPackages = async (page = 0) => {
    setLoading(true);
    try {
      const response = await Apis.get(endpoints["gym-packages-with-rating"], {
        params: { page, size: pageSize }
      });

      if (response.data && response.data.content) {
        // Lọc chỉ hiển thị các gói active
        const activePackages = response.data.content.filter(p => p.isActive);
        setPackages(activePackages);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages(0);
  }, []);

  const handlePageChange = (page) => {
    fetchPackages(page);
  };

  // Hàm render sao
  const renderStars = (rating) => {
    const stars = [];
    const ratingNum = Number(rating) || 0;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          color={i <= Math.floor(ratingNum) ? "#ffc107" : "#e4e5e9"}
          style={{ marginRight: 2, fontSize: "0.8rem" }}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Đang tải danh sách gói tập...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2
        className="text-center mb-4 text-primary fw-bold"
        style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
      >
        Chọn Gói Tập
      </h2>

      {packages.length === 0 ? (
        <p className="text-center">Không có gói tập nào.</p>
      ) : (
        <>
          <Row xs={1} sm={1} md={2} lg={2} xl={3} className="g-4">
            {packages.map((p) => {
              return (
                <Col key={p.id}>
                  <Card
                    className="h-100 shadow-sm cursor-pointer package-card-clickable"
                    style={{
                      transition: "transform 0.2s",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onClick={() => navigate(`/packages/${p.id}`)}
                  >
                    <Card.Body className="d-flex flex-column justify-content-between">
                      <div>
                        <Card.Title
                          className="fw-bold mb-2"
                          style={{ fontSize: "1.2rem", color: "#2c3e50" }}
                        >
                          {p.namePack}
                        </Card.Title>
                        <Card.Subtitle
                          className="mb-3"
                          style={{ fontStyle: "italic", fontSize: "0.9rem", color: "#7f8c8d" }}
                        >
                          Giá: <span className="text-danger fw-semibold">{formatPrice(p.price)}</span>
                        </Card.Subtitle>

                        {/* Rating display */}
                        <div className="mb-2 d-flex align-items-center">
                          {renderStars(p.avgRating || 0)}
                          <span className="ms-2 text-muted" style={{ fontSize: "0.8rem" }}>
                            ({Number(p.avgRating || 0).toFixed(1)}) - {p.reviewCount || 0} đánh giá
                          </span>
                        </div>

                        <Card.Text
                          style={{ fontSize: "0.85rem", color: "#34495e", lineHeight: "1.4", marginBottom: "8px" }}
                        >
                          <strong>Thời gian:</strong> {getChoiceLabel(p.choice)}
                        </Card.Text>

                        <Card.Text
                          className="text-wrap"
                          style={{ fontSize: "0.8rem", color: "#555", lineHeight: "1.4", marginBottom: "8px" }}
                        >
                          <strong>Quyền lợi:</strong> {p.description}
                        </Card.Text>

                        <Card.Text
                          style={{ fontSize: "0.85rem", color: "#34495e", lineHeight: "1.4", marginBottom: "8px" }}
                        >
                          <strong>Số buổi PT:</strong> {p.dayswpt}
                        </Card.Text>

                        <Card.Text
                          style={{ fontSize: "0.85rem", color: "#34495e", lineHeight: "1.4" }}
                        >
                          <strong>Giảm giá:</strong> {p.discount ? `${p.discount}%` : "Không có"}
                        </Card.Text>
                      </div>
                    </Card.Body>

                    <Card.Footer className="d-flex justify-content-center align-items-center">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click when button is clicked
                          navigate(`/create-subscription?packageId=${p.id}`);
                        }}
                        style={{ fontWeight: "600", fontSize: "0.85rem" }}
                      >
                        Đăng ký ngay
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mt-4"
          />
        </>
      )}
    </Container>
  );
};

export default GymPackageList;

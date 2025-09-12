import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Table, Alert, Spinner, Form, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🆕 Thêm trạng thái cho các bộ lọc
  const [filters, setFilters] = useState({
    licensePlate: "",
    model: "",
    capacity: "",
    yearManufacture: "",
    status: "",
  });

  const fetchBuses = async () => {
    setLoading(true);
    setError(null);
    try {
      // 🆕 Tạo URL với các tham số lọc từ state
      const query = new URLSearchParams(filters).toString();
      let url = `${endpoints.buses}?${query}`;
      let res = await authApis().get(url);
      setBuses(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách xe buýt:", err);
      setError("Không thể tải danh sách xe buýt.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [filters]); // 🆕 Khi filters thay đổi, gọi lại API

  const deleteBus = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá xe buýt này không?")) return;

    try {
      await authApis().delete(endpoints.deleteBus(id));
      setBuses(buses.filter((b) => b.id !== id));
    } catch (err) {
      console.error("❌ Xoá thất bại:", err);
      alert("Xoá xe buýt thất bại.");
    }
  };

  // 🆕 Hàm xử lý thay đổi của input
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // 🆕 Hàm xử lý khi nhấn nút Lọc
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchBuses();
  };

  // 🆕 Hàm xử lý khi nhấn nút Xóa bộ lọc
  const handleClearFilters = () => {
    setFilters({
      licensePlate: "",
      model: "",
      capacity: "",
      yearManufacture: "",
      status: "",
    });
    // Do useEffect đã lắng nghe, nó sẽ tự động gọi fetchBuses khi filters thay đổi
  };

  return (
    <>
      <h1>Quản lý xe buýt</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Link to="/manager/buses/add">
        <Button className="mb-3">Thêm xe buýt</Button>
      </Link>
      
      {/* 🆕 Form tìm kiếm và lọc */}
      <Form className="my-3" onSubmit={handleFilterSubmit}>
        <Row>
          <Col md={4} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Biển số</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập biển số xe"
                name="licensePlate"
                value={filters.licensePlate}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={4} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Model</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập model"
                name="model"
                value={filters.model}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md={4} sm={6}>
            <Form.Group className="mb-3">
              <Form.Label>Số ghế</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số ghế"
                name="capacity"
                value={filters.capacity}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClearFilters} className="me-2">
                Xóa bộ lọc
            </Button>
            <Button variant="primary" type="submit">
                Lọc
            </Button>
        </div>
      </Form>

      {loading ? (
        <div className="text-center my-4">
          <Spinner animation="border" variant="primary" />
          <p className="text-muted mt-2">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Biển số</th>
              <th>Model</th>
              <th>Số ghế</th>
              <th>Năm SX</th>
              <th>Trạng thái</th>
              <th>Mô tả</th>
              <th>Kích hoạt</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id}>
                <td>{bus.id}</td>
                <td>{bus.licensePlate}</td>
                <td>{bus.model}</td>
                <td>{bus.capacity}</td>
                <td>{bus.yearManufacture}</td>
                <td>{bus.status}</td>
                <td>{bus.description}</td>
                <td>{bus.isActive ? "✅" : "❌"}</td>
                <td>
                  <Link to={`/manager/buses/edit/${bus.id}`}>
                    <Button variant="warning" size="sm" className="me-2">
                      Sửa
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => deleteBus(bus.id)}
                  >
                    Xoá
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default BusManagement;
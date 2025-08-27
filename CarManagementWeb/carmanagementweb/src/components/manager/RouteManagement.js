import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Table, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm tải danh sách các tuyến đường từ API
  const fetchRoutes = async () => {
    try {
      let res = await authApis().get(endpoints.routes);
      console.log("✅ Dữ liệu tuyến đường:", res.data);
      setRoutes(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải tuyến đường:", err);
      setError("Không thể tải danh sách tuyến đường.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  // Hàm xử lý khi người dùng nhấn nút xóa
  const handleDelete = async (routeId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tuyến đường này?")) return;

    try {
      await authApis().delete(`${endpoints.routes}/${routeId}`);
      alert("✅ Đã xóa tuyến đường!");
      
      // Cập nhật state để loại bỏ tuyến đường đã xóa khỏi UI
      setRoutes((prev) => prev.filter((r) => r.id !== routeId));
    } catch (err) {
      console.error("❌ Lỗi khi xóa tuyến:", err);
      alert("❌ Không thể xóa tuyến đường!");
    }
  };

  return (
    <>
      <h1>Quản lý tuyến đường</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Link to="/manager/routes/add">
        <Button className="mb-3">Thêm tuyến đường</Button>
      </Link>

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
              <th>Tên tuyến</th>
              <th>Điểm đầu</th>
              <th>Điểm cuối</th>
              <th>Số km</th>
              <th>Thời gian dự kiến</th>
              <th>Giá mỗi km</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.routeName}</td>
                <td>{r.origin}</td>
                <td>{r.destination}</td>
                <td>{r.distanceKm} km</td>
                <td>{r.estimatedTravelTime}</td>
                <td>{r.pricePerKm} VNĐ</td>
                <td>
                  <Link to={`/manager/routes/edit/${r.id}`}>
                    <Button variant="warning" size="sm" className="me-2">
                      Sửa
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(r.id)}
                  >
                    Xóa
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

export default RouteManagement;
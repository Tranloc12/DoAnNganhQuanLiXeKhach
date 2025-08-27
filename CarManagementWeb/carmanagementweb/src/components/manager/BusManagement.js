import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/Apis";
import { Button, Table, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

const BusManagement = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBuses = async () => {
    try {
      let res = await authApis().get(endpoints.buses);
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
  }, []);

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

  return (
    <>
      <h1>Quản lý xe buýt</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Link to="/manager/buses/add">
        <Button className="mb-3">Thêm xe buýt</Button>
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

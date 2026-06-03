import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import Apis, { endpoints } from "../configs/Apis.js";
import MySpinner from "./layout/MySpinner";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    dob: "",
    userRole: "ROLE_PASSENGER", // mặc định nếu backend yêu cầu
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (form.password !== form.confirmPassword) {
      setMsg("Mật khẩu xác nhận không khớp!");
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMsg(null);

    try {
      const payload = {
        username: form.username,
        password: form.password,
        email: form.email,
        dob: form.dob,
        userRole: form.userRole,
      };

      const res = await Apis.post(endpoints.register, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 201 || res.status === 200) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Lỗi khi đăng ký:", err.response);

      const errMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        (typeof err.response?.data === "string" && err.response.data) ||
        "Đăng ký thất bại, vui lòng thử lại.";

      setMsg(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center text-success mt-2">ĐĂNG KÝ NGƯỜI DÙNG</h1>

      {msg && <Alert variant="danger" className="mt-2">{msg}</Alert>}

      <Form onSubmit={handleRegister} className="mt-3">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Tên đăng nhập"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="date"
            placeholder="Ngày sinh"
            value={form.dob}
            onChange={(e) => handleChange("dob", e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Select
            value={form.userRole}
            onChange={(e) => handleChange("userRole", e.target.value)}
          >
            <option value="ROLE_PASSENGER">Hành khách</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3 text-center">
          {loading ? (
            <MySpinner />
          ) : (
            <Button type="submit" variant="danger">
              Đăng ký
            </Button>
          )}
        </Form.Group>
      </Form>
    </div>
  );
};

export default Register;

import { useContext, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import cookie from "react-cookies";

import Apis, { authApis, endpoints } from "../configs/Apis.js";
import MySpinner from "./layout/MySpinner";
import { MyDispatchContext } from "../contexts/Contexts";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();
  const dispatch = useContext(MyDispatchContext);

  const handleChange = (field, value) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1️⃣ Gửi request đăng nhập
      const res = await Apis.post(endpoints.login, credentials);
      const token = res.data.token;

      // 2️⃣ Lưu token vào cookie
      cookie.save("token", token, { path: "/" });

      // 3️⃣ Lấy thông tin user hiện tại
      const userRes = await authApis().get(endpoints.currentUser);

      // 4️⃣ Lưu user vào context
      dispatch({ type: "login", payload: userRes.data });

      // 5️⃣ Điều hướng về trang chủ
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setErrorMsg("Tên đăng nhập hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-center text-success mt-2">ĐĂNG NHẬP NGƯỜI DÙNG</h1>

      {errorMsg && <Alert variant="danger" className="mt-2">{errorMsg}</Alert>}

      <Form onSubmit={handleLogin} className="mt-3">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Tên đăng nhập"
            value={credentials.username}
            onChange={(e) => handleChange("username", e.target.value)}
            required
            autoComplete="username"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Control
            type="password"
            placeholder="Mật khẩu"
            value={credentials.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
            autoComplete="current-password"
          />
        </Form.Group>

        <div className="mb-3">
          {loading ? (
            <MySpinner />
          ) : (
            <Button type="submit" variant="danger" className="w-100">
              Đăng nhập
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default Login;

import { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import cookie from "react-cookies";
import Apis, { authApis, endpoints } from "../configs/Apis.js";
import MySpinner from "./layout/MySpinner";
import { MyDispatchContext } from "../contexts/Contexts";

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useContext(MyDispatchContext);

  const handleChange = (field, value) => setCredentials(prev => ({ ...prev, [field]: value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await Apis.post(endpoints.login, credentials);
      cookie.save("token", res.data.token, { path: "/" });
      const userRes = await authApis().get(endpoints.currentUser);
      dispatch({ type: "login", payload: userRes.data });
      navigate("/", { replace: true });
    } catch (err) {
      setErrorMsg("Tên đăng nhập hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', position: 'fixed', inset: 0, zIndex: 999,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #faf9f7 0%, #f5f0e8 50%, #fef3e2 100%)',
      padding: '20px',
    }}>
      {/* Soft decorative blobs */}
      <div style={{ position:'absolute', width:'500px', height:'500px', background:'radial-gradient(circle, rgba(232,131,42,0.06) 0%, transparent 70%)', top:'-150px', right:'-150px', borderRadius:'50%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:'350px', height:'350px', background:'radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 70%)', bottom:'-80px', left:'-80px', borderRadius:'50%', pointerEvents:'none' }} />

      <div style={{
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.07)',
        borderRadius: '24px',
        padding: '48px 40px',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 50px rgba(0,0,0,0.1)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{
            width:'64px', height:'64px',
            background: 'linear-gradient(135deg, #e8832a, #f09a40)',
            borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 16px', boxShadow:'0 8px 24px rgba(232,131,42,0.28)',
          }}>
            <i className="fa-solid fa-bus" style={{ fontSize:'28px', color:'#fff' }}></i>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.9rem', fontWeight:700, color:'#1a1410', marginBottom:'8px' }}>
            Đăng nhập
          </h1>
          <p style={{ color:'#9c8c78', fontSize:'0.9rem', margin:0 }}>Chào mừng trở lại! Vui lòng đăng nhập.</p>
        </div>

        {errorMsg && (
          <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'12px', padding:'12px 16px', marginBottom:'20px', color:'#dc2626', fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'8px' }}>
            <i className="fa-solid fa-circle-exclamation"></i>{errorMsg}
          </div>
        )}

        <Form onSubmit={handleLogin}>
          {/* Username */}
          <div style={{ marginBottom:'18px' }}>
            <label style={{ display:'block', color:'#9c8c78', fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:'8px' }}>
              Tên đăng nhập
            </label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', color:'#c4b8a8', fontSize:'0.95rem' }}>
                <i className="fa-solid fa-user"></i>
              </span>
              <Form.Control type="text" placeholder="Tên đăng nhập..." value={credentials.username}
                onChange={e => handleChange("username", e.target.value)} required autoComplete="username"
                style={{ background:'#faf9f7', border:'1.5px solid rgba(0,0,0,0.09)', color:'#1a1410', borderRadius:'12px', padding:'13px 16px 13px 44px', fontSize:'0.95rem' }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom:'28px' }}>
            <label style={{ display:'block', color:'#9c8c78', fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:'8px' }}>
              Mật khẩu
            </label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:'16px', top:'50%', transform:'translateY(-50%)', color:'#c4b8a8', fontSize:'0.95rem' }}>
                <i className="fa-solid fa-lock"></i>
              </span>
              <Form.Control type={showPassword?"text":"password"} placeholder="Mật khẩu..." value={credentials.password}
                onChange={e => handleChange("password", e.target.value)} required autoComplete="current-password"
                style={{ background:'#faf9f7', border:'1.5px solid rgba(0,0,0,0.09)', color:'#1a1410', borderRadius:'12px', padding:'13px 44px 13px 44px', fontSize:'0.95rem' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#c4b8a8', cursor:'pointer', padding:'4px' }}>
                <i className={`fa-solid fa-eye${showPassword?'-slash':''}`}></i>
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'10px 0' }}><MySpinner /></div>
          ) : (
            <button type="submit" style={{
              width:'100%', padding:'14px',
              background: 'linear-gradient(135deg, #e8832a, #f09a40)',
              border:'none', borderRadius:'12px', color:'#fff',
              fontSize:'0.95rem', fontWeight:700, cursor:'pointer',
              boxShadow:'0 6px 20px rgba(232,131,42,0.3)',
              transition:'all 0.3s ease', letterSpacing:'0.5px',
            }}
              onMouseEnter={e => { e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 10px 28px rgba(232,131,42,0.45)'; }}
              onMouseLeave={e => { e.target.style.transform='translateY(0)'; e.target.style.boxShadow='0 6px 20px rgba(232,131,42,0.3)'; }}
            >
              <i className="fa-solid fa-right-to-bracket me-2"></i>Đăng nhập
            </button>
          )}

          <p style={{ textAlign:'center', marginTop:'20px', color:'#9c8c78', fontSize:'0.9rem' }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ color:'#e8832a', fontWeight:700, textDecoration:'none' }}>Đăng ký ngay</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;

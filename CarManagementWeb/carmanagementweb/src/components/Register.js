import { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import Apis, { endpoints } from "../configs/Apis.js";
import MySpinner from "./layout/MySpinner";

const Register = () => {
  const [form, setForm] = useState({ username:"", password:"", confirmPassword:"", email:"", dob:"", userRole:"ROLE_PASSENGER" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    if (form.password !== form.confirmPassword) { setMsg("Mật khẩu xác nhận không khớp!"); return false; }
    if (form.password.length < 6) { setMsg("Mật khẩu phải có ít nhất 6 ký tự!"); return false; }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true); setMsg(null);
    try {
      const res = await Apis.post(endpoints.register, { username:form.username, password:form.password, email:form.email, dob:form.dob, userRole:form.userRole }, { headers:{"Content-Type":"application/json"} });
      if (res.status === 201 || res.status === 200) { setSuccess(true); setTimeout(() => navigate("/login"), 2000); }
    } catch (err) {
      setMsg(err.response?.data?.message || err.response?.data?.error || "Đăng ký thất bại, vui lòng thử lại.");
    } finally { setLoading(false); }
  };

  const inp = {
    background:'#faf9f7', border:'1.5px solid rgba(0,0,0,0.09)',
    color:'#1a1410', borderRadius:'12px',
    padding:'13px 16px 13px 44px', fontSize:'0.94rem', width:'100%',
    outline:'none', transition:'all 0.25s ease',
    onFocus: e => { e.target.style.borderColor='#e8832a'; e.target.style.background='#fff'; e.target.style.boxShadow='0 0 0 3px rgba(232,131,42,0.1)'; },
    onBlur: e => { e.target.style.borderColor='rgba(0,0,0,0.09)'; e.target.style.background='#faf9f7'; e.target.style.boxShadow='none'; },
  };

  const lbl = { display:'block', color:'#9c8c78', fontSize:'0.7rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:'8px' };
  const grp = { marginBottom:'16px' };
  const icn = { position:'absolute', left:'15px', top:'50%', transform:'translateY(-50%)', color:'#c4b8a8', fontSize:'0.9rem', pointerEvents:'none' };

  return (
    <div style={{
      minHeight:'100vh', position:'fixed', inset:0, zIndex:999,
      display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(160deg, #faf9f7 0%, #f5f0e8 50%, #fef3e2 100%)',
      padding:'20px', overflowY:'auto',
    }}>
      <div style={{ position:'absolute', width:'450px', height:'450px', background:'radial-gradient(circle, rgba(232,131,42,0.06) 0%, transparent 70%)', top:'-120px', right:'-120px', borderRadius:'50%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', width:'320px', height:'320px', background:'radial-gradient(circle, rgba(212,168,83,0.05) 0%, transparent 70%)', bottom:'-60px', left:'-60px', borderRadius:'50%', pointerEvents:'none' }} />

      <div style={{
        background:'#ffffff', border:'1px solid rgba(0,0,0,0.07)', borderRadius:'24px',
        padding:'40px 36px', width:'100%', maxWidth:'470px',
        boxShadow:'0 4px 6px rgba(0,0,0,0.04), 0 20px 50px rgba(0,0,0,0.1)',
        position:'relative', zIndex:1, margin:'20px auto',
      }}>
        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ width:'58px', height:'58px', background:'linear-gradient(135deg, #e8832a, #f09a40)', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', boxShadow:'0 6px 20px rgba(232,131,42,0.28)' }}>
            <i className="fa-solid fa-user-plus" style={{ fontSize:'22px', color:'#fff' }}></i>
          </div>
          <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.7rem', fontWeight:700, color:'#1a1410', marginBottom:'6px' }}>Tạo tài khoản</h1>
          <p style={{ color:'#9c8c78', fontSize:'0.88rem', margin:0 }}>Tham gia ngay để đặt vé nhanh chóng!</p>
        </div>

        {success && (
          <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:'12px', padding:'12px 16px', marginBottom:'18px', color:'#15803d', fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'10px' }}>
            <i className="fa-solid fa-circle-check"></i>Đăng ký thành công! Đang chuyển trang...
          </div>
        )}
        {msg && !success && (
          <div style={{ background:'#fef2f2', border:'1px solid #fecaca', borderRadius:'12px', padding:'12px 16px', marginBottom:'18px', color:'#dc2626', fontSize:'0.88rem', display:'flex', alignItems:'center', gap:'8px' }}>
            <i className="fa-solid fa-circle-exclamation"></i>{msg}
          </div>
        )}

        <Form onSubmit={handleRegister}>
          <div style={grp}>
            <label style={lbl}>Tên đăng nhập</label>
            <div style={{ position:'relative' }}>
              <span style={icn}><i className="fa-solid fa-user"></i></span>
              <input type="text" placeholder="Tên đăng nhập..." value={form.username} onChange={e => handleChange("username", e.target.value)} required
                style={inp} onFocus={inp.onFocus} onBlur={inp.onBlur} />
            </div>
          </div>

          <div style={grp}>
            <label style={lbl}>Email</label>
            <div style={{ position:'relative' }}>
              <span style={icn}><i className="fa-solid fa-envelope"></i></span>
              <input type="email" placeholder="your@email.com" value={form.email} onChange={e => handleChange("email", e.target.value)} required
                style={inp} onFocus={inp.onFocus} onBlur={inp.onBlur} />
            </div>
          </div>

          <div style={grp}>
            <label style={lbl}>Ngày sinh</label>
            <div style={{ position:'relative' }}>
              <span style={icn}><i className="fa-solid fa-calendar"></i></span>
              <input type="date" value={form.dob} onChange={e => handleChange("dob", e.target.value)} required
                style={{ ...inp, colorScheme:'light' }} onFocus={inp.onFocus} onBlur={inp.onBlur} />
            </div>
          </div>

          <div style={grp}>
            <label style={lbl}>Mật khẩu</label>
            <div style={{ position:'relative' }}>
              <span style={icn}><i className="fa-solid fa-lock"></i></span>
              <input type={showPass?"text":"password"} placeholder="Tối thiểu 6 ký tự..." value={form.password} onChange={e => handleChange("password", e.target.value)} required
                style={{ ...inp, paddingRight:'44px' }} onFocus={inp.onFocus} onBlur={inp.onBlur} />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{ position:'absolute', right:'13px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#c4b8a8', cursor:'pointer' }}>
                <i className={`fa-solid fa-eye${showPass?'-slash':''}`}></i>
              </button>
            </div>
          </div>

          <div style={{ ...grp, marginBottom:'28px' }}>
            <label style={lbl}>Xác nhận mật khẩu</label>
            <div style={{ position:'relative' }}>
              <span style={icn}><i className="fa-solid fa-shield-halved"></i></span>
              <input type={showConfirm?"text":"password"} placeholder="Nhập lại mật khẩu..." value={form.confirmPassword} onChange={e => handleChange("confirmPassword", e.target.value)} required
                style={{ ...inp, paddingRight:'44px' }} onFocus={inp.onFocus} onBlur={inp.onBlur} />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position:'absolute', right:'13px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#c4b8a8', cursor:'pointer' }}>
                <i className={`fa-solid fa-eye${showConfirm?'-slash':''}`}></i>
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign:'center', padding:'10px 0' }}><MySpinner /></div>
          ) : (
            <button type="submit" style={{
              width:'100%', padding:'14px',
              background:'linear-gradient(135deg, #e8832a, #f09a40)',
              border:'none', borderRadius:'12px', color:'#fff',
              fontSize:'0.95rem', fontWeight:700, cursor:'pointer',
              boxShadow:'0 6px 20px rgba(232,131,42,0.3)', transition:'all 0.3s ease',
            }}
              onMouseEnter={e => { e.target.style.transform='translateY(-2px)'; e.target.style.boxShadow='0 10px 28px rgba(232,131,42,0.45)'; }}
              onMouseLeave={e => { e.target.style.transform='translateY(0)'; e.target.style.boxShadow='0 6px 20px rgba(232,131,42,0.3)'; }}
            >
              <i className="fa-solid fa-user-plus me-2"></i>Tạo tài khoản
            </button>
          )}

          <p style={{ textAlign:'center', marginTop:'18px', color:'#9c8c78', fontSize:'0.9rem' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color:'#e8832a', fontWeight:700, textDecoration:'none' }}>Đăng nhập ngay</Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Register;

import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      background: '#1a1410',
      borderTop: '3px solid #e8832a',
      color: '#9c8c78',
      fontFamily: "'Inter', sans-serif",
      paddingTop: '52px',
    }}>
      <Container>
        <Row className="g-4 pb-5">
          {/* Brand */}
          <Col md={4}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
              <div style={{ width:'40px', height:'40px', background:'linear-gradient(135deg, #e8832a, #f09a40)', borderRadius:'11px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(232,131,42,0.35)', flexShrink:0 }}>
                <i className="fa-solid fa-bus" style={{ fontSize:'19px', color:'#fff' }}></i>
              </div>
              <span style={{ fontSize:'1.3rem', fontWeight:900, color:'#f5f0e8', letterSpacing:'-0.5px' }}>
                Xe<span style={{ background:'linear-gradient(135deg, #e8832a, #f09a40)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Khách</span>
              </span>
            </div>
            <p style={{ color:'#6b5f50', fontSize:'0.88rem', lineHeight:1.85, marginBottom:'22px' }}>
              Hệ thống đặt vé xe khách trực tuyến tiện lợi và nhanh chóng. Đặt vé dễ dàng, an toàn và tiết kiệm thời gian!
            </p>
            <div style={{ display:'flex', gap:'10px' }}>
              {[
                { href:'https://facebook.com', icon:<FaFacebook size={17}/>, color:'#1877f2' },
                { href:'https://twitter.com', icon:<FaTwitter size={17}/>, color:'#1da1f2' },
                { href:'https://instagram.com', icon:<FaInstagram size={17}/>, color:'#e4405f' },
              ].map((s,i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width:'38px', height:'38px', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#6b5f50', transition:'all 0.3s ease', textDecoration:'none' }}
                  onMouseEnter={e => { e.currentTarget.style.background=s.color+'22'; e.currentTarget.style.borderColor=s.color+'55'; e.currentTarget.style.color=s.color; e.currentTarget.style.transform='translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)'; e.currentTarget.style.color='#6b5f50'; e.currentTarget.style.transform='translateY(0)'; }}
                >{s.icon}</a>
              ))}
            </div>
          </Col>

          {/* Links */}
          <Col md={2} xs={6}>
            <h6 style={{ color:'#f5f0e8', fontWeight:700, marginBottom:'18px', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'1.5px' }}>Điều hướng</h6>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {[['/', 'Trang chủ'], ['/trips', 'Chuyến đi'], ['/routes', 'Tuyến đường'], ['/bookings-history', 'Vé của tôi']].map(([to,label],i) => (
                <Link key={i} to={to} style={{ color:'#6b5f50', textDecoration:'none', fontSize:'0.88rem', transition:'all 0.25s ease', display:'flex', alignItems:'center', gap:'6px' }}
                  onMouseEnter={e => { e.currentTarget.style.color='#e8832a'; e.currentTarget.style.paddingLeft='5px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='#6b5f50'; e.currentTarget.style.paddingLeft='0'; }}
                >
                  <span style={{ width:'4px', height:'4px', background:'#e8832a', borderRadius:'50%', flexShrink:0 }}></span>{label}
                </Link>
              ))}
            </div>
          </Col>

          <Col md={2} xs={6}>
            <h6 style={{ color:'#f5f0e8', fontWeight:700, marginBottom:'18px', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'1.5px' }}>Dịch vụ</h6>
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {[['/login', 'Đăng nhập'], ['/register', 'Đăng ký'], ['/my-reviews', 'Đánh giá'], ['/payments-history', 'Giao dịch']].map(([to,label],i) => (
                <Link key={i} to={to} style={{ color:'#6b5f50', textDecoration:'none', fontSize:'0.88rem', transition:'all 0.25s ease', display:'flex', alignItems:'center', gap:'6px' }}
                  onMouseEnter={e => { e.currentTarget.style.color='#e8832a'; e.currentTarget.style.paddingLeft='5px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color='#6b5f50'; e.currentTarget.style.paddingLeft='0'; }}
                >
                  <span style={{ width:'4px', height:'4px', background:'#e8832a', borderRadius:'50%', flexShrink:0 }}></span>{label}
                </Link>
              ))}
            </div>
          </Col>

          {/* Contact */}
          <Col md={4}>
            <h6 style={{ color:'#f5f0e8', fontWeight:700, marginBottom:'18px', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'1.5px' }}>Liên hệ</h6>
            <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              {[
                { icon:<FaEnvelope/>, text:'support@xekhach.com', color:'#e8832a' },
                { icon:<FaPhone/>, text:'1900 6067', color:'#22c55e' },
                { icon:<FaMapMarkerAlt/>, text:'TP. Hồ Chí Minh, Việt Nam', color:'#3b82f6' },
              ].map((c,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                  <div style={{ width:'34px', height:'34px', flexShrink:0, background:c.color+'18', border:`1px solid ${c.color}30`, borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center', color:c.color, fontSize:'0.88rem' }}>{c.icon}</div>
                  <span style={{ color:'#9c8c78', fontSize:'0.88rem' }}>{c.text}</span>
                </div>
              ))}
            </div>
          </Col>
        </Row>

        {/* Bottom */}
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', padding:'18px 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
          <p style={{ color:'#3d3228', fontSize:'0.82rem', margin:0 }}>
            © {year} <span style={{ color:'#e8832a', fontWeight:600 }}>XeKhách</span>. All rights reserved.
          </p>
          <p style={{ color:'#2d2520', fontSize:'0.8rem', margin:0 }}>
            Built with <span style={{ color:'#ef4444' }}>❤️</span> by Nhóm 12
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

import { useContext, useEffect, useState } from "react";
import { Container, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyDispatchContext, MyUserContext } from "../../contexts/Contexts";
import RoleBasedComponent from "../common/RoleBasedComponent";
import { ROLES } from "../../utils/roleUtils";
import { FaBell } from 'react-icons/fa';

const Header = () => {
  const nav = useNavigate();
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  const calcUnread = () => {
    if (!user) return 0;
    return JSON.parse(localStorage.getItem('notifications') || '[]').filter(n => !n.read).length;
  };

  useEffect(() => {
    setUnreadCount(calcUnread());
    const onStorage = e => { if (e.key === 'notifications' || !e.key) setUnreadCount(calcUnread()); };
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('storage', onStorage);
    window.addEventListener('scroll', onScroll);
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('scroll', onScroll); };
  }, [user]);

  return (
    <Navbar expand="lg" style={{
      background: '#ffffff',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(0,0,0,0.05)',
      boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.08)' : '0 1px 6px rgba(0,0,0,0.04)',
      padding: '12px 0',
      transition: 'all 0.3s ease',
      position: 'sticky', top: 0, zIndex: 1000,
    }}>
      <Container>
        {/* Brand */}
        <Navbar.Brand as={Link} to="/" style={{ display:'flex', alignItems:'center', gap:'10px', textDecoration:'none' }}>
          <div style={{
            width:'38px', height:'38px',
            background:'linear-gradient(135deg, #e8832a, #f09a40)',
            borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:'0 4px 14px rgba(232,131,42,0.3)', flexShrink:0,
          }}>
            <i className="fa-solid fa-bus" style={{ fontSize:'18px', color:'#fff' }}></i>
          </div>
          <span style={{ fontSize:'1.25rem', fontWeight:900, color:'#1a1410', letterSpacing:'-0.5px' }}>
            Xe<span style={{ background:'linear-gradient(135deg, #e8832a, #f09a40)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Khách</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" style={{ border:'1px solid rgba(0,0,0,0.12)', borderRadius:'8px', padding:'6px 10px' }} />

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto align-items-center" style={{ gap:'2px' }}>
            <Nav.Link as={Link} to="/" style={nl}>
              <i className="fa-solid fa-house me-1"></i>Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/trips" style={nl}>
              <i className="fa-solid fa-route me-1"></i>Chuyến đi
            </Nav.Link>
            <Nav.Link as={Link} to="/routes" style={nl}>
              <i className="fa-solid fa-map me-1"></i>Tuyến đường
            </Nav.Link>

            <RoleBasedComponent allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
              <NavDropdown title={<span style={{ color:'#5c4f3a', fontWeight:500, fontSize:'0.88rem' }}><i className="fa-solid fa-gears me-1"></i>Quản lý</span>} id="manager-dd">
                <NavDropdown.Item as={Link} to="/bus-management" style={di}><i className="fa-solid fa-bus me-2" style={{ color:'#e8832a' }}></i>Xe khách</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/trip-management" style={di}><i className="fa-solid fa-route me-2" style={{ color:'#e8832a' }}></i>Chuyến đi</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/manager/routes" style={di}><i className="fa-solid fa-map-marked-alt me-2" style={{ color:'#e8832a' }}></i>Tuyến đường</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/manager/schedules" style={di}><i className="fa-solid fa-calendar-days me-2" style={{ color:'#e8832a' }}></i>Lịch trình</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/user-management" style={di}><i className="fa-solid fa-users me-2" style={{ color:'#3b82f6' }}></i>Người dùng</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/manager/reviews" style={di}><i className="fa-solid fa-star me-2" style={{ color:'#d97706' }}></i>Đánh giá</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/bus-stations" style={di}><i className="fa-solid fa-building me-2" style={{ color:'#16a34a' }}></i>Bến xe</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/transfer-points" style={di}><i className="fa-solid fa-code-branch me-2" style={{ color:'#16a34a' }}></i>Điểm trung chuyển</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/trip-transfer" style={di}><i className="fa-solid fa-arrows-split-up-and-left me-2" style={{ color:'#16a34a' }}></i>Trung chuyển xe</NavDropdown.Item>
              </NavDropdown>
            </RoleBasedComponent>

            <RoleBasedComponent allowedRoles={[ROLES.DRIVER]}>
              <Nav.Link as={Link} to="/driver/schedules" style={nl}><i className="fa-solid fa-steering-wheel me-1"></i>Lịch chạy xe</Nav.Link>
            </RoleBasedComponent>
            <RoleBasedComponent allowedRoles={[ROLES.PASSENGER]}>
              <Nav.Link as={Link} to="/bookings-history" style={nl}><i className="fa-solid fa-ticket me-1"></i>Vé của tôi</Nav.Link>
            </RoleBasedComponent>

            {user && (
              <Nav.Link as={Link} to="/notifi" style={{ ...nl, position:'relative' }}>
                <FaBell style={{ fontSize:'1rem' }} />
                {unreadCount > 0 && (
                  <span style={{
                    position:'absolute', top:'-1px', right:'-1px',
                    background:'linear-gradient(135deg, #ef4444, #dc2626)',
                    color:'#fff', fontSize:'0.62rem', fontWeight:700,
                    width:'16px', height:'16px', borderRadius:'50%',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    border:'2px solid #fff',
                  }}>{unreadCount}</span>
                )}
              </Nav.Link>
            )}
          </Nav>

          {/* Auth */}
          <Nav className="align-items-center" style={{ gap:'8px' }}>
            {user === null ? (
              <>
                <Nav.Link as={Link} to="/register" style={{
                  color:'#5c4f3a', fontWeight:600, padding:'8px 16px',
                  borderRadius:'10px', border:'1.5px solid rgba(0,0,0,0.1)',
                  fontSize:'0.88rem', transition:'all 0.25s ease', textDecoration:'none',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(232,131,42,0.07)'; e.currentTarget.style.borderColor='rgba(232,131,42,0.3)'; e.currentTarget.style.color='#e8832a'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(0,0,0,0.1)'; e.currentTarget.style.color='#5c4f3a'; }}
                >Đăng ký</Nav.Link>
                <Link to="/login" style={{
                  background:'linear-gradient(135deg, #e8832a, #f09a40)',
                  color:'#fff', fontWeight:700, padding:'9px 20px',
                  borderRadius:'10px', fontSize:'0.88rem', textDecoration:'none',
                  boxShadow:'0 4px 14px rgba(232,131,42,0.3)', transition:'all 0.3s ease', display:'inline-block',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 8px 22px rgba(232,131,42,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 14px rgba(232,131,42,0.3)'; }}
                >
                  <i className="fa-solid fa-right-to-bracket me-1"></i>Đăng nhập
                </Link>
              </>
            ) : (
              <NavDropdown title={
                <span style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  {user.avatar ? (
                    <Image src={user.avatar} alt="Avatar" roundedCircle width="32" height="32" style={{ border:'2px solid rgba(232,131,42,0.4)', objectFit:'cover' }} />
                  ) : (
                    <div style={{ width:'32px', height:'32px', background:'linear-gradient(135deg, #e8832a, #f09a40)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'0.85rem' }}>
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span style={{ color:'#1a1410', fontWeight:600, fontSize:'0.88rem' }}>{user.username}</span>
                </span>
              } id="user-dd" align="end">
                <div style={{ padding:'10px 14px 6px', borderBottom:'1px solid rgba(0,0,0,0.05)', marginBottom:'4px' }}>
                  <div style={{ color:'#9c8c78', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'1px', fontWeight:700 }}>Tài khoản</div>
                  <div style={{ color:'#1a1410', fontWeight:700, marginTop:'2px', fontSize:'0.9rem' }}>{user.username}</div>
                </div>
                <NavDropdown.Item as={Link} to="/profile" style={di}><i className="fa-solid fa-id-card me-2" style={{ color:'#3b82f6' }}></i>Thông tin tài khoản</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/bookings-history" style={di}><i className="fa-solid fa-ticket me-2" style={{ color:'#16a34a' }}></i>Lịch sử mua vé</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/payments-history" style={di}><i className="fa-solid fa-wallet me-2" style={{ color:'#d97706' }}></i>Lịch sử giao dịch</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-reviews" style={di}><i className="fa-solid fa-star me-2" style={{ color:'#d97706' }}></i>Đánh giá của tôi</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/change-password" style={di}><i className="fa-solid fa-key me-2" style={{ color:'#7c3aed' }}></i>Đổi mật khẩu</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => { dispatch({ type:"logout" }); nav("/login"); }} style={{ ...di, color:'#dc2626 !important' }}>
                  <i className="fa-solid fa-right-from-bracket me-2" style={{ color:'#dc2626' }}></i>
                  <span style={{ color:'#dc2626' }}>Đăng xuất</span>
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

// Styles
const nl = { color:'#5c4f3a', fontWeight:500, fontSize:'0.88rem', padding:'8px 12px', borderRadius:'8px', transition:'all 0.25s ease', textDecoration:'none' };
const di = { color:'#5c4f3a', padding:'9px 14px', borderRadius:'8px', fontSize:'0.88rem', fontWeight:500, transition:'all 0.2s ease' };

export default Header;
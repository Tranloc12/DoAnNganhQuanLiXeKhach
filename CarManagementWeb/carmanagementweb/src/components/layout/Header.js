import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Image, Nav, Navbar, NavDropdown, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyDispatchContext, MyUserContext } from "../../contexts/Contexts";
import RoleBasedComponent from "../common/RoleBasedComponent";
import { ROLES } from "../../utils/roleUtils";
import { FaBell } from 'react-icons/fa'; // Đã import biểu tượng chuông
import "../../index.css";

const Header = () => {
  const nav = useNavigate();
  const [kw, setKw] = useState("");
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  const [unreadCount, setUnreadCount] = useState(0); // State để lưu số thông báo chưa đọc

  // Hàm để tính toán số thông báo chưa đọc
  const calculateUnreadCount = () => {
    if (!user) return 0; // Không tính nếu chưa đăng nhập
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const count = storedNotifications.filter(notif => !notif.read).length;
    return count;
  };

  useEffect(() => {
    // Cập nhật số thông báo chưa đọc khi component mount
    setUnreadCount(calculateUnreadCount());

    // Lắng nghe sự kiện storage để cập nhật UI khi có thay đổi trong localStorage
    const handleStorageChange = (e) => {
      // Chỉ cập nhật nếu key 'notifications' thay đổi hoặc khi localStorage bị xóa (e.key === null)
      if (e.key === 'notifications' || e.key === null) {
        setUnreadCount(calculateUnreadCount());
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Dọn dẹp event listener khi component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]); // Chạy lại khi trạng thái user thay đổi





  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <Navbar.Brand as={Link} to="/">CAR</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto align-items-center">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>

            {/* Ai cũng thấy menu Quản lý xe */}


            {/* ✨ Thêm menu Danh sách chuyến đi */}
            <Nav.Link as={Link} to="/trips">Danh sách chuyến đi</Nav.Link>
           


            {/* Quản lý chỉ cho Admin và Manager */}
            <RoleBasedComponent allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF]}>
              {/* Thêm link cho TripManagement */}
              <Nav.Link as={Link} to="/trip-management">Quản lý chuyến đi</Nav.Link>
              {/* Thêm link cho BusManagement */}
              <Nav.Link as={Link} to="/bus-management">Quản lý Xe buýt</Nav.Link>

              {/* ✨ Thêm link cho ScheduleManagement */}
              <Nav.Link as={Link} to="/manager/schedules">Quản lý lịch trình</Nav.Link>

              {/* Thêm link cho UserManagement */}
              {/* <Nav.Link as={Link} to="/user-management">Quản lý Người dùng</Nav.Link> */}

              {/* Thêm link cho RoutesManagement */}
              <Nav.Link as={Link} to="/manager/routes">Quản lý tuyến đường</Nav.Link>

              <Nav.Link as={Link} to="/manager/reviews">Quản lý Đánh giá </Nav.Link>


            </RoleBasedComponent>

            <RoleBasedComponent allowedRoles={[ROLES.DRIVER]}>
              {/* Thêm link cho Driver */}
              <Nav.Link as={Link} to="/driver/schedules">
                Lịch Trình Chạy Xe
              </Nav.Link>

            </RoleBasedComponent>

            <RoleBasedComponent allowedRoles={[ROLES.STAFF]}>
              {/* ✨ Thêm link cho ScheduleManagement */}
              <Nav.Link as={Link} to="/manager/schedules">Quản lý lịch trình</Nav.Link>

            </RoleBasedComponent>

            <RoleBasedComponent allowedRoles={[ROLES.PASSENGER]}>
              {/* Thêm link cho Driver */}
              <Nav.Link as={Link} to="/my-reviews">
                Đánh giá của tôi
              </Nav.Link>
              <Nav.Link as={Link} to="/payments-history">
                Lịch sử giao dịch
              </Nav.Link>


            </RoleBasedComponent>


             <Nav.Link as={Link} to="/routes">Danh sách tuyến</Nav.Link>
            {/* ✨ Link Thông báo với biểu tượng chuông và số lượng chưa đọc */}
            {user && ( // Chỉ hiển thị nếu user đã đăng nhập
              <Nav.Link as={Link} to="/notifi" className="d-flex align-items-center position-relative">
                <FaBell className="me-1" />
                {unreadCount > 0 && (
                  <Badge pill bg="danger" className="ms-1 position-absolute top-0 start-100 translate-middle">
                    {unreadCount}
                    <span className="visually-hidden">thông báo chưa đọc</span>
                  </Badge>
                )}
              </Nav.Link>
            )}





            {
              user === null ? (
                <>
                  <Nav.Link
                    as={Link}
                    to="/register"
                    className="text-white fw-semibold"
                    style={{ transition: "color 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#dcdcdc")} // trắng xám nhạt khi hover
                    onMouseLeave={e => (e.currentTarget.style.color = "white")}
                  >
                    Đăng ký
                  </Nav.Link>

                  <Nav.Link
                    as={Link}
                    to="/login"
                    className="text-warning fw-semibold"
                    style={{ transition: "color 0.3s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#fff3cd")} // vàng nhạt khi hover
                    onMouseLeave={e => (e.currentTarget.style.color = "#ffc107")}
                  >
                    Đăng nhập
                  </Nav.Link>
                </>
              ) : (

                <>


                  <NavDropdown
                    title={
                      <>
                        <Image
                          src={user.avatar} // Sử dụng URL ảnh đại diện
                          alt="Avatar"
                          roundedCircle // Giúp ảnh có hình tròn
                          width="40"
                          height="40"
                          className="me-2" // Khoảng cách bên phải
                        />
                        <span className="fw-semibold">Chào {user.username}</span>
                      </>
                    }
                    id="user-nav-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/payments-history">
                      Lịch sử giao dịch
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/profile">
                      Thông tin tài khoản
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/my-reviews">
                      Đánh giá của tôi
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/bookings-history">
                      Lịch sử mua vé
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/change-password">
                      Đặt lại mật khẩu
                    </NavDropdown.Item>
                    <NavDropdown.Divider />

                  </NavDropdown>

                  <Button
                    onClick={() => {
                      dispatch({ type: "logout" });
                      nav("/login");
                    }}
                    variant="danger"
                    className="ms-2"
                  >
                    Đăng xuất
                  </Button>
                </>
              )
            }




          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
import { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MyDispatchContext, MyUserContext } from "../../contexts/Contexts";
import RoleBasedComponent from "../common/RoleBasedComponent";
import { ROLES } from "../../utils/roleUtils";
import "../../index.css";

const Header = () => {
  const nav = useNavigate();
  const [kw, setKw] = useState("");
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);





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
            <Nav.Link as={Link} to="/routes">Danh sách tuyến</Nav.Link>

            {/* Quản lý chỉ cho Admin và Manager */}
            <RoleBasedComponent allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
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
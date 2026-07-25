import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Alert, Spinner, Container } from 'react-bootstrap';
import { MyUserContext, AuthLoadingContext } from '../../contexts/Contexts';
import { hasAnyRole } from '../../utils/roleUtils';

/**
 * Component bảo vệ route dựa trên role
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component con
 * @param {Array<string>} props.allowedRoles - Danh sách roles được phép truy cập
 * @param {string} props.redirectTo - Đường dẫn redirect khi không có quyền (mặc định: "/")
 * @param {boolean} props.showAlert - Hiển thị alert thay vì redirect (mặc định: false)
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "/",
  showAlert = false
}) => {
  const user = useContext(MyUserContext);
  const isAuthLoading = useContext(AuthLoadingContext);

  // Hiển thị loading khi đang kiểm tra authentication
  if (isAuthLoading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p className="mt-2">Đang kiểm tra quyền truy cập...</p>
      </Container>
    );
  }

  // Nếu chưa đăng nhập
  if (!user) {
    if (showAlert) {
      return (
        <Alert variant="warning" className="text-center">
          <h5>Yêu cầu đăng nhập</h5>
          <p>Bạn cần đăng nhập để truy cập tính năng này.</p>
        </Alert>
      );
    }
    return <Navigate to="/login" replace />;
  }

  // Nếu không có role nào được chỉ định, chỉ cần đăng nhập
  if (allowedRoles.length === 0) {
    return children;
  }

  // Kiểm tra quyền truy cập
  if (!hasAnyRole(user, allowedRoles)) {
    if (showAlert) {
      return (
        <Alert variant="danger" className="text-center">
          <h5>Không có quyền truy cập</h5>
          <p>Bạn không có quyền truy cập vào tính năng này.</p>
          <small className="text-muted">
            Role hiện tại: {user.userRole} | Yêu cầu: {allowedRoles.join(', ')}
          </small>
        </Alert>
      );
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;

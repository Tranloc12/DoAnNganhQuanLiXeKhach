import { useContext } from 'react';
import { MyUserContext } from '../../contexts/Contexts';
import { hasAnyRole } from '../../utils/roleUtils';

/**
 * Component hiển thị nội dung dựa trên role
 * @param {Object} props
 * @param {React.ReactNode} props.children - Component con
 * @param {Array<string>} props.allowedRoles - Danh sách roles được phép xem
 * @param {React.ReactNode} props.fallback - Component hiển thị khi không có quyền
 * @param {boolean} props.requireAuth - Yêu cầu đăng nhập (mặc định: true)
 * @returns {React.ReactNode}
 */
const RoleBasedComponent = ({ 
  children, 
  allowedRoles = [], 
  fallback = null,
  requireAuth = true 
}) => {
  const user = useContext(MyUserContext);

  // Nếu yêu cầu đăng nhập nhưng chưa đăng nhập
  if (requireAuth && !user) {
    return fallback;
  }

  // Nếu không có role nào được chỉ định
  if (allowedRoles.length === 0) {
    return children;
  }

  // Kiểm tra quyền truy cập
  if (!hasAnyRole(user, allowedRoles)) {
    return fallback;
  }

  return children;
};

export default RoleBasedComponent;

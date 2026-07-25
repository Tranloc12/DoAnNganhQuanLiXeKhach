/**
 * Role-based access control utilities
 */

// Định nghĩa các roles
export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  MANAGER: 'ROLE_MANAGER',
  PASSENGER: 'ROLE_PASSENGER',
  DRIVER: 'ROLE_DRIVER',
  STAFF: 'ROLE_STAFF',

};

/**
 * Kiểm tra user có role cụ thể không
 * @param {Object} user - User object từ context
 * @param {string} requiredRole - Role cần kiểm tra
 * @returns {boolean}
 */
export const hasRole = (user, requiredRole) => {
  if (!user || !user.userRole) return false;
  return user.userRole === requiredRole;
};

/**
 * Kiểm tra user có một trong các roles không
 * @param {Object} user - User object từ context
 * @param {Array<string>} requiredRoles - Danh sách roles cần kiểm tra
 * @returns {boolean}
 */
export const hasAnyRole = (user, requiredRoles) => {
  if (!user || !user.userRole) return false;
  return requiredRoles.includes(user.userRole);
};

/**
 * Kiểm tra user có phải admin không
 * @param {Object} user - User object từ context
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return hasRole(user, ROLES.ADMIN);
};

/**
 * Kiểm tra user có phải manager không
 * @param {Object} user - User object từ context
 * @returns {boolean}
 */
export const isManager = (user) => {
  return hasRole(user, ROLES.MANAGER);
};

/**
 * Kiểm tra user có phải trainer không
 * @param {Object} user - User object từ context
 * @returns {boolean}
 */
export const isTrainer = (user) => {
  return hasRole(user, ROLES.TRAINER);
};


/**
 * Kiểm tra user có phải trainer không
 * @param {Object} user - User object từ context
 * @returns {boolean}
 */
export const isPassenger = (user) => {
  return hasRole(user, ROLES.PASSENGER);
};

/**
 * Kiểm tra user có phải trainer không
 * @param {Object} user - User object từ context
 * @returns {boolean}
 */
export const isDriver = (user) => {
  return hasRole(user, ROLES.DRIVER);
};

/**
 * Kiểm tra user có phải trainer không
 * @param {Object} user - User object từ context
 * @returns {boolean}
 */
export const isStaff = (user) => {
  return hasRole(user, ROLES.STAFF);
};

/**
 * Kiểm tra user có phải member không
 * @param {Object} user - User object từ context
 * @returns {boolean}
 */
export const isMember = (user) => {
  return hasRole(user, ROLES.MEMBER);
};

/**
 * Kiểm tra user có quyền admin hoặc manager không
 * @param {Object} user - User object từ context
 * @returns {boolean}
 */
export const isAdminOrManager = (user) => {
  return hasAnyRole(user, [ROLES.ADMIN, ROLES.MANAGER]);
};

/**
 * Lấy tên hiển thị của role
 * @param {string} role - Role string
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return 'Quản trị viên';
    case ROLES.MANAGER:
      return 'Quản lý';
    case ROLES.TRAINER:
      return 'Huấn luyện viên';
    case ROLES.MEMBER:
      return 'Thành viên';
    case ROLES.DRIVER:
      return 'Tài Xế';
    case ROLES.PASSENGER:
      return 'Hành Khách';
    case ROLES.STAFF:
      return 'Nhân Viên';
    default:
      return 'Không xác định';
  }
};

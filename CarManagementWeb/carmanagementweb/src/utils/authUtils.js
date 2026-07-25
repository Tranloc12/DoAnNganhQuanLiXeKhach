import cookie from 'react-cookies';

/**
 * Kiểm tra token có hợp lệ không
 * @param {string} token 
 * @returns {boolean}
 */
export const isValidToken = (token) => {
    return token && typeof token === 'string' && token.trim() !== '';
};

/**
 * Xóa token không hợp lệ khỏi cookie
 */
export const clearInvalidToken = () => {
    try {
        cookie.remove('token', { path: '/' });
        console.log('Invalid token cleared from cookies');
    } catch (error) {
        console.error('Error clearing token:', error);
    }
};

/**
 * Lấy token từ cookie và kiểm tra tính hợp lệ
 * @returns {string|null}
 */
export const getValidToken = () => {
    try {
        const token = cookie.load('token');
        if (isValidToken(token)) {
            return token;
        }
        // Nếu token không hợp lệ, xóa nó
        clearInvalidToken();
        return null;
    } catch (error) {
        console.error('Error getting token:', error);
        clearInvalidToken();
        return null;
    }
};

/**
 * Xử lý lỗi authentication và cleanup
 * @param {Error} error 
 * @param {Function} dispatch 
 */
export const handleAuthError = (error, dispatch) => {
    console.error('Authentication error:', error);
    clearInvalidToken();
    if (dispatch) {
        dispatch({ type: 'logout' });
    }
};

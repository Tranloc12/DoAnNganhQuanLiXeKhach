import cookie from 'react-cookies'

export default (current, action) => {
    switch (action.type) {
        case "login":
            return action.payload;
        case "logout":
            // Xóa token với path để đảm bảo xóa hoàn toàn
            cookie.remove('token', { path: '/' });
            return null;
        default:
            return current;
    }
}
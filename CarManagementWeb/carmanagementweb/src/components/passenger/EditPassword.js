import React, { useState, useRef } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { authApis, endpoints } from '../../configs/Apis';

const EditPassword = ({ onPasswordChanged }) => {
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const messageTimeoutRef = useRef(null);

    const handlePasswordFormChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm({ ...passwordForm, [name]: value });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // ⭐ Kiểm tra các trường có bị trống không
        if (!passwordForm.oldPassword || !passwordForm.newPassword) {
            setMessage({ type: 'danger', text: 'Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới.' });
            setLoading(false);
            return;
        }

        try {
            const api = authApis();
            const res = await api.patch(endpoints.changePassword, passwordForm);
            
            setMessage({ type: 'success', text: res.data.message });
            setPasswordForm({ oldPassword: '', newPassword: '' }); // Reset form
            
            // ⭐ Gọi hàm callback nếu có để thông báo cho component cha
            if (onPasswordChanged) {
                onPasswordChanged();
            }

        } catch (err) {
            console.error("❌ Lỗi khi đổi mật khẩu:", err);
            const errorMessage = err.response?.data?.error || 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
            setMessage({ type: 'danger', text: `Lỗi: ${errorMessage}` });
        } finally {
            setLoading(false);
            
            // Ẩn thông báo sau 5 giây
            if (messageTimeoutRef.current) {
                clearTimeout(messageTimeoutRef.current);
            }
            messageTimeoutRef.current = setTimeout(() => {
                setMessage({ type: '', text: '' });
            }, 5000);
        }
    };

    return (
        <div className="edit-password-container my-4">
            <h4 className="mb-3">Đổi mật khẩu</h4>
            
            {message.text && (
                <Alert variant={message.type === 'success' ? 'success' : 'danger'}>
                    {message.text}
                </Alert>
            )}

            <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu cũ</Form.Label>
                    <Form.Control
                        type="password"
                        name="oldPassword"
                        value={passwordForm.oldPassword}
                        onChange={handlePasswordFormChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control
                        type="password"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordFormChange}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? (
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                        />
                    ) : (
                        "Xác nhận đổi mật khẩu"
                    )}
                </Button>
            </Form>
        </div>
    );
};

export default EditPassword;
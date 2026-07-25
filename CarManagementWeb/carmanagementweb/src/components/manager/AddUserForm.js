import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import styled from "styled-components";

// Styled components (được định nghĩa trực tiếp trong file này)
const StyledModalHeader = styled(Modal.Header)`
    background-color: #f0f2f5;
    border-bottom: 1px solid #e0e0e0;
    padding: 20px 30px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
`;

const StyledModalTitle = styled(Modal.Title)`
    color: #343a40;
    font-weight: 700;
    font-size: 1.8em;
`;

const StyledModalBody = styled(Modal.Body)`
    padding: 30px;
`;

const StyledFormLabel = styled(Form.Label)`
    font-weight: 600;
    color: #495057;
    margin-bottom: 8px;
`;

const StyledFormControl = styled(Form.Control)`
    border-radius: 8px;
    padding: 12px 15px;
    font-size: 1em;
    border: 1px solid #ced4da;
    transition: all 0.3s ease;

    &:focus {
        border-color: #e75702;
        box-shadow: 0 0 0 0.25rem rgba(231,87,2,0.25);
    }
`;

const StyledFormSelect = styled(Form.Select)`
    border-radius: 8px;
    padding: 12px 15px;
    font-size: 1em;
    border: 1px solid #ced4da;
    transition: all 0.3s ease;

    &:focus {
        border-color: #e75702;
        box-shadow: 0 0 0 0.25rem rgba(231,87,2,0.25);
    }
`;

const StyledSubmitButton = styled(Button)`
    background-color: #e75702 !important;
    border-color: #e75702 !important;
    color: #ffffff;
    border-radius: 10px;
    padding: 15px 30px;
    font-size: 1.1em;
    font-weight: 700;
    margin-top: 25px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    box-shadow: 0 6px 15px rgba(231, 87, 2, 0.4);

    &:hover {
        background-color: #d64c00 !important;
        border-color: #d64c00 !important;
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(231, 87, 2, 0.6);
    }
    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 5px rgba(231, 87, 2, 0.3);
    }
`;

const AddUserForm = ({ show, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        role: 'PASSENGER', // Mặc định là PASSENGER
        active: true, // Mặc định là hoạt động
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <StyledModalHeader closeButton>
                <StyledModalTitle>Thêm Người dùng mới</StyledModalTitle>
            </StyledModalHeader>
            <StyledModalBody>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <StyledFormLabel>Tên đăng nhập:</StyledFormLabel>
                        <StyledFormControl
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <StyledFormLabel>Mật khẩu:</StyledFormLabel>
                        <StyledFormControl
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <StyledFormLabel>Email:</StyledFormLabel>
                        <StyledFormControl
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <StyledFormLabel>Số điện thoại:</StyledFormLabel>
                        <StyledFormControl
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <StyledFormLabel>Vai trò:</StyledFormLabel>
                        <StyledFormSelect
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="PASSENGER">PASSENGER</option>
                            <option value="DRIVER">DRIVER</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="ADMIN">ADMIN</option>
                        </StyledFormSelect>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="checkbox"
                            label="Hoạt động"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                            className="text-muted"
                        />
                    </Form.Group>
                    <StyledSubmitButton type="submit" className="w-100">
                        Thêm mới
                    </StyledSubmitButton>
                </Form>
            </StyledModalBody>
        </Modal>
    );
};

export default AddUserForm;

import React, { useContext } from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import { FaHeadset, FaUser } from 'react-icons/fa';
import { useChat } from '../../contexts/ChatContext';
import { MyUserContext } from '../../contexts/Contexts';
import './NewChatModal.css';

const NewChatModal = ({ show, onHide }) => {
  const { availableUsers, startNewConversation } = useChat();
  const user = useContext(MyUserContext);

  const handleStartChat = (targetUser) => {
    startNewConversation(targetUser);
    onHide();
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'ROLE_PASSENGER':
        return 'Khách Hàng';
      case 'ROLE_STAFF':
        return 'Nhân Viên';
      case 'ROLE_DRIVER':
        return 'Tài Xế';
      case 'ROLE_MANAGER':
        return 'Quản lý';
      case 'ROLE_ADMIN':
        return 'Admin';
      default:
        return '';
    }
  };

  const getAvailableOptions = () => {
    const options = [];

    // Support option luôn có sẵn
    if (user?.userRole === 'ROLE_PASSENGER') {
      options.push({
        id: 'support',
        name: 'Hỗ trợ khách hàng',
        role: 'ROLE_MANAGER',
        isSupport: true,
        description: 'Gửi yêu cầu hỗ trợ đến quản lý'
      });
    } else if (user?.userRole === 'ROLE_DRIVER') {
      options.push({
        id: 'support',
        name: 'Hỗ trợ tài xế',
        role: 'ROLE_MANAGER',
        isSupport: true,
        description: 'Gửi yêu cầu hỗ trợ đến quản lý'
      });
    } else if (user?.userRole === 'ROLE_STAFF') {
      options.push({
        id: 'support',
        name: 'Hỗ trợ nhân viên',
        role: 'ROLE_MANAGER',
        isSupport: true,
        description: 'Gửi yêu cầu hỗ trợ đến quản lý'
      });
    }

    // Thêm các users khác từ availableUsers
    availableUsers.forEach(availableUser => {
      if (!availableUser.isSupport) {
        options.push(availableUser);
      }
    });

    return options;
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Bắt đầu cuộc trò chuyện mới</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="new-chat-options">
          {getAvailableOptions().length === 0 ? (
            <div className="no-options">
              <p>Hiện tại không có tùy chọn chat nào khả dụng.</p>
            </div>
          ) : (
            <ListGroup variant="flush">
              {getAvailableOptions().map((option) => (
                <ListGroup.Item
                  key={option.id}
                  className="chat-option-item"
                  onClick={() => handleStartChat(option)}
                >
                  <div className="option-avatar">
                    {option.isSupport ? <FaHeadset /> : <FaUser />}
                  </div>

                  <div className="option-content">
                    <div className="option-name">
                      {option.name}
                      {option.role && !option.isSupport && (
                        <span className="option-role">
                          ({getRoleDisplayName(option.role)})
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <div className="option-description">
                        {option.description}
                      </div>
                    )}
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Hủy
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewChatModal;

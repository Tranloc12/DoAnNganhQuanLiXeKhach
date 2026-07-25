import React, { useContext } from 'react';
import { MyUserContext } from '../../contexts/Contexts';
import './ChatMessage.css';

const ChatMessage = ({ message }) => {
  const user = useContext(MyUserContext);
  const isOwnMessage = message.senderId === user?.id?.toString();

  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
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

  return (
    <div className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}>
      {!isOwnMessage && (
        <div className="message-sender">
          <span className="sender-name">{message.senderName}</span>
          <span className="sender-role">({getRoleDisplayName(message.senderRole)})</span>
        </div>
      )}

      <div className="message-bubble">
        <div className="message-content">
          {message.message}
        </div>
        <div className="message-time">
          {formatTime(message.timestamp)}
          {isOwnMessage && (
            <span className={`message-status ${message.read ? 'read' : 'sent'}`}>
              {message.read ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

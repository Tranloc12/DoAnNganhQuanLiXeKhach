import React, { useContext } from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import { FaUser, FaHeadset } from 'react-icons/fa';
import { useChat } from '../../contexts/ChatContext';
import { MyUserContext } from '../../contexts/Contexts';
import './ChatList.css';

const ChatList = () => {
  const { conversations, selectConversation } = useChat();
  const user = useContext(MyUserContext);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Vừa xong';
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  const getConversationInfo = (conversation) => {
    if (conversation.id.startsWith('support_')) {
      // Cho support conversations, hiển thị thông tin của người cần hỗ trợ
      const participants = conversation.participants || {};
      const supportSeeker = Object.entries(participants)
        .filter(([id, participant]) => participant.role !== 'ROLE_MANAGER')
        .map(([_, participant]) => participant)[0];

      if (supportSeeker) {
        return {
          name: `${supportSeeker.name} (${getRoleDisplayName(supportSeeker.role)})`,
          role: supportSeeker.role,
          icon: <FaHeadset />,
          isSupport: true
        };
      }

      return {
        name: 'Yêu cầu hỗ trợ',
        icon: <FaHeadset />,
        isSupport: true
      };
    }

    // Lấy thông tin từ participants (trừ current user)
    const participants = conversation.participants || {};
    const otherParticipants = Object.entries(participants)
      .filter(([id, _]) => id !== user?.id?.toString())
      .map(([_, participant]) => participant);

    if (otherParticipants.length > 0) {
      const participant = otherParticipants[0];
      return {
        name: participant.name,
        role: participant.role,
        icon: <FaUser />,
        isSupport: false
      };
    }

    return {
      name: 'Cuộc trò chuyện',
      icon: <FaUser />,
      isSupport: false
    };
  };

  const getUnreadCount = (conversation) => {
    if (!conversation.messages) return 0;

    return Object.values(conversation.messages).filter(
      message => message.senderId !== user?.id?.toString() && !message.read
    ).length;
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

  // Filter conversations based on user role
  const getFilteredConversations = () => {
    if (user?.userRole === 'ROLE_MANAGER') {
      // Managers only see support conversations with single participants waiting for support
      return conversations.filter(conversation => {
        // Must be a support conversation
        if (!conversation.id.startsWith('support_')) {
          return false;
        }

        // Count participants (excluding the manager)
        const participants = conversation.participants || {};
        const nonManagerParticipants = Object.entries(participants)
          .filter(([id, participant]) => participant.role !== 'ROLE_MANAGER')
          .length;

        // Only show conversations with exactly 1 non-manager participant
        return nonManagerParticipants === 1;
      });
    }

    // For other roles, show all conversations
    return conversations;
  };

  const filteredConversations = getFilteredConversations();

  if (filteredConversations.length === 0) {
    const emptyMessage = user?.userRole === 'ROLE_MANAGER'
      ? 'Chưa có yêu cầu hỗ trợ nào'
      : 'Chưa có cuộc trò chuyện nào';

    const emptyDescription = user?.userRole === 'ROLE_MANAGER'
      ? 'Các yêu cầu hỗ trợ từ khách hàng và tài xế sẽ hiển thị ở đây'
      : 'Bắt đầu cuộc trò chuyện mới bằng cách nhấn nút + ở trên';

    return (
      <div className="empty-chat-list">
        <div className="empty-icon">
          <FaUser size={48} />
        </div>
        <h5>{emptyMessage}</h5>
        <p>{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <ListGroup variant="flush">
        {filteredConversations.map((conversation) => {
          const info = getConversationInfo(conversation);
          const unreadCount = getUnreadCount(conversation);

          return (
            <ListGroup.Item
              key={conversation.id}
              className="chat-list-item"
              onClick={() => selectConversation(conversation)}
            >
              <div className="conversation-avatar">
                {info.icon}
              </div>

              <div className="conversation-content">
                <div className="conversation-header">
                  <div className="conversation-name">
                    {info.name}
                    {info.role && !info.isSupport && (
                      <span className="conversation-role">
                        ({getRoleDisplayName(info.role)})
                      </span>
                    )}
                  </div>
                  <div className="conversation-time">
                    {formatTime(conversation.lastMessageTime)}
                  </div>
                </div>

                <div className="conversation-preview">
                  <div className="last-message">
                    {conversation.lastMessage || 'Chưa có tin nhắn'}
                  </div>
                  {unreadCount > 0 && (
                    <Badge bg="danger" className="unread-badge">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
};

export default ChatList;

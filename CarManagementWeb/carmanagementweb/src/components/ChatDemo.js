import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { MyUserContext } from '../contexts/Contexts';
import { useChat } from '../contexts/ChatContext';

const ChatDemo = () => {
  const user = useContext(MyUserContext);
  const { openChat, startNewConversation, conversations, unreadCount } = useChat();

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Bạn cần đăng nhập để sử dụng tính năng chat.
        </Alert>
      </Container>
    );
  }

  const handleStartSupportChat = () => {
    const supportUser = {
      id: 'support',
      name: user.userRole === 'ROLE_PASSENGER' ? 'Hỗ trợ khách hàng' : 'Hỗ trợ nhân viên',
      role: 'ROLE_MANAGER',
      isSupport: true
    };
    startNewConversation(supportUser);
  };

  const handleStartDemoChat = () => {
    const demoUser = {
      id: 'demo_user',
      name: 'Demo User',
      role: user.userRole === 'ROLE_PASSENGER' ? 'ROLE_STAFF' : 'ROLE_MANAGER',
      isSupport: false
    };
    startNewConversation(demoUser);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <Card.Header>
              <h4>🔥 Chat System Demo</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h5>Thông tin người dùng:</h5>
                <p><strong>Tên:</strong> {user.username}</p>
                <p><strong>Vai trò:</strong> {user.userRole}</p>
                <p><strong>ID:</strong> {user.id}</p>
              </div>

              <div className="mb-4">
                <h5>Trạng thái Chat:</h5>
                <p><strong>Số cuộc trò chuyện:</strong> {conversations.length}</p>
                <p><strong>Tin nhắn chưa đọc:</strong>
                  <span className={`ms-2 badge ${unreadCount > 0 ? 'bg-danger' : 'bg-secondary'}`}>
                    {unreadCount}
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <h5>Hướng dẫn sử dụng:</h5>
                <ol>
                  <li>Nhấn vào nút chat ở góc dưới bên phải để mở cửa sổ chat</li>
                  <li>Nhấn nút "+" để bắt đầu cuộc trò chuyện mới</li>
                  <li>Chọn người muốn chat hoặc gửi yêu cầu hỗ trợ</li>
                  <li>Gõ tin nhắn và nhấn Enter hoặc nút gửi</li>
                  <li>Sử dụng emoji picker để thêm biểu tượng cảm xúc</li>
                  <li>Nhận thông báo khi có tin nhắn mới</li>
                </ol>
              </div>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  onClick={openChat}
                  size="lg"
                >
                  🚀 Mở Chat
                </Button>

                <Button
                  variant="success"
                  onClick={handleStartSupportChat}
                  size="lg"
                >
                  💬 Chat với Hỗ trợ
                </Button>

                <Button
                  variant="info"
                  onClick={handleStartDemoChat}
                  size="lg"
                >
                  🎮 Demo Chat
                </Button>
              </div>

              <div className="mt-4">
                <Alert variant="info">
                  <h6>💡 Tính năng Chat:</h6>
                  <ul className="mb-0">
                    <li>✅ Realtime messaging với Firebase</li>
                    <li>✅ Giao diện giống Messenger</li>
                    <li>✅ Thông báo tin nhắn mới</li>
                    <li>✅ Emoji picker</li>
                    <li>✅ Auto-scroll tin nhắn</li>
                    <li>✅ Responsive design</li>
                    <li>✅ Support chat cho member/trainer → manager</li>
                    <li>✅ Chat giữa member ↔ trainer</li>
                  </ul>
                </Alert>
              </div>

              {conversations.length > 0 && (
                <div className="mt-4">
                  <h6>Cuộc trò chuyện hiện tại:</h6>
                  {conversations.map((conv, index) => (
                    <div key={conv.id} className="border rounded p-2 mb-2">
                      <small className="text-muted">ID: {conv.id}</small>
                      <br />
                      <small>Tin nhắn cuối: {conv.lastMessage || 'Chưa có tin nhắn'}</small>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatDemo;

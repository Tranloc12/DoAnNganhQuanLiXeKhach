import React, { useState, useContext, useEffect, useRef } from 'react';
import { Card, Button, Form, InputGroup } from 'react-bootstrap';
import { FaTimes, FaMinus, FaPaperPlane, FaUser, FaPlus } from 'react-icons/fa';
import { useChat } from '../../contexts/ChatContext';
import { MyUserContext } from '../../contexts/Contexts';
import ChatMessage from './ChatMessage';
import ChatList from './ChatList';
import NewChatModal from './NewChatModal';
import EmojiPicker from './EmojiPicker';
import './ChatPopup.css';

const ChatPopup = () => {
  const {
    isOpen,
    closeChat,
    activeConversation,
    messages,
    sendMessage,
    loading,
    selectConversation
  } = useChat();

  const user = useContext(MyUserContext);
  const [messageText, setMessageText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() && !loading) {
      await sendMessage(messageText);
      setMessageText('');
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleEmojiSelect = (emoji) => {
    setMessageText(prev => prev + emoji);
  };

  const getConversationTitle = (conversation) => {
    if (!conversation) return 'Chat';

    if (conversation.id.startsWith('support_')) {
      return 'Hỗ trợ khách hàng';
    }

    // Lấy tên từ participants (trừ current user)
    const participants = conversation.participants || {};
    const participantNames = Object.values(participants)
      .map(p => p.name)
      .filter(name => name !== user?.username);

    return participantNames.length > 0 ? participantNames.join(', ') : 'Chat';
  };

  return (
    <>
      <div className={`chat-popup ${isMinimized ? 'minimized' : ''}`}>
        <Card className="chat-card">
          {/* Header */}
          <Card.Header className="chat-header">
            <div className="chat-header-content">
              {activeConversation ? (
                <>
                  <Button
                    variant="link"
                    className="back-button"
                    onClick={() => selectConversation(null)}
                  >
                    ←
                  </Button>
                  <div className="chat-title">
                    <FaUser className="me-2" />
                    {getConversationTitle(activeConversation)}
                  </div>
                </>
              ) : (
                <>
                  <div className="chat-title">
                    <FaUser className="me-2" />
                    {user?.userRole === 'ROLE_MANAGER' ? 'Yêu cầu hỗ trợ' : 'Tin nhắn'}
                  </div>
                  {user?.userRole !== 'ROLE_MANAGER' && (
                    <Button
                      variant="link"
                      className="new-chat-button"
                      onClick={() => setShowNewChatModal(true)}
                    >
                      <FaPlus />
                    </Button>
                  )}
                </>
              )}
            </div>
            <div className="chat-controls">
              <Button
                variant="link"
                className="control-button"
                onClick={handleMinimize}
              >
                <FaMinus />
              </Button>
              <Button
                variant="link"
                className="control-button"
                onClick={closeChat}
              >
                <FaTimes />
              </Button>
            </div>
          </Card.Header>

          {/* Body */}
          {!isMinimized && (
            <Card.Body className="chat-body">
              {activeConversation ? (
                <>
                  {/* Messages */}
                  <div className="messages-container">
                    {messages.length === 0 ? (
                      <div className="no-messages">
                        <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</p>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <ChatMessage key={message.id} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Input */}
                  <Form onSubmit={handleSendMessage} className="message-form">
                    <InputGroup>
                      <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                      <Form.Control
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        disabled={loading}
                      />
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={!messageText.trim() || loading}
                      >
                        <FaPaperPlane />
                      </Button>
                    </InputGroup>
                  </Form>
                </>
              ) : (
                <ChatList />
              )}
            </Card.Body>
          )}
        </Card>
      </div>

      <NewChatModal
        show={showNewChatModal}
        onHide={() => setShowNewChatModal(false)}
      />
    </>
  );
};

export default ChatPopup;

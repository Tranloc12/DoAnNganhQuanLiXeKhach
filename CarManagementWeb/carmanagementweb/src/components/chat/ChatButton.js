import { Button, Badge } from 'react-bootstrap';
import { FaComments } from 'react-icons/fa';
import { useChat } from '../../contexts/ChatContext';
import './ChatButton.css';

const ChatButton = () => {
  const { toggleChat, unreadCount } = useChat();

  return (
    <div className="chat-button-container">
      <Button
        className="chat-button"
        onClick={toggleChat}
        variant="primary"
      >
        <FaComments size={24} />
        {unreadCount > 0 && (
          <Badge
            bg="danger"
            className="chat-badge"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default ChatButton;

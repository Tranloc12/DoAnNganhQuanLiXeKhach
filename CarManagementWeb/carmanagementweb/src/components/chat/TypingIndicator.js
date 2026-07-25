import React from 'react';
import './TypingIndicator.css';

const TypingIndicator = ({ senderName }) => {
  return (
    <div className="typing-indicator">
      <div className="typing-bubble">
        <span className="typing-text">{senderName} đang nhập...</span>
        <div className="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

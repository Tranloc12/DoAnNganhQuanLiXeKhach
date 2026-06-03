import React from 'react';
import './OnlineStatus.css';

const OnlineStatus = ({ isOnline = false, size = 'small' }) => {
  return (
    <div className={`online-status ${size} ${isOnline ? 'online' : 'offline'}`}>
      <div className="status-dot"></div>
    </div>
  );
};

export default OnlineStatus;

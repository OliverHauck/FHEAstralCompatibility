import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import './Notification.css';

const Notification = () => {
  const { notification, showNotification } = useWeb3();

  if (!notification.show) return null;

  const handleClose = () => {
    showNotification('', 'info'); // This will trigger state update to hide notification
  };

  return (
    <div className={`notification notification-${notification.type}`}>
      <span>{notification.message}</span>
      <button onClick={handleClose}>&times;</button>
    </div>
  );
};

export default Notification;

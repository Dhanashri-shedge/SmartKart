import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('join-room', `user_${user.id}`);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      // Listen for notifications
      newSocket.on('new-order', (data) => {
        addNotification('New order received', 'info', data);
      });

      newSocket.on('order-status-updated', (data) => {
        addNotification(`Order ${data.status}`, 'success', data);
      });

      newSocket.on('payment-received', (data) => {
        addNotification('Payment received', 'success', data);
      });

      newSocket.on('new-order-group', (data) => {
        addNotification('New bulk order group', 'info', data);
      });

      newSocket.on('delivery-scheduled', (data) => {
        addNotification('Delivery scheduled', 'info', data);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const addNotification = (message, type, data) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      data,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]); // Keep last 10 notifications
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const value = {
    socket,
    notifications,
    addNotification,
    removeNotification,
    clearNotifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import {
  setSocketMessageHandler,
  clearSocketMessageHandler,
} from '../service/socket';
import { useAuth } from './AuthContext';

const MAX_MESSAGES = 100;

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [socketMessages, setSocketMessages] = useState([]);

  const addMessage = useCallback((event, data) => {
    const payload = Array.isArray(data) ? data[0] : data;
    const entry = {
      event,
      data: payload,
      timestamp: new Date().toISOString(),
    };
    console.log('[Socket] Message received:', event, payload);
    setSocketMessages(prev => {
      const next = [entry, ...prev];
      return next.slice(0, MAX_MESSAGES);
    });
  }, []);

  const clearMessages = useCallback(() => {
    setSocketMessages([]);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setSocketMessages([]);
      clearSocketMessageHandler();
      return;
    }

    setSocketMessageHandler((event, args) => {
      addMessage(event, args);
    });
    console.log(
      '[Socket] Message handler registered (captures all events including appointmentUpdated)',
    );

    return () => {
      clearSocketMessageHandler();
      console.log('[Socket] Stopped listening for events');
    };
  }, [isAuthenticated, addMessage]);

  const value = {
    socketMessages,
    clearMessages,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocketMessages = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketMessages must be used within a SocketProvider');
  }
  return context;
};

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('CONNECTING'); // 'CONNECTED', 'CONNECTING', 'DISCONNECTED'
  const [lastPing, setLastPing] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket.io] Connected to CrisisSync real-time hub:', socket.id);
      setIsConnected(true);
      setConnectionStatus('CONNECTED');
      setLastPing(new Date());
    });

    socket.on('disconnect', (reason) => {
      console.warn('[Socket.io] Disconnected from server:', reason);
      setIsConnected(false);
      setConnectionStatus('DISCONNECTED');
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket.io] Connection error:', err.message);
      setIsConnected(false);
      setConnectionStatus('RECONNECTING');
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`[Socket.io] Reconnected after ${attemptNumber} attempts`);
      setIsConnected(true);
      setConnectionStatus('CONNECTED');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = (roomName) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join:room', roomName);
    }
  };

  const leaveRoom = (roomName) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave:room', roomName);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        connectionStatus,
        lastPing,
        joinRoom,
        leaveRoom
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

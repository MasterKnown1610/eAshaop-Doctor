import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SOCKET_URL } from './config';

const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

let socket = null;
let messageHandler = null;

export const setSocketMessageHandler = handler => {
  messageHandler = handler;
  console.log('[Socket] Message handler', handler ? 'registered' : 'cleared');
};

export const clearSocketMessageHandler = () => {
  messageHandler = null;
};

/** Emit joinUser so server adds this socket to the user's room (required for user-specific events e.g. appointmentUpdated) */
const joinRoom = async () => {
  try {
    const raw = await AsyncStorage.getItem(USER_DATA_KEY);
    const userData = raw ? JSON.parse(raw) : null;
    const userId = userData?.user?.id ?? userData?.doctor?.id;
    if (userId && socket) {
      socket.emit('joinUser', userId);
      console.log('[Socket] Joined user room:', userId);
    } else {
      console.log('[Socket] No user id found, skip joinUser');
    }
  } catch (e) {
    console.log('[Socket] joinRoom error:', e?.message);
  }
};

export const connectSocket = async () => {
  console.log('[Socket] connectSocket() called, URL:', SOCKET_URL);
  if (socket?.connected) {
    console.log('[Socket] Already connected, reusing socket. id:', socket.id);
    return socket;
  }
  if (socket) {
    console.log(
      '[Socket] Existing socket found but not connected, reconnecting',
    );
  }

  let token = null;
  try {
    token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (e) {
    console.log('[Socket] Failed to read auth token:', e?.message);
  }

  if (token) {
    console.log('[Socket] Connecting with auth token');
  } else {
    console.log('[Socket] No auth token found, connecting without token');
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    auth: {
      token: token || '',
    },
  });

  socket.onAny((event, ...args) => {
    console.log('[Socket] onAny:', event, args?.length);
    messageHandler?.(event, args);
  });

  socket.on('connect', () => {
    console.log('[Socket] Connected. id:', socket?.id);
    joinRoom();
  });

  socket.on('reconnect', () => {
    console.log('[Socket] Reconnected. id:', socket?.id);
    joinRoom();
  });

  socket.on('disconnect', reason => {
    console.log('[Socket] Disconnected. reason:', reason);
  });

  socket.on('connect_error', err => {
    console.log('[Socket] Connect error:', err?.message ?? err);
  });

  socket.on('reconnect_attempt', attempt => {
    console.log('[Socket] Reconnect attempt:', attempt);
  });

  socket.on('reconnect_error', err => {
    console.log('[Socket] Reconnect error:', err?.message ?? err);
  });

  socket.on('reconnect_failed', () => {
    console.log('[Socket] Reconnect failed');
  });

  console.log('[Socket] Socket instance created, connecting...');
  return socket;
};

export const disconnectSocket = () => {
  console.log('[Socket] disconnectSocket() called');
  messageHandler = null;
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log('[Socket] Disconnected and cleared');
  } else {
    console.log('[Socket] No socket to disconnect');
  }
};

export const getSocket = () => socket;

export const isSocketConnected = () => socket?.connected ?? false;

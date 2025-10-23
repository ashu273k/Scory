import { io } from 'socket.io-client';

let socket = null;

export const initializeSocket = (token) => {
  if (socket?.connected) {
    return socket;
  }

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

  socket = io(SOCKET_URL, {
    auth: { token },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  // Connection event handlers
  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error.message);
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn('Socket not initialized. Call initializeSocket first.');
    return null;
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected manually');
  }
};

// Game room functions
export const joinGameRoom = (gameId) => {
  const s = getSocket();
  if (s) {
    s.emit('joinGame', gameId);
    console.log('Joined game room:', gameId);
  }
};

export const leaveGameRoom = (gameId) => {
  const s = getSocket();
  if (s) {
    s.emit('leaveGame', gameId);
    console.log('Left game room:', gameId);
  }
};

export const emitScoreUpdate = (gameId, scoreData) => {
  const s = getSocket();
  if (s) {
    s.emit('scoreUpdate', { gameId, ...scoreData });
  }
};

// Subscribe to game events
export const subscribeToGameEvents = (callbacks) => {
  const s = getSocket();
  if (!s) return () => {};

  const events = {
    scoreUpdated: callbacks.onScoreUpdated,
    userJoined: callbacks.onUserJoined,
    userLeft: callbacks.onUserLeft,
    gameStatusUpdated: callbacks.onGameStatusUpdated,
    userConnected: callbacks.onUserConnected,
    userDisconnected: callbacks.onUserDisconnected,
  };

  // Register event listeners
  Object.entries(events).forEach(([event, handler]) => {
    if (handler) {
      s.on(event, handler);
    }
  });

  // Return cleanup function
  return () => {
    Object.keys(events).forEach((event) => {
      s.off(event);
    });
  };
};
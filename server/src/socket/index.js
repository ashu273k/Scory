import { Server } from 'socket.io';
import { verifyAccessToken } from '../utils/generateToken.js';

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.id})`);

    // Join game room
    socket.on('joinGame', (gameId) => {
      socket.join(gameId);
      socket.to(gameId).emit('userConnected', {
        userId: socket.userId,
        socketId: socket.id,
      });
      console.log(`User ${socket.userId} joined game ${gameId}`);
    });

    // Leave game room
    socket.on('leaveGame', (gameId) => {
      socket.leave(gameId);
      socket.to(gameId).emit('userDisconnected', {
        userId: socket.userId,
      });
      console.log(`User ${socket.userId} left game ${gameId}`);
    });

    // Real-time score update (optimistic UI)
    socket.on('scoreUpdate', (data) => {
      const { gameId, currentScore, eventType, eventData } = data;
      
      socket.to(gameId).emit('scoreUpdated', {
        gameId,
        currentScore,
        eventType,
        eventData,
        userId: socket.userId,
        timestamp: new Date().toISOString(),
      });
    });

    // Typing indicator (for chat features - future)
    socket.on('typing', (gameId) => {
      socket.to(gameId).emit('userTyping', { userId: socket.userId });
    });

    // Disconnect
    socket.on('disconnect', (reason) => {
      console.log(`❌ User disconnected: ${socket.userId} - Reason: ${reason}`);
    });

    // Error handler
    socket.on('error', (error) => {
      console.error(`Socket error for user ${socket.userId}:`, error);
    });
  });

  return io;
};

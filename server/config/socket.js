import socketIo from 'socket.io';
import { verifyAccessToken } from '../utils/generateToken';

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true
    }
  });

  // Authentication middleware for Socket.io
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join game room
    socket.on('joinGame', async (gameId) => {
      socket.join(gameId);
      socket.to(gameId).emit('userJoined', { 
        userId: socket.userId 
      });
      console.log(`User ${socket.userId} joined game ${gameId}`);
    });

    // Leave game room
    socket.on('leaveGame', (gameId) => {
      socket.leave(gameId);
      socket.to(gameId).emit('userLeft', { 
        userId: socket.userId 
      });
      console.log(`User ${socket.userId} left game ${gameId}`);
    });

    // Score update
    socket.on('scoreUpdate', async (data) => {
      const { gameId, newScore, eventType, eventData } = data;
      
      // Broadcast to all users in the game room except sender
      socket.to(gameId).emit('scoreUpdated', {
        gameId,
        newScore,
        eventType,
        eventData,
        userId: socket.userId,
        timestamp: new Date()
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

export default initializeSocket;

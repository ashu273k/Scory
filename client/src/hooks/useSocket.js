import { useEffect, useRef } from 'react';
import { 
  getSocket, 
  joinGameRoom, 
  leaveGameRoom, 
  subscribeToGameEvents 
} from '../services/socket';

export const useSocket = (gameId, callbacks = {}) => {
  const socketRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    // Get socket instance
    socketRef.current = getSocket();
    
    if (!socketRef.current) {
      console.warn('Socket not initialized yet');
      return;
    }

    if (gameId) {
      // Join game room
      joinGameRoom(gameId);

      // Subscribe to events
      cleanupRef.current = subscribeToGameEvents(callbacks);

      // Cleanup on unmount or gameId change
      return () => {
        if (cleanupRef.current) {
          cleanupRef.current();
        }
        leaveGameRoom(gameId);
      };
    }
  }, [gameId]); // Note: callbacks not in deps to avoid reconnecting

  const isConnected = socketRef.current?.connected || false;

  return {
    socket: socketRef.current,
    isConnected,
  };
};
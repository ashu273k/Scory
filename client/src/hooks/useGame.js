import { useState, useCallback } from 'react';
import { gameAPI } from '@services/api';

export const useGame = () => {
  const [game, setGame] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch single game
  const fetchGame = useCallback(async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await gameAPI.getGame(id);
      setGame(data.game);
      return { success: true, game: data.game };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch game';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all games
  const fetchGames = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await gameAPI.getGames(params);
      setGames(data.games);
      return { 
        success: true, 
        games: data.games, 
        pagination: data.pagination 
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch games';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new game
  const createGame = async (gameData) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await gameAPI.createGame(gameData);
      setGame(data.game);
      return { success: true, game: data.game };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create game';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Join game with room code
  const joinGame = async (roomCode) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await gameAPI.joinGame(roomCode);
      setGame(data.game);
      return { success: true, game: data.game };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to join game';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Update game status
  const updateGameStatus = async (id, status) => {
    setError(null);

    try {
      const { data } = await gameAPI.updateStatus(id, status);
      setGame(data.game);
      return { success: true, game: data.game };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update status';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Update score
  const updateScore = async (id, scoreData) => {
    setError(null);

    try {
      const { data } = await gameAPI.updateScore(id, scoreData);
      return { success: true, currentScore: data.currentScore };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update score';
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    game,
    games,
    loading,
    error,
    fetchGame,
    fetchGames,
    createGame,
    joinGame,
    updateGameStatus,
    updateScore,
    setGame, // Allow manual updates for real-time sync
    setGames,
  };
};

import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '@services/api';
import { initializeSocket, disconnectSocket } from '@services/socket';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user on mount
  const fetchCurrentUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await authAPI.getCurrentUser();
      setUser(data.user);
      
      // Initialize socket with token
      initializeSocket(token);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      localStorage.removeItem('accessToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Register new user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data } = await authAPI.register(userData);
      
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
      
      // Initialize socket
      initializeSocket(data.accessToken);
      
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const { data } = await authAPI.login(credentials);
      
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
      
      // Initialize socket
      initializeSocket(data.accessToken);
      
      return { success: true, user: data.user };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      disconnectSocket();
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    refetch: fetchCurrentUser,
  };
};
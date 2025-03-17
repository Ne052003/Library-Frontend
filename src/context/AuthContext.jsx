import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../api/authService';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token');
      const user = authService.getCurrentUser();

      if (token && user) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            setCurrentUser(user);
            setIsAuthenticated(true);
            setUserRole(user.role || 'USER');
          } else {
            authService.logout();
          }
        } catch (error) {
          console.error('Error al decodificar el token:', error);
          authService.logout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setCurrentUser(data.user);
      setIsAuthenticated(true);
      setUserRole(data.user.role || 'USER');
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      await authService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setUserRole(null);
  };

  const value = {
    currentUser,
    isAuthenticated,
    userRole,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}; 
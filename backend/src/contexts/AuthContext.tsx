import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '@/services/api';

interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  points: number;
  level: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
          setToken(storedToken);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { data } = response;
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        points: data.points,
        level: data.level,
        role: data.role,
      });
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await authAPI.register(userData);
      const { data } = response;
      
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser({
        _id: data._id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        points: data.points,
        level: data.level,
        role: data.role,
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

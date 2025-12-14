import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { MockApi } from '../services/mockApi';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, role: 'CANDIDATE' | 'COMPANY') => Promise<void>;
  socialLogin: (provider: 'google' | 'apple') => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent session
    const storedUser = localStorage.getItem('remota_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, role: 'CANDIDATE' | 'COMPANY') => {
    setIsLoading(true);
    try {
      const userData = await MockApi.login(email, role);
      setUser(userData);
      localStorage.setItem('remota_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    try {
      const userData = await MockApi.socialLogin(provider);
      setUser(userData);
      localStorage.setItem('remota_user', JSON.stringify(userData));
    } catch (error) {
      console.error('Social login failed', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('remota_user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('remota_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, socialLogin, logout, updateUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
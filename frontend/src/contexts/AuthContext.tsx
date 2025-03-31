import React, { createContext, useContext, useState } from 'react';
import { authService, SignInData, SignUpData, AuthResponse } from '../services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (data: SignInData) => Promise<AuthResponse>;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  checkAuth: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData.data);
      return userData.data;
    } catch (error) {
      console.error('Auth check failed:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (data: SignInData) => {
    try {      
      const response = await authService.signIn(data);
      setUser(response.data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const response = await authService.signUp(data);
      setUser(response.data);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      authService.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { getUserByEmail, createUser, updateUser as updateUserDb } from '../utils/database';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('corti_track_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = getUserByEmail(email);
    if (foundUser && foundUser.password === password) {
      setUser(foundUser);
      localStorage.setItem('corti_track_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    try {
      const existingUser = getUserByEmail(userData.email);
      if (existingUser) {
        return false;
      }
      const newUser = createUser(userData);
      setUser(newUser);
      localStorage.setItem('corti_track_current_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('corti_track_current_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = updateUserDb(user.id, userData);
      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('corti_track_current_user', JSON.stringify(updatedUser));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
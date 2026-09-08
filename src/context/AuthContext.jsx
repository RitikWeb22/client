import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vogue_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('vogue_token');
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
          localStorage.setItem('vogue_user', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Session expired');
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleAuthSuccess = (userData, token) => {
    setUser(userData);
    if (token) localStorage.setItem('vogue_token', token);
    localStorage.setItem('vogue_user', JSON.stringify(userData));
  };

  const loginWithCredentials = async (email, password) => {
    try {
      setLoading(true);
      const res = await authService.login(email, password);
      handleAuthSuccess(res.data, res.data.token);
      toast.success(`Welcome back, ${res.data.name}!`);
      return res.data;
    } catch (err) {
      toast.error(err.message || 'Login failed. Check your email and password.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerWithCredentials = async (name, email, password) => {
    try {
      setLoading(true);
      const res = await authService.register(name, email, password);
      handleAuthSuccess(res.data, res.data.token);
      toast.success('Account created successfully!');
      return res.data;
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      setLoading(true);
      const res = await authService.googleLogin(credential);
      handleAuthSuccess(res.data, res.data.token);
      toast.success(`Welcome back, ${res.data.name}!`);
      return res.data;
    } catch (err) {
      toast.error(err.message || 'Google Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async (role = 'user') => {
    try {
      setLoading(true);
      const res = await authService.demoLogin(role);
      handleAuthSuccess(res.data, res.data.token);
      toast.success(`Logged in as ${role === 'admin' ? 'Admin' : 'Customer'}!`);
      return res.data;
    } catch (err) {
      toast.error(err.message || 'Demo Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout().catch(() => {});
    } finally {
      setUser(null);
      localStorage.removeItem('vogue_token');
      localStorage.removeItem('vogue_user');
      toast.success('Signed out successfully');
    }
  };

  const updateUserProfile = async (data) => {
    try {
      const res = await authService.updateProfile(data);
      setUser(res.data);
      localStorage.setItem('vogue_user', JSON.stringify(res.data));
      toast.success('Profile updated successfully');
      return res.data;
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loginWithCredentials,
        registerWithCredentials,
        loginWithGoogle,
        loginDemo,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

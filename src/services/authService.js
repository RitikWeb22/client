import api from './api';

export const authService = {
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  googleLogin: (credential) => api.post('/auth/google', { credential }),
  demoLogin: (role = 'user') => api.post('/auth/demo-login', { role }),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  logout: () => api.post('/auth/logout')
};

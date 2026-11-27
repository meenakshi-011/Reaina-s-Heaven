import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

// POST /api/auth/signup
export const signup = async (name, email, password) => {
  const response = await apiClient.post('/auth/signup', { name, email, password });
  return response.data; // { user, token }
};

// POST /api/auth/login
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data; // { user, token }
};

// Persist auth to storage
export const persistAuth = async (user, token) => {
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify(user));
};

// Clear auth from storage
export const clearAuth = async () => {
  await AsyncStorage.multiRemove(['token', 'user']);
};

// Load persisted auth
export const loadAuth = async () => {
  const token = await AsyncStorage.getItem('token');
  const userStr = await AsyncStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  return { token, user };
};

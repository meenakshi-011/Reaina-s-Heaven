import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Platform } from 'react-native';

// ✅ Dynamic URL resolution:
// - Web on localhost uses http://localhost:5000
// - Mobile devices (Expo Go / physical) use EXPO_PUBLIC_API_URL (http://192.168.31.71:5000)
// - Android Emulator fallback uses 10.0.2.2
const getBaseUrl = () => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    if (isLocal) return 'http://localhost:5000';
  }
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  return Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';
};

const API_URL = getBaseUrl();
console.log('[API] Using base URL:', API_URL);

const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor - attach token automatically
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Token read error:', err.message);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor - handle token expiry
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired – clear storage
      await AsyncStorage.multiRemove(['token', 'user']);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { API_URL };

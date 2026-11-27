import apiClient from './client';
import { API_URL } from './client';

// POST /chat on the RAG FastAPI service
// The RAG service runs at a separate URL (FastAPI on port 8000)
// We proxy through the backend to keep keys secure
// If your backend has a /api/ai/chat proxy route, use that instead.
// For now, we hit the RAG service URL from env.
const RAG_URL = process.env.EXPO_PUBLIC_RAG_URL || 'http://10.0.2.2:8000';

export const sendAIMessage = async (message, history = []) => {
  const response = await fetch(`${RAG_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history: history
        .filter((msg) => msg.text !== 'Thinking... ✨')
        .map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        })),
    }),
  });
  if (!response.ok) {
    throw new Error('AI service unavailable');
  }
  const data = await response.json();
  return data.response || 'Something went wrong.';
};

// GET /api/user/profile
export const getUserProfile = async () => {
  const response = await apiClient.get('/user/profile');
  return response.data;
};

// PUT /api/user/profile
export const updateUserProfile = async (updates) => {
  const response = await apiClient.put('/user/profile', updates);
  return response.data;
};

// POST /api/user/wishlist
export const toggleWishlist = async (productId) => {
  const response = await apiClient.post('/user/wishlist', { productId });
  return response.data;
};

// GET /api/user/activity
export const getUserActivity = async () => {
  const response = await apiClient.get('/user/activity');
  return response.data;
};

// POST /api/contact
export const sendContactMessage = async (contactData) => {
  const response = await apiClient.post('/contact', contactData);
  return response.data;
};

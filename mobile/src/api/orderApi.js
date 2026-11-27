import apiClient from './client';

// POST /api/orders  — create a new order
export const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

// GET /api/orders/myorders
export const getMyOrders = async () => {
  const response = await apiClient.get('/orders/myorders');
  return response.data;
};

// GET /api/orders/:id
export const getOrderById = async (id) => {
  const response = await apiClient.get(`/orders/${id}`);
  return response.data;
};

// POST /api/orders/:id/verify  — delivery OTP verification
export const verifyDeliveryOTP = async (orderId, otp) => {
  const response = await apiClient.post(`/orders/${orderId}/verify`, { otp });
  return response.data;
};

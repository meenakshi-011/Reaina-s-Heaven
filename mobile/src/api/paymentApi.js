import apiClient from './client';

// POST /api/payment/order  — create Razorpay order (backend fetches price from DB)
export const createRazorpayOrder = async (dbOrderId, currency = 'INR') => {
  const response = await apiClient.post('/payment/order', {
    amount: 0, // backend ignores this and uses DB price for security
    currency,
    receipt: `receipt_${dbOrderId}`,
  });
  return response.data; // Razorpay order object { id, amount, currency }
};

// POST /api/payment/verify  — verify payment signature server-side
export const verifyPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  db_order_id,
}) => {
  const response = await apiClient.post('/payment/verify', {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    db_order_id,
  });
  return response.data;
};

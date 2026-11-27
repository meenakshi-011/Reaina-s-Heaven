const isLocalhost = typeof window !== "undefined" && Boolean(
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "[::1]"
);

const API_URL = isLocalhost
  ? "http://localhost:5000"
  : (import.meta.env.VITE_API_URL || "http://localhost:5000");

const SOCKET_URL = isLocalhost
  ? "http://localhost:5000"
  : (import.meta.env.VITE_SOCKET_URL || "http://localhost:5000");

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export { API_URL, SOCKET_URL, RAZORPAY_KEY_ID };

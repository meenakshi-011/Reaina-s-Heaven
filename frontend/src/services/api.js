// src/services/api.js
import { API_URL } from "../config";
const BASE_URL = `${API_URL}/api`;

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return res.json();
};

export const getCafes = async () => {
  const res = await fetch(`${BASE_URL}/cafemenu`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const signupUser = async (data) => {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
};

export const getFeatures = async () => {
  const res = await fetch(`${BASE_URL}/features`);
  return res.json();
};

export const getExperiences = async () => {
  const res = await fetch(`${BASE_URL}/experiences`);
  return res.json();
};

export const getBooks = async () => {
  const res = await fetch(`${BASE_URL}/books`);
  return res.json();
};

export const createOrder = async (orderData) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(orderData),
  });
  return res.json();
};

export const getMyOrders = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${BASE_URL}/orders/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.ok) return await res.json();
  } catch (e) {
    // fallback
  }
  const fallbackRes = await fetch(`${BASE_URL}/orders/myorders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return fallbackRes.json();
};

export const getOrderById = async (id) => {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.json();
};

export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ status }),
  });
  return res.json();
};


export const createPaymentOrder = async (data) => {
  const res = await fetch(`${BASE_URL}/payment/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const verifyPayment = async (data) => {
  const res = await fetch(`${BASE_URL}/payment/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getReviews = async (section = "") => {
  const query = section && section !== "all" ? `?section=${section}` : "";
  const res = await fetch(`${BASE_URL}/reviews${query}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch reviews (${res.status})`);
  }
  return res.json();
};

export const createReview = async (reviewData) => {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE_URL}/reviews`, {
    method: "POST",
    headers,
    body: JSON.stringify(reviewData),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Server error (${res.status})`);
  }
  return res.json();
};

// ==========================================
// REAINA CUSTOM STUDIO SERVICES
// ==========================================

export const getCustomizationConfigs = async () => {
  const res = await fetch(`${BASE_URL}/customizations/configs`);
  if (!res.ok) throw new Error("Failed to load customization configs");
  return res.json();
};

export const getCustomizationConfigByCategory = async (category) => {
  const res = await fetch(`${BASE_URL}/customizations/configs/${category}`);
  if (!res.ok) throw new Error("Failed to load category configuration");
  return res.json();
};

export const calculateCustomizationPrice = async (payload) => {
  const res = await fetch(`${BASE_URL}/customizations/calculate-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to calculate price");
  }
  return res.json();
};

export const uploadReferenceImage = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/customizations/upload-reference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Image upload failed");
  }
  return res.json();
};

export const createCustomizationRequest = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/customizations/requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to submit request");
  }
  return res.json();
};

export const getMyCustomizationRequests = async () => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/customizations/requests/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to load your requests");
  return res.json();
};

export const getCustomizationRequestById = async (id) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/customizations/requests/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to load request details");
  return res.json();
};

export const respondToQuotation = async (id, payload) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/customizations/requests/${id}/respond-quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to respond to quotation");
  }
  return res.json();
};

export const adminGetCustomizationRequests = async (params = {}) => {
  const token = localStorage.getItem("token");
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE_URL}/customizations/admin/requests${query ? `?${query}` : ""}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to load admin customization requests");
  return res.json();
};

export const adminUpdateCustomizationStatus = async (id, payload) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/customizations/admin/requests/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update status");
  }
  return res.json();
};

export const adminAssignCustomization = async (id, payload) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/customizations/admin/requests/${id}/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to assign request");
  }
  return res.json();
};

export const adminCreateCustomizationQuote = async (id, payload) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/customizations/admin/requests/${id}/quote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Failed to create quote");
  }
  return res.json();
};

export const analyzeCustomizationWithAI = async (payload) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE_URL}/customizations/ai/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "AI Analysis failed");
  }
  return res.json();
};

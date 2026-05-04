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
  const res = await fetch(`${BASE_URL}/orders/myorders`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
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
import apiClient from './client';

// ─── Products ─────────────────────────────────────────────────────────────────
export const getProducts = async (params = {}) => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await apiClient.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await apiClient.post('/products', productData);
  return response.data;
};

// ─── Café Menu ────────────────────────────────────────────────────────────────
export const getCafeItems = async () => {
  const response = await apiClient.get('/cafe');
  return response.data;
};

export const getCafeItemById = async (id) => {
  const response = await apiClient.get(`/cafe/${id}`);
  return response.data;
};

export const createCafeItem = async (cafeData) => {
  const response = await apiClient.post('/cafe', cafeData);
  return response.data;
};

// ─── Books Library ────────────────────────────────────────────────────────────
export const getBooks = async () => {
  const response = await apiClient.get('/books');
  return response.data;
};

// ─── Experiences & Features ───────────────────────────────────────────────────
export const getExperiences = async () => {
  const response = await apiClient.get('/experiences');
  return response.data;
};

export const getFeatures = async () => {
  const response = await apiClient.get('/features');
  return response.data;
};

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const getReviews = async (section = '') => {
  const query = section && section !== 'all' ? `?section=${encodeURIComponent(section)}` : '';
  const response = await apiClient.get(`/reviews${query}`);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await apiClient.post('/reviews', reviewData);
  return response.data;
};

// ─── Contact Form ─────────────────────────────────────────────────────────────
export const submitContact = async (contactData) => {
  const response = await apiClient.post('/contact', contactData);
  return response.data;
};

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
export const getAdminStats = async () => {
  const response = await apiClient.get('/stats');
  return response.data;
};

export const getAllOrdersAdmin = async () => {
  const response = await apiClient.get('/orders');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await apiClient.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const updateProduct = async (id, data) => {
  const response = await apiClient.put(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

export const updateCafeItem = async (id, data) => {
  const response = await apiClient.put(`/cafe/${id}`, data);
  return response.data;
};

export const deleteCafeItem = async (id) => {
  const response = await apiClient.delete(`/cafe/${id}`);
  return response.data;
};

export const getAllUsersAdmin = async () => {
  const response = await apiClient.get('/user');
  return response.data;
};


import axios from "axios";

const api = axios.create({ baseURL: "/api" });

export const fetchProducts = () => api.get("/products");
export const addReview = (payload) => api.post("/reviews", payload);
export const fetchRecommendations = (userId) => api.get(`/products/recommendations/${userId}`);

export default api;


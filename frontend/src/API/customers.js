import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Customer API functions
export const customerAPI = {
  // Get all customers (for admin)
  getAllCustomers: async () => {
    try {
      const response = await apiClient.get("/customers");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get customer by ID
  getCustomerById: async (customerId) => {
    try {
      const response = await apiClient.get(`/customers/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default customerAPI;

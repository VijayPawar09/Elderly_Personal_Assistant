// src/api/auth.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

// Create axios instance for auth
const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth API functions
export const authAPI = {
  // Register a new user
  register: async (userData, file = null) => {
    try {
      console.log("Attempting registration with:", userData);
      let response;
      
      if (file) {
        // If file is provided, use FormData for multipart/form-data
        const formData = new FormData();
        
        // Add user data
        Object.keys(userData).forEach(key => {
          formData.append(key, userData[key]);
        });
        
        // Add file
        formData.append('photo', file);
        
        console.log("Sending registration with file upload");
        // Use different headers for file upload
        response = await axios.post(`${API_BASE_URL}/user/register`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // Regular JSON request if no file
        console.log("Sending registration without file");
        response = await authClient.post("/user/register", userData);
      }
      
      console.log("Registration response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Registration API error:", error.response?.status, error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await authClient.post("/user/login", credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await authClient.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect to login page
    window.location.href = "/login";
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authAPI;

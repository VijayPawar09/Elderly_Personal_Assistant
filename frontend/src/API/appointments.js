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

// Appointment API functions
export const appointmentAPI = {
  // Book a new appointment
  bookAppointment: async (appointmentData) => {
    try {
      console.log("Booking appointment with data:", appointmentData);
      const response = await apiClient.post(
        "/appointments/book",
        appointmentData
      );
      console.log("Booking response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Booking error:", error.response?.status, error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // Get appointments for a specific assistant
  getAssistantAppointments: async (assistantId) => {
    try {
      const response = await apiClient.get(
        `/appointments/assistant/${assistantId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all appointments (for admin)
  getAllAppointments: async () => {
    try {
      const response = await apiClient.get("/appointments/all");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get appointment by ID
  getAppointmentById: async (appointmentId) => {
    try {
      const response = await apiClient.get(`/appointments/${appointmentId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const response = await apiClient.put(
        `/appointments/${appointmentId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin: assign assistant to an appointment
  assignAssistant: async (appointmentId, assistantId) => {
    try {
      const response = await apiClient.put(
        `/appointments/${appointmentId}/assign`,
        { assistantId }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get appointments for current user (customer)
  getCustomerAppointments: async () => {
    try {
      console.log("Making API call to /appointments/customer");
      const response = await apiClient.get("/appointments/customer");
      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error:", error.response?.status, error.response?.data);
      throw error.response?.data || error.message;
    }
  },

  // Get appointments for current assistant
  getCurrentAssistantAppointments: async () => {
    try {
      const response = await apiClient.get("/appointments/assistant/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default appointmentAPI;

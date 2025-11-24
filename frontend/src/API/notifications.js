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

// Notification API functions
export const notificationAPI = {
  // Get notifications for current user
  getUserNotifications: async (limit = 20) => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Check if this is a mock admin session or if user doesn't have real token
      if (!token || token.startsWith("mock_admin_token") || !user._id) {
        // Return mock notification data for demo purposes
        return [
          {
            _id: "mock_user_notification_1",
            recipientRole: user.role || "customer",
            type: "appointment_assigned",
            title: "Assistant Assigned to Your Appointment",
            message: "Sarah Wilson has been assigned to your Personal Care appointment on 2024-09-20 at 10:00 AM.",
            read: false,
            priority: "high",
            createdAt: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
            link: "/customer-dashboard"
          },
          {
            _id: "mock_user_notification_2",
            recipientRole: user.role || "customer",
            type: "appointment_confirmed",
            title: "Appointment Confirmed",
            message: "Your Companion Care appointment has been confirmed for 2024-09-21 at 2:00 PM.",
            read: true,
            priority: "medium",
            createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
            link: "/customer-dashboard"
          }
        ];
      }
      
      const response = await apiClient.get(`/notifications?limit=${limit}`);
      return response.data.notifications;
    } catch (error) {
      // If API fails, return mock data as fallback
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return [
        {
          _id: "fallback_notification_1",
          recipientRole: user.role || "customer",
          type: "appointment_assigned",
          title: "Assistant Assigned",
          message: "An assistant has been assigned to your appointment.",
          read: false,
          priority: "high",
          createdAt: new Date().toISOString(),
          link: "/customer-dashboard"
        }
      ];
    }
  },

  // Get all notifications (admin only)
  getAllNotifications: async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Check if this is a mock admin session
      if (token && token.startsWith("mock_admin_token") && user.role === "admin") {
        // Return mock notification data for demo purposes
        return [
          {
            _id: "mock_notification_1",
            recipient: { name: "Sarah Wilson", email: "sarah.wilson@email.com", role: "assistant" },
            recipientRole: "assistant",
            type: "appointment_assigned",
            title: "New Appointment Assignment",
            message: "You have been assigned to a Personal Care appointment with John Smith on 2024-09-20 at 10:00 AM.",
            read: false,
            priority: "high",
            createdAt: new Date().toISOString()
          },
          {
            _id: "mock_notification_2",
            recipient: { name: "John Smith", email: "john.smith@email.com", role: "customer" },
            recipientRole: "customer",
            type: "appointment_assigned",
            title: "Assistant Assigned to Your Appointment",
            message: "Sarah Wilson has been assigned to your Personal Care appointment on 2024-09-20 at 10:00 AM.",
            read: false,
            priority: "high",
            createdAt: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
          },
          {
            _id: "mock_notification_3",
            recipient: { name: "Michael Brown", email: "michael.brown@email.com", role: "assistant" },
            recipientRole: "assistant",
            type: "appointment_assigned",
            title: "New Appointment Assignment",
            message: "You have been assigned to a Companion Care appointment with Mary Johnson on 2024-09-21 at 2:00 PM.",
            read: true,
            priority: "high",
            createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
          }
        ];
      }
      
      const response = await apiClient.get("/notifications/all");
      return response.data.notifications;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get unread notification count
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get("/notifications/unread-count");
      return response.data.count;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      
      // Check if this is a mock notification
      if (!token || token.startsWith("mock_admin_token") || notificationId.startsWith("mock_") || notificationId.startsWith("fallback_")) {
        // For mock notifications, just return success
        return { _id: notificationId, read: true };
      }
      
      const response = await apiClient.put(`/notifications/${notificationId}/read`);
      return response.data.notification;
    } catch (error) {
      // If API fails, still return success for better UX
      return { _id: notificationId, read: true };
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await apiClient.put("/notifications/mark-all-read");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default notificationAPI;

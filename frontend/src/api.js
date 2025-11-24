import axios from "axios";

const API_URL = "https://pa-backend-wprc.onrender.com/api";

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

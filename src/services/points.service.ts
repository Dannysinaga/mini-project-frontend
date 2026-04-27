import axios from "axios";

const API_URL = "https://mini-project-backend-tau.vercel.app";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getPointsBalance = async () => {
  const response = await axios.get(
    `${API_URL}/points/balance`,
    getAuthHeaders()
  );
  return response.data.data || response.data;
};

export const getPointsHistory = async () => {
  const response = await axios.get(
    `${API_URL}/points/history`,
    getAuthHeaders()
  );
  return response.data.data || response.data;
};
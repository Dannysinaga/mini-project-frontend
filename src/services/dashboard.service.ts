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

export const getDashboardStats = async () => {
  const response = await axios.get(
    `${API_URL}/dashboard/stats`,
    getAuthHeaders()
  );
  return response.data.data || response.data;
};

export const getDashboardChart = async () => {
  const response = await axios.get(
    `${API_URL}/dashboard/chart`,
    getAuthHeaders()
  );
  return response.data.data || response.data;
};

export const getDashboardEvents = async () => {
  const response = await axios.get(
    `${API_URL}/dashboard/events`,
    getAuthHeaders()
  );
  return response.data.data || response.data;
};

export const getDashboardAttendees = async (eventId: string) => {
  const response = await axios.get(
    `${API_URL}/dashboard/attendees/${eventId}`,
    getAuthHeaders()
  );
  return response.data.data || response.data;
};

export const updateDashboardEvent = async (
  eventId: string,
  payload: {
    name?: string;
    description?: string;
    category?: string;
    location?: string;
  }
) => {
  const response = await axios.put(
    `${API_URL}/dashboard/events/${eventId}`,
    payload,
    getAuthHeaders()
  );
  return response.data;
};

export const deleteDashboardEvent = async (eventId: string) => {
  const response = await axios.delete(
    `${API_URL}/dashboard/events/${eventId}`,
    getAuthHeaders()
  );
  return response.data;
};
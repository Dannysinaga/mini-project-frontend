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

export type UserProfileResponse = {
  id?: string;
  email?: string;
  role?: "CUSTOMER" | "ORGANIZER";
  referralCode?: string;
  points?: number;
  createdAt?: string;
  profile?: {
    userId?: string;
    fullName?: string | null;
    phone?: string | null;
    photoUrl?: string | null;
    bio?: string | null;
    updatedAt?: string;
    createdAt?: string;
  } | null;
};

export const getProfile = async (): Promise<UserProfileResponse> => {
  const response = await axios.get(`${API_URL}/users/profile`, getAuthHeaders());
  return response.data.data || response.data;
};

export const updateProfile = async (payload: {
  fullName?: string;
  phone?: string;
  photoUrl?: string;
  bio?: string;
}) => {
  const response = await axios.put(
    `${API_URL}/users/profile`,
    payload,
    getAuthHeaders()
  );
  return response.data;
};

export const changePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
}) => {
  const response = await axios.put(
    `${API_URL}/users/change-password`,
    payload,
    getAuthHeaders()
  );
  return response.data;
};
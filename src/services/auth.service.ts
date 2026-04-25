import axios from "axios";

const API_URL = "http://localhost:8000";

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: "CUSTOMER" | "ORGANIZER";
    referralCode: string;
    points: number;
    createdAt: string;
    profile?: {
      userId: string;
      fullName?: string | null;
      phone?: string | null;
      photoUrl?: string | null;
      updatedAt?: string;
      bio?: string | null;
      createdAt?: string;
    } | null;
  };
};

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, payload);
  return response.data.data;
};

export const forgotPassword = async (payload: { email: string }) => {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, payload);
  return response.data;
};

export const resetPassword = async (payload: {
  token: string;
  newPassword: string;
}) => {
  const response = await axios.post(`${API_URL}/auth/reset-password`, payload);
  return response.data;
};
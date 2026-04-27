import axios from "axios";
import type { Event } from "../types/event";

const API_URL = "https://mini-project-backend-tau.vercel.app";

interface GetEventsParams {
  search?: string;
  category?: string;
  location?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getEvents = async (params?: GetEventsParams): Promise<Event[]> => {
  const response = await axios.get<ApiResponse<Event[]>>(`${API_URL}/events`, {
    params,
  });

  return response.data.data;
};

export const getEventDetail = async (id: string): Promise<Event> => {
  const response = await axios.get<ApiResponse<Event>>(`${API_URL}/events/${id}`);
  return response.data.data;
};

export const createEvent = async (payload: {
  organizerId: string;
  name: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  bannerUrl?: string;
  ticketTypes: {
    name: string;
    price: number;
    quota: number;
  }[];
}): Promise<Event> => {
  const response = await axios.post<ApiResponse<Event>>(
    `${API_URL}/events`,
    payload
  );

  return response.data.data;
};

export const getOrganizerEvents = async (
  organizerId: string
): Promise<Event[]> => {
  const response = await axios.get<ApiResponse<Event[]>>(
    `${API_URL}/events/organizer/list`,
    {
      params: { organizerId },
    }
  );

  return response.data.data;
};

export const updateEvent = async (
  eventId: string,
  payload: {
    organizerId: string;
    name: string;
    description: string;
    category: string;
    location: string;
    startDate: string;
    endDate: string;
    bannerUrl?: string;
    ticketTypes: {
      name: string;
      price: number;
      quota: number;
    }[];
  }
): Promise<Event> => {
  const response = await axios.put<ApiResponse<Event>>(
    `${API_URL}/events/${eventId}`,
    payload
  );

  return response.data.data;
};

export const deleteEvent = async (
  eventId: string,
  organizerId: string
): Promise<Event> => {
  const response = await axios.delete<ApiResponse<Event>>(
    `${API_URL}/events/${eventId}`,
    {
      params: { organizerId },
    }
  );

  return response.data.data;
};
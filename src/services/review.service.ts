import api from "./api";

export type Review = {
  id: string;
  eventId?: string;
  userId?: string;
  rating: number;
  comment?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id?: string;
    email?: string;
    profile?: {
      fullName?: string | null;
    } | null;
  };
};

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getEventReviews = async (eventId: string): Promise<Review[]> => {
  const response = await api.get<ApiResponse<Review[]>>(
    `/reviews/event/${eventId}`
  );

  return response.data.data || [];
};

export const createReview = async (payload: {
  eventId: string;
  rating: number;
  comment: string;
}) => {
  const response = await api.post<ApiResponse<Review>>("/reviews", payload);
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await api.delete<ApiResponse<Review>>(
    `/reviews/${reviewId}`
  );

  return response.data;
};
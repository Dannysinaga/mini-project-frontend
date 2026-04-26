import api from "./api";

export type Coupon = {
  id: string;
  code: string;
  discountAmount: number;
  validUntil?: string | null;
  isUsed?: boolean;
  usedAt?: string | null;
  userId?: string;
  createdAt?: string;
};

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const getMyCoupons = async (): Promise<Coupon[]> => {
  const response = await api.get<ApiResponse<Coupon[]>>("/users/coupons");
  return response.data.data || [];
};
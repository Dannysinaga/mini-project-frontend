import api from "./api";

export type Voucher = {
  id: string;
  code: string;
  discountAmount: number;
  startDate: string;
  endDate: string;
  quota?: number;
  usedQuota?: number;
  isActive?: boolean;
  eventId: string;
  event?: {
    id: string;
    name: string;
  };
};

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const createVoucher = async (payload: {
  organizerId: string;
  eventId: string;
  code: string;
  discountAmount: number;
  startDate: string;
  endDate: string;
  quota: number;
}) => {
  const response = await api.post<ApiResponse<Voucher>>("/vouchers", payload);
  return response.data;
};

export const getEventVouchers = async (eventId: string): Promise<Voucher[]> => {
  const response = await api.get<ApiResponse<Voucher[]>>(
    `/vouchers/event/${eventId}`
  );

  return response.data.data || [];
};

export const validateVoucher = async (payload: {
  eventId: string;
  code: string;
}) => {
  const response = await api.post<ApiResponse<Voucher>>(
    "/vouchers/validate",
    payload
  );

  return response.data;
};
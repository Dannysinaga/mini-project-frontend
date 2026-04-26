import type { Transaction } from "../types/transaction";
import api from "./api";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getTransactionHistory = async (
  userId: string
): Promise<Transaction[]> => {
  const response = await api.get<ApiResponse<Transaction[]>>("/transactions", {
    params: { userId },
  });

  return response.data.data;
};

export const uploadPaymentProof = async (
  transactionId: string,
  paymentProofUrl: string
): Promise<Transaction> => {
  const response = await api.patch<ApiResponse<Transaction>>(
    `/transactions/${transactionId}/upload-proof`,
    { paymentProofUrl }
  );

  return response.data.data;
};

export const getPendingTransactions = async (
  organizerId: string
): Promise<Transaction[]> => {
  const response = await api.get<ApiResponse<Transaction[]>>(
    "/transactions/pending/list",
    {
      params: { organizerId },
    }
  );

  return response.data.data;
};

export const approveTransaction = async (
  transactionId: string
): Promise<Transaction> => {
  const response = await api.patch<ApiResponse<Transaction>>(
    `/transactions/${transactionId}/approve`
  );

  return response.data.data;
};

export const rejectTransaction = async (
  transactionId: string,
  rejectionReason: string
): Promise<Transaction> => {
  const response = await api.patch<ApiResponse<Transaction>>(
    `/transactions/${transactionId}/reject`,
    { rejectionReason }
  );

  return response.data.data;
};

export const createTransaction = async (payload: {
  userId: string;
  eventId: string;
  usedPoints?: number;
  couponCode?: string;
  voucherCode?: string;
  items: {
    ticketTypeId: string;
    quantity: number;
  }[];
}) => {
  const response = await api.post("/transactions", payload);
  return response.data;
};
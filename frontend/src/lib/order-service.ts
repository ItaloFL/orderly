import { api } from "./axios";

export const orderService = {
  create: (data: {
    items: {
      productId: string;
      productName: string;
      imageUrl: string;
      quantity: number;
      price: number;
    }[];
  }) => api.post<{ id: string; userId: string; }>("/api/orders", data),

  createCheckout: (orderId: string, data: { userId: string; total: number }) =>
    api.post<{ checkoutUrl: string; sessionId: string }>(
      `/api/orders/${orderId}/checkout`,
      data,
    ),

  list: (params?: { page?: number }) => api.get("/api/orders", { params }),

  getOne: (id: string) => api.get(`/api/orders/${id}`),
};

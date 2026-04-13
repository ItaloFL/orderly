import { api } from "./axios";

export const orderService = {
  list: () => api.get("/api/orders"),
  getOne: (id: string) => api.get(`/api/orders/${id}`),
  create: (data: unknown) => api.post("/api/orders", data),
};

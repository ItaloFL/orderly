import { api } from "./axios";

export const stockService = {
  getStocksByProducts: (ids: string) =>
    api.get("/api/stock", {
      params: {
        ids: ids,
      },
    }),
};

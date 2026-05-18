import { api } from "./axios";

export const catalogService = {
  list: () => api.get("/api/products/product"),

  create: (data: FormData) =>
    api.post("/api/products/product", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

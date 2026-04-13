import { api } from "./axios";

interface LoginParams {
  email: string;
  password: string;
}
interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: (data: LoginParams) =>
    api.post<{ token: string }>("/api/auth/login", data),

  register: (data: RegisterParams) =>
    api.post<{ token: string }>("/api/auth/register", data),
};

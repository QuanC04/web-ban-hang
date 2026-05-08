import type { User } from "./user";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

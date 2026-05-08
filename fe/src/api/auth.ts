import { privateClient, publicClient } from "./client";
import type { LoginPayload, RegisterPayload } from "../models";


export const register = async (data: RegisterPayload) => {
  const response = await publicClient.post(`/auth/register`, data);
  return response.data;
};

export const login = async (data: LoginPayload) => {
  const response = await publicClient.post(`/auth/login`, data);
  return response.data;
};

export const authLogout = async () => {
    const response = await privateClient.post(`/auth/logout`);
    return response.data;
    };

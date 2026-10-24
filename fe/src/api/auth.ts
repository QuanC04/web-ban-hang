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

export const otpRequest = async (email: string) => {
  const response = await publicClient.post(`/auth/otp/request`, { email });
  return response.data;
};

export const otpVerify = async (email: string, otp: string) => {
  const response = await publicClient.post(`/auth/otp/verify`, { email, otp });
  return response.data;
};

export const resetPassword = async (
  resetToken: string,
  newPassword: string,
) => {
  const response = await publicClient.post(`/auth/reset-password`, {
    resetToken,
    newPassword,
  });
  return response.data;
};

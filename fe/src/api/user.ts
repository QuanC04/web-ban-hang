import { privateClient } from "./client";
import type { UpdateProfilePayload } from "../models";

export const getMe = async () => {
  const response = await privateClient.get(`/user/me`);
  return response.data;
};

export const updateProfile = async (data: UpdateProfilePayload) => {
  const response = await privateClient.put(`/user/me`, data);
  return response.data;
};

import { privateClient } from "./client";
import type { AddressItem, CreateAddressPayload } from "../models";

export const addNewAddress = async (data: CreateAddressPayload) => {
  const response = await privateClient.post(`/addresses/create`, data);
  return response.data;
};

export const getAddressByUserId = async () => {
  const response = await privateClient.get(`/addresses/get-address`);
  return response.data.data as AddressItem[];
};

export const deleteAddress = async (addressId: string) => {
  const response = await privateClient.delete(`/addresses/${addressId}`);
  return response.data;
};

export const updateAddress = async (
  addressId: string,
  data: CreateAddressPayload,
) => {
  const response = await privateClient.put(`/addresses/${addressId}`, data);
  return response.data;
};

export const getProvinces = async () => {
  const response = await privateClient.get(
    `https://vietnamlabs.com/api/vietnamprovince`,
  );
  return response.data.data;
};

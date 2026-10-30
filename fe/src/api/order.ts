import type {
  BuyNowOrderData,
  OrderData,
  OrderHistoryResponse,
} from "../models/order";
import { privateClient } from "./client";

export const createOrder = async (orderData: OrderData) => {
  const response = await privateClient.post("/order/create-order", orderData);
  return response.data;
};

export const buyNow = async (orderData: BuyNowOrderData) => {
  const response = await privateClient.post("/order/buy-now", orderData);
  return response.data;
};

export const getMyOrders = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<{ data: OrderHistoryResponse }> => {
  const params: Record<string, string | number> = { page, limit };
  if (status) params.status = status;
  const response = await privateClient.get("/order/my-orders", { params });
  return response.data;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const response = await privateClient.patch(`/order/${orderId}/status`, {
    status,
  });
  return response.data;
};
export const confirmDelivery = async (orderId: string) => {
  const response = await privateClient.patch(
    `/order/${orderId}/confirm-delivery`,
  );
  return response.data;
};

export const getShopOrders = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<{ data: OrderHistoryResponse }> => {
  const params: Record<string, string | number> = { page, limit };
  if (status) params.status = status;
  const response = await privateClient.get("/order/shop-orders", { params });
  return response.data;
};

import type { OrderData } from "../models/order";
import { privateClient } from "./client";

export const createOrder = async (orderData: OrderData) => {
  const response = await privateClient.post("/order/create", orderData);
  return response.data;
};

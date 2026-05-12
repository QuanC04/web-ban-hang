import { privateClient } from "./client";

export const validateCoupon = async (code: string, subtotal: number) => {
  const response = await privateClient.post("/coupon/validate", {
    code,
    subtotal,
  });
  return response.data;
};

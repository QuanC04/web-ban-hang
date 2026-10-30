import type { CreateReviewPayload, GetProductReviewsParams, ProductReviewsResponse } from "../models";
import { privateClient, publicClient } from "./client";

export const createReview = async (payload: CreateReviewPayload) => {
  const response = await privateClient.post("/review/create-review", payload);
  return response.data;
};

export const getProductReviews = async (
  productId: string,
  param?: GetProductReviewsParams,
): Promise<ProductReviewsResponse> => {
  const response = await publicClient.get(`/review/${productId}`, {
    params: param,
  });
  return response.data?.data;
};

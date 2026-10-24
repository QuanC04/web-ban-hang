import { privateClient, publicClient } from "./client";
import type {
  CreateReviewPayload,
  ProductReviewsResponse,
  ReviewItem,
} from "../models/review";

export interface GetProductReviewsParams {
  page?: number;
  limit?: number;
  rating?: number;
}

/**
 * Gửi đánh giá mới lên Backend
 * POST /api/reviews
 */
export const createReview = async (payload: CreateReviewPayload) => {
  const response = await privateClient.post("/reviews", payload);
  return response.data;
};

/**
 * Lấy danh sách đánh giá của sản phẩm
 * GET /api/reviews/product/:productId
 */
export const getProductReviews = async (
  productId: string,
  params?: GetProductReviewsParams,
): Promise<{ data: ProductReviewsResponse }> => {
  const response = await publicClient.get(`/reviews/product/${productId}`, {
    params,
  });
  return response.data;
};

/**
 * Dữ liệu giả lập (Mock) phục vụ test UI khi chưa kết nối Backend
 */
export const mockCreateReview = async (
  payload: CreateReviewPayload,
  user?: { full_name?: string | null; avatar_url?: string | null },
): Promise<ReviewItem> => {
  // Giả lập độ trễ mạng 600ms
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    id: `review_mock_${Date.now()}`,
    user_id: "user_current",
    product_id: "prod_current",
    order_item_id: payload.order_item_id,
    rating: payload.rating,
    comment: payload.comment || null,
    created_at: new Date().toISOString(),
    user: {
      id: "user_current",
      full_name: user?.full_name || "Bạn (Khách hàng)",
      avatar_url: user?.avatar_url || null,
    },
  };
};

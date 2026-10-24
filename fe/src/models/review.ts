export interface CreateReviewPayload {
  order_item_id: string;
  rating: number;
  comment?: string;
}

export interface ReviewUser {
  id: string;
  full_name?: string | null;
  avatar_url?: string | null;
}

export interface ReviewItem {
  id: string;
  user_id: string;
  product_id: string;
  order_item_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  user?: ReviewUser;
}

export interface RatingBreakdownItem {
  count: number;
  percentage: number;
}

export interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  breakdown: Record<number, RatingBreakdownItem>;
}

export interface ProductReviewsResponse {
  summary: ReviewSummary;
  reviews: ReviewItem[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };
}

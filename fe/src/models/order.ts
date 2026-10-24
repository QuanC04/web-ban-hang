export interface shippingAddress {
  name: string;
  phone_number: string;
  address: string;
}

export interface OrderData {
  cartItemsIds: string[];
  shipping_address: shippingAddress;
  coupon_code: string | null;
  payment_method: "cod" | "bank";
}

export interface BuyNowOrderData {
  productId: string;
  quantity: number;
  shipping_address: shippingAddress;
  coupon_code?: string | null;
  payment_method: "cod" | "bank";
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

export interface OrderProductSnapshot {
  id: string;
  name: string;
  image_url?: string | null;
  base_price: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product: OrderProductSnapshot;
}

export interface Payment {
  id: string;
  order_id: string;
  payment_method: "cod" | "bank";
  status: "pending" | "completed" | "failed";
  paid_at?: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_before_discount: number;
  total_amount: number;
  shipping_address: string;
  created_at: string;
  items: OrderItem[];
  payments: Payment[];
}

export interface OrderHistoryResponse {
  orders: Order[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

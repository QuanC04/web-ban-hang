import { create } from "zustand";
import type { CartItem } from "../models/cart";
import { getCart } from "../api/cart";
import type { ProductItem } from "../models";

export interface BuynowItem {
  product: ProductItem;
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  cartCount: number;
  checkoutCartItemsIds: string[] | null;
  checkoutCouponCode: string | null;
  checkoutBuyNowItem: { product: ProductItem; quantity: number } | null;
  setCheckoutCouponCode: (code: string | null) => void;
  clearCheckoutCouponCode: () => void;
  fetchCart: () => Promise<void>;
  setCheckoutCartItemsIds: (CartItemsIds: string[] | null) => void;
  clearCheckoutCartItemsIds: () => void;
  setCheckoutBuyNowItem: (item: BuynowItem | null) => void;
  clearCheckoutBuyNowItem: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  cartCount: 0,
  checkoutCartItemsIds: null,
  checkoutCouponCode: null,
  checkoutBuyNowItem: null,
  setCheckoutCouponCode: (code: string | null) =>
    set({ checkoutCouponCode: code }),
  clearCheckoutCouponCode: () => set({ checkoutCouponCode: null }),
  fetchCart: async () => {
    const response = await getCart();
    const items = response.data;
    set({ cartItems: items, cartCount: items.length });
  },
  setCheckoutCartItemsIds: (CartItemsIds: string[] | null) =>
    set({ checkoutCartItemsIds: CartItemsIds }),
  clearCheckoutCartItemsIds: () => set({ checkoutCartItemsIds: null }),
  setCheckoutBuyNowItem: (item: BuynowItem | null) =>
    set({ checkoutBuyNowItem: item }),
  clearCheckoutBuyNowItem: () => set({ checkoutBuyNowItem: null }),
}));

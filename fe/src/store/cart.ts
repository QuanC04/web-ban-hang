import { create } from "zustand";
import type { CartItem } from "../models/cart";
import { getCart } from "../api/cart";

interface CartState {
  cartItems: CartItem[];
  cartCount: number;
  checkoutCartItemsIds: string[] | null;
  fetchCart: () => Promise<void>;
  setCheckoutCartItemsIds: (CartItemsIds: string[] | null) => void;
  clearCheckoutCartItemsIds: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  cartCount: 0,
  checkoutCartItemsIds: null,

  fetchCart: async () => {
    const response = await getCart();
    const items = response.data;
    set({ cartItems: items, cartCount: items.length });
  },
  setCheckoutCartItemsIds: (CartItemsIds: string[] | null) =>
    set({ checkoutCartItemsIds: CartItemsIds }),
  clearCheckoutCartItemsIds: () => set({ checkoutCartItemsIds: null }),
}));

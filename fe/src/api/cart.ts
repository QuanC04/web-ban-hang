import { privateClient } from "./client";

export const getCart = async () => {
  const response = await privateClient.get("/cart/get-cartItems");
  return response.data;
};

export const addToCart = async (productId: string, quantity: number) => {
  const response = await privateClient.post("/cart/add-to-cart", { productId, quantity });
  return response.data;
};
export const deleteCartItem = async (ItemId: string) => {
  const response = await privateClient.delete(`/cart/delete/${ItemId}`);
  return response.data;
};
export const updateCartItem = async (itemId: string, quantity: number) => {
    const response = await privateClient.patch("/cart/update", { itemId, quantity });
    return response.data;
    };

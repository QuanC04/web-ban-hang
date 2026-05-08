import { privateClient, publicClient } from "./client";
import type {
  CategoryItem,
  CreateProductPayload,
  HomeProductItem,
  ProductItem,
} from "../models";

export const getCategories = async () => {
  const response = await privateClient.get("/products/categories");
  const payload = response.data.data;
  return Array.isArray(payload) ? (payload as CategoryItem[]) : [];
};

export const createProduct = async (data: CreateProductPayload) => {
  const response = await privateClient.post("/products/create", data);
  return response.data;
};

export const getProductsByUserId = async () => {
  const response = await privateClient.get('products/get-product');
  const payload = response.data?.data;
  return Array.isArray(payload) ? (payload as ProductItem[]) : [];
};
export const updateProduct = async (productId: string, data: Partial<CreateProductPayload>) => {
  const response = await privateClient.put(`/products/update/${productId}`, data);
  return response.data;
};

export const deleteProduct = async (productId: string) => {
  const response = await privateClient.delete(`/products/delete/${productId}`);
  return response.data;
};

export const getProductById = async (productId: string) => {
  const response = await privateClient.get(`/products/${productId}`);
  return response.data?.data as ProductItem;
};

export const getMarketProducts = async () => {
  const response = await publicClient.get("/market/market-product");
  const payload = response.data?.data;
  return Array.isArray(payload) ? (payload as HomeProductItem[]) : [];
};
export const getMarketProduct= async (productId: string) => {
    const response = await publicClient.get(`/market/market-product/${productId}`);
    return response.data?.data ;
};

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
  parent_id?: string | null;
}

export interface CreateProductPayload {
  user_id: string;
  category_id: string;
  name: string;
  description?: string;
  image_url?: string;
  image_key?: string;
  base_price: number;
  stock_quantity: number;
  status: string;
}

export interface ProductItem {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  description?: string;
  image_url?: string;
  image_key?: string;
  base_price: number;
  stock_quantity: number;
  sold_quantity?: number;
  status: string;
  user?: {
    id: string;
    full_name?: string | null;
    addresses?: {
        province_id: string;
        province_name: string;
    }[];
  };
  category?: {
    id: string;
    name: string;
  };
}

export interface HomeProductItem {
  id: string;
  name: string;
  base_price: number;
  status?: string;
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
  user: {
    full_name?: string | null;
  };
}

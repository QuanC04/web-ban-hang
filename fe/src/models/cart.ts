export interface CartItem {
  id: string;
  user_id: string;
    product_id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        base_price: number;
        description?: string;
        image_url?: string;
        user: {
            full_name: string;
        };
        category?: {
            name: string;
        };
    };
}

export interface OrderData {
  cartItemsIds: string[];
  shipping_address: {
    name: string;
    phone_number: string;
    address: string;
  };
  coupon_code: string | null;
}

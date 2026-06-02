export interface DbCategory {
  id: string;
  name: string;
  image_url: string | null;
  created_at: string;
}

export interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string | null;
  stock: number;
  featured: boolean;
  created_at: string;
}

export interface DbOrder {
  id: string;
  customer_name: string;
  phone: string;
  address: string;
  cart_data: unknown;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled";

export interface OrderCartLine {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

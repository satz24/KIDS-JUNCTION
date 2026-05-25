export type Category =
  | "boys-wear"
  | "girls-wear"
  | "baby-collection"
  | "educational-toys"
  | "soft-toys"
  | "remote-cars"
  | "learning-kits"
  | "school-accessories";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: Category;
  brand: string;
  ageRange: string;
  sizes?: string[];
  colors?: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  featured?: boolean;
  trending?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  shippingAddress: ShippingAddress;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface CategoryInfo {
  id: Category;
  name: string;
  description: string;
  image: string;
  gradient: string;
  productCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

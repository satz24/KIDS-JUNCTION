import type { Product, Review, Testimonial } from "@/types";
import { STORE_PRODUCTS } from "./store-products";

export const products: Product[] = STORE_PRODUCTS;

export const reviews: Review[] = [
  {
    id: "1",
    author: "Sarah M.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Absolutely love the quality! The organic cotton feels so soft on my baby's skin. Will definitely order again.",
    date: "2026-04-15",
  },
  {
    id: "2",
    author: "James K.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Fast shipping and the RC car is a hit with my 7-year-old. Built solid and the battery life is impressive.",
    date: "2026-04-10",
  },
  {
    id: "3",
    author: "Emily R.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    rating: 5,
    comment: "The princess dress is even more beautiful in person. My daughter wore it to her birthday and got so many compliments!",
    date: "2026-03-28",
  },
  {
    id: "4",
    author: "Michael T.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 4,
    comment: "Great educational toys selection. The building blocks set has kept my twins entertained for hours.",
    date: "2026-03-20",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Jennifer Walsh",
    role: "Mom of 2",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Kids Junction has become our go-to store for everything kids. The quality is outstanding and I love knowing everything is safety-tested.",
  },
  {
    id: "2",
    name: "David Chen",
    role: "Dad & Gift Buyer",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    comment: "Ordered a birthday gift for my niece — arrived beautifully packaged within 2 days. The plush bear is adorable and so soft!",
  },
  {
    id: "3",
    name: "Amanda Foster",
    role: "Teacher & Mom",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    rating: 5,
    comment: "The learning kits are fantastic for homeschooling. My kids are engaged and learning without even realizing it. Highly recommend!",
  },
  {
    id: "4",
    name: "Robert Kim",
    role: "First-time Dad",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    comment: "As a new parent, I appreciate the detailed product descriptions and age recommendations. Makes shopping stress-free!",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getTrendingProducts(): Product[] {
  return products.filter((p) => p.trending);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function getBrands(): string[] {
  return [...new Set(products.map((p) => p.brand))].sort();
}

export function getAgeRanges(): string[] {
  return [...new Set(products.map((p) => p.ageRange))].sort();
}

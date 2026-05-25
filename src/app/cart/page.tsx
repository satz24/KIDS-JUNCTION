import type { Metadata } from "next";
import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart and place your order via WhatsApp at Kids Junction.",
};

export default function CartPage() {
  return <CartPageContent />;
}

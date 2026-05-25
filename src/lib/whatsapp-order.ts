import type { CartItem } from "@/types";
import { storeInfo } from "@/lib/data/store";
import { formatPrice } from "@/lib/utils";

export interface CustomerOrderDetails {
  fullName: string;
  phone: string;
  address: string;
  landmark: string;
  pincode: string;
}

export function buildWhatsAppOrderMessage(
  items: CartItem[],
  customer: CustomerOrderDetails,
  total: number
): string {
  const lines: string[] = [
    "Hello, I want to place an order.",
    "",
    `Customer Name: ${customer.fullName}`,
    `Phone Number: ${customer.phone}`,
    `Address: ${customer.address}`,
  ];

  if (customer.landmark.trim()) {
    lines.push(`Landmark: ${customer.landmark}`);
  }
  if (customer.pincode.trim()) {
    lines.push(`Pincode: ${customer.pincode}`);
  }

  lines.push("", "Ordered Items:", "");

  items.forEach((item, index) => {
    const lineTotal = item.product.price * item.quantity;
    const sizeNote = item.selectedSize ? ` (${item.selectedSize})` : "";
    lines.push(
      `${index + 1}. ${item.product.name}${sizeNote} × ${item.quantity} = ${formatPrice(lineTotal)}`
    );
  });

  lines.push("", `Total Amount: ${formatPrice(total)}`);

  return lines.join("\n");
}

export function getWhatsAppOrderLink(
  items: CartItem[],
  customer: CustomerOrderDetails,
  total: number
): string {
  const message = buildWhatsAppOrderMessage(items, customer, total);
  return `${storeInfo.whatsappLink}?text=${encodeURIComponent(message)}`;
}

export function openWhatsAppOrder(
  items: CartItem[],
  customer: CustomerOrderDetails,
  total: number
) {
  const url = getWhatsAppOrderLink(items, customer, total);
  window.open(url, "_blank", "noopener,noreferrer");
}

export function validateOrderForm(data: CustomerOrderDetails): Partial<Record<keyof CustomerOrderDetails, string>> {
  const errors: Partial<Record<keyof CustomerOrderDetails, string>> = {};

  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = "Please enter your full name";
  }

  const phoneDigits = data.phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    errors.phone = "Enter a valid 10-digit mobile number";
  }

  if (!data.address.trim() || data.address.trim().length < 10) {
    errors.address = "Please enter your complete delivery address";
  }

  if (data.pincode.trim() && !/^\d{6}$/.test(data.pincode.trim())) {
    errors.pincode = "Enter a valid 6-digit pincode";
  }

  return errors;
}

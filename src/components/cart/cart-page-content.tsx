"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  MessageCircle,
  User,
  Phone,
  MapPin,
  Navigation,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/utils";
import {
  type CustomerOrderDetails,
  validateOrderForm,
  openWhatsAppOrder,
} from "@/lib/whatsapp-order";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export function CartPageContent() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const [step, setStep] = useState<"cart" | "details">("cart");
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerOrderDetails, string>>>({});
  const [form, setForm] = useState<CustomerOrderDetails>({
    fullName: "",
    phone: "",
    address: "",
    landmark: "",
    pincode: "",
  });

  const subtotal = getSubtotal();

  const updateField = (field: keyof CustomerOrderDetails, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePlaceOrder = () => {
    const validationErrors = validateOrderForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    openWhatsAppOrder(items, form, subtotal);
    clearCart();
    setStep("cart");
    setForm({ fullName: "", phone: "", address: "", landmark: "", pincode: "" });
  };

  if (items.length === 0 && step === "cart") {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto space-y-6"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted mx-auto">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">
            Browse our collection and add items to order via WhatsApp
          </p>
          <Link href="/#collection">
            <Button size="lg" variant="gradient">
              Explore Collection
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 pb-32">
      <ScrollReveal className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold">
          {step === "cart" ? "Your Cart" : "Delivery Details"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {step === "cart"
            ? `${items.length} item(s) · Order via WhatsApp`
            : "Fill in your details to complete the order on WhatsApp"}
        </p>
      </ScrollReveal>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8 max-w-md">
        {["cart", "details"].map((s, i) => (
          <div key={s} className="flex items-center gap-3 flex-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                step === s || (step === "details" && s === "cart")
                  ? "gradient-brand text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span className="text-sm font-medium capitalize hidden sm:inline">
              {s === "cart" ? "Review Cart" : "Your Details"}
            </span>
            {i === 0 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {step === "cart" ? (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                {items.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 p-4 rounded-2xl border bg-card shadow-sm"
                  >
                    <div className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-muted">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium line-clamp-1">{item.product.name}</h3>
                      {(item.selectedSize || item.selectedColor) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.selectedSize && `Size: ${item.selectedSize}`}
                          {item.selectedColor && ` · ${item.selectedColor}`}
                        </p>
                      )}
                      <p className="font-bold text-brand-green mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity - 1,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <motion.span
                            key={item.quantity}
                            initial={{ scale: 1.2 }}
                            animate={{ scale: 1 }}
                            className="w-8 text-center font-semibold"
                          >
                            {item.quantity}
                          </motion.span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.quantity + 1,
                                item.selectedSize,
                                item.selectedColor
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() =>
                            removeItem(item.product.id, item.selectedSize, item.selectedColor)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-2xl border bg-card p-6 md:p-8 space-y-5"
              >
                <h2 className="font-display font-bold text-lg">Customer Details</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="flex items-center gap-1.5 mb-1.5">
                      <User className="h-3.5 w-3.5" /> Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      className={errors.fullName ? "border-destructive" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-1.5 mb-1.5">
                      <Phone className="h-3.5 w-3.5" /> Mobile Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="9876543210"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address" className="flex items-center gap-1.5 mb-1.5">
                      <MapPin className="h-3.5 w-3.5" /> Delivery Address *
                    </Label>
                    <Input
                      id="address"
                      placeholder="House no, Street, Area, City"
                      value={form.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="landmark" className="flex items-center gap-1.5 mb-1.5">
                      <Navigation className="h-3.5 w-3.5" /> Landmark
                    </Label>
                    <Input
                      id="landmark"
                      placeholder="Near temple, school, etc."
                      value={form.landmark}
                      onChange={(e) => updateField("landmark", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="pincode" className="mb-1.5">Pincode</Label>
                    <Input
                      id="pincode"
                      placeholder="603202"
                      maxLength={6}
                      value={form.pincode}
                      onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))}
                      className={errors.pincode ? "border-destructive" : ""}
                    />
                    {errors.pincode && (
                      <p className="text-xs text-destructive mt-1">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                <Button variant="outline" onClick={() => setStep("cart")}>
                  Back to Cart
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border bg-card p-6 shadow-lg space-y-4">
            <h2 className="font-display font-bold text-lg">Order Summary</h2>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-lg pt-4 border-t">
              <span>Total</span>
              <span className="text-brand-green">{formatPrice(subtotal)}</span>
            </div>

            {step === "cart" ? (
              <Button
                size="lg"
                variant="gradient"
                className="w-full"
                onClick={() => setStep("details")}
              >
                Proceed to Order
                <ArrowRight className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                size="lg"
                variant="gradient"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] shadow-[#25D366]/30"
                onClick={handlePlaceOrder}
              >
                <MessageCircle className="h-5 w-5" />
                Place Order on WhatsApp
              </Button>
            )}

            <p className="text-xs text-center text-muted-foreground">
              No online payment — confirm your order directly on WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

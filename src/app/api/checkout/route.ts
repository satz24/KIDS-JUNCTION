import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe/server";

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, total } = body as {
      items: CheckoutItem[];
      shippingAddress: Record<string, string>;
      total: number;
    };

    const orderId = `KJ-${Date.now()}`;

    if (isStripeConfigured && stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: items.map((item) => ({
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              images: [item.image],
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?success=true&order=${orderId}`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        metadata: {
          orderId,
          customerEmail: shippingAddress.email,
        },
      });

      return NextResponse.json({
        orderId,
        sessionId: session.id,
        url: session.url,
      });
    }

    return NextResponse.json({
      orderId,
      message: "Order placed successfully (demo mode)",
      total,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}

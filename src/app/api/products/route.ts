import { NextResponse } from "next/server";
import { products, searchProducts } from "@/lib/data/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  let result = q ? searchProducts(q) : products;

  if (category) {
    result = result.filter((p) => p.category === category);
  }

  return NextResponse.json(result.slice(0, limit));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    return NextResponse.json({
      message: "Product created (connect Supabase for persistence)",
      product: body,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

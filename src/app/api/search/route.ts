import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/data/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const results = searchProducts(q).slice(0, 8).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    image: p.images[0],
    category: p.category,
  }));

  return NextResponse.json(results);
}

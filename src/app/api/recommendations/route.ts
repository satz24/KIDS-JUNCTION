import { NextResponse } from "next/server";
import { getFeaturedProducts, getTrendingProducts } from "@/lib/data/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  const trending = getTrendingProducts();
  const featured = getFeaturedProducts();

  const recommendations = productId
    ? trending.filter((p) => p.id !== productId).slice(0, 4)
    : featured.slice(0, 4);

  return NextResponse.json({
    recommendations,
    algorithm: "collaborative-filtering-v1",
  });
}

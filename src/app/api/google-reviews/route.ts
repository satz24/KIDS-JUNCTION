import { NextResponse } from "next/server";
import { fetchGoogleReviews } from "@/lib/google-reviews";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const data = await fetchGoogleReviews();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

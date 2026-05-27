import { redirect } from "next/navigation";
import { products } from "@/lib/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default function ProductRedirect() {
  redirect("/collection");
}

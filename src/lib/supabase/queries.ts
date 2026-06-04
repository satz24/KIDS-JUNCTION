import { resolveImageSrc } from "@/lib/brand/logo-asset";
import type { DbCategory, DbOrder, DbProduct, DbSubCategory, OrderCartLine, OrderStatus } from "@/types/database";
import type { Product } from "@/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export { supabase, isSupabaseConfigured };

export function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Something went wrong";
}

function throwQueryError(error: { message: string }): never {
  throw new Error(error.message);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function mapDbProduct(row: DbProduct): Product {
  const image = resolveImageSrc(row.image_url);
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    longDescription: row.description,
    price: Number(row.price),
    images: [image],
    category: row.category_id,
    subCategory: row.sub_category_id ?? undefined,
    brand: "Kids Junction",
    ageRange: "All ages",
    rating: 4.8,
    reviewCount: 0,
    inStock: row.stock > 0,
    stockCount: row.stock,
    tags: [],
    featured: row.featured,
    trending: row.featured,
  };
}

export async function fetchCategories(): Promise<DbCategory[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");
  if (error) throwQueryError(error);
  return data ?? [];
}

export async function fetchCategoryById(id: string): Promise<DbCategory | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throwQueryError(error);
  return data;
}

export async function fetchProducts(options?: {
  categoryId?: string;
  subCategoryId?: string;
  featured?: boolean;
  limit?: number;
}): Promise<Product[]> {
  if (!supabase) return [];
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (options?.categoryId) query = query.eq("category_id", options.categoryId);
  if (options?.subCategoryId) query = query.eq("sub_category_id", options.subCategoryId);
  if (options?.featured) query = query.eq("featured", true);
  if (options?.limit) query = query.limit(options.limit);
  const { data, error } = await query;
  if (error) throwQueryError(error);
  return (data as DbProduct[]).map(mapDbProduct);
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throwQueryError(error);
  return data ? mapDbProduct(data as DbProduct) : null;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throwQueryError(error);
  return data ? mapDbProduct(data as DbProduct) : null;
}

export async function searchProductsQuery(query: string): Promise<Product[]> {
  if (!supabase || query.length < 2) return [];
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(8);
  if (error) throwQueryError(error);
  return (data as DbProduct[]).map(mapDbProduct);
}

export async function createOrder(params: {
  customerName: string;
  phone: string;
  address: string;
  cartData: OrderCartLine[];
  totalAmount: number;
}): Promise<DbOrder | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: params.customerName,
      phone: params.phone,
      address: params.address,
      cart_data: params.cartData,
      total_amount: params.totalAmount,
      status: "pending",
    })
    .select()
    .single();
  if (error) throwQueryError(error);
  return data as DbOrder;
}

export async function fetchOrders(): Promise<DbOrder[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throwQueryError(error);
  return (data as DbOrder[]) ?? [];
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throwQueryError(error);
}

export async function deleteOrder(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throwQueryError(error);
}

export async function upsertCategory(category: {
  id: string;
  name: string;
  image_url?: string | null;
}): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("categories").upsert(category);
  if (error) throwQueryError(error);
}

export async function countProductsInCategory(categoryId: string): Promise<number> {
  if (!supabase) return 0;
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", categoryId);
  if (error) throwQueryError(error);
  return count ?? 0;
}

export async function fetchCategoryProductCounts(): Promise<Record<string, number>> {
  if (!supabase) return {};
  const { data, error } = await supabase.from("products").select("category_id");
  if (error) throwQueryError(error);
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
  }
  return counts;
}

export async function deleteCategory(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");

  const { error: productsError } = await supabase
    .from("products")
    .delete()
    .eq("category_id", id);
  if (productsError) throwQueryError(productsError);

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throwQueryError(error);
}

function isMissingSubCategorySchema(message: string): boolean {
  return message.includes("sub_category");
}

export async function fetchSubCategories(categoryId?: string): Promise<DbSubCategory[]> {
  if (!supabase) return [];
  let query = supabase.from("sub_categories").select("*").order("sort_order").order("name");
  if (categoryId) query = query.eq("category_id", categoryId);
  const { data, error } = await query;
  if (error) {
    if (isMissingSubCategorySchema(error.message)) return [];
    throwQueryError(error);
  }
  return data ?? [];
}

export async function upsertSubCategory(subCategory: {
  id: string;
  category_id: string;
  name: string;
  sort_order?: number;
}): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("sub_categories").upsert({
    ...subCategory,
    sort_order: subCategory.sort_order ?? 0,
  });
  if (error) throwQueryError(error);
}

export async function deleteSubCategory(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("sub_categories").delete().eq("id", id);
  if (error) throwQueryError(error);
}

export async function fetchSubCategoryProductCounts(): Promise<Record<string, number>> {
  if (!supabase) return {};
  const { data, error } = await supabase.from("products").select("sub_category_id");
  if (error) {
    if (isMissingSubCategorySchema(error.message)) return {};
    throwQueryError(error);
  }
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    if (!row.sub_category_id) continue;
    counts[row.sub_category_id] = (counts[row.sub_category_id] ?? 0) + 1;
  }
  return counts;
}

export async function fetchSubCategoryCountsByCategory(): Promise<Record<string, number>> {
  if (!supabase) return {};
  const { data, error } = await supabase.from("sub_categories").select("category_id");
  if (error) {
    if (isMissingSubCategorySchema(error.message)) return {};
    throwQueryError(error);
  }
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
  }
  return counts;
}

export async function upsertProduct(product: {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: string;
  sub_category_id?: string | null;
  image_url?: string | null;
  stock: number;
  featured: boolean;
}): Promise<DbProduct> {
  if (!supabase) throw new Error("Supabase not configured");
  const payload = product.id ? product : { ...product, id: undefined };
  const { data, error } = await supabase
    .from("products")
    .upsert(payload)
    .select()
    .single();
  if (error) throwQueryError(error);
  return data as DbProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throwQueryError(error);
}

export async function uploadAdminImage(file: File, folder = "images"): Promise<string> {
  if (!supabase) throw new Error("Supabase not configured");
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeName = slugify(file.name.replace(new RegExp(`\\.${ext}$`, "i"), "")) || "image";
  const path = `${folder}/${Date.now()}-${safeName}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throwQueryError(error);
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

export async function uploadProductImage(file: File): Promise<string> {
  return uploadAdminImage(file, "products");
}

export async function uploadCategoryImage(file: File): Promise<string> {
  return uploadAdminImage(file, "categories");
}

export async function getDashboardStats() {
  const [products, categories, subCategories, orders] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchSubCategories(),
    fetchOrders(),
  ]);
  return {
    productCount: products.length,
    categoryCount: categories.length,
    subCategoryCount: subCategories.length,
    orderCount: orders.length,
    recentOrders: orders.slice(0, 5),
  };
}

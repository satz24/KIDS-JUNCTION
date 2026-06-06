import { resolveImageSrc } from "@/lib/brand/logo-asset";
import {
  getDbProductImages,
  buildProductImageFields,
  getProductPhotoUrls,
} from "@/lib/products/product-images";
import { inferImageExtension, inferImageMime } from "@/lib/images/compress-image";
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
  const images = getDbProductImages(row);
  const price = Number(row.price);
  const originalPrice =
    row.original_price != null && Number(row.original_price) > price
      ? Number(row.original_price)
      : undefined;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    longDescription: row.description,
    price,
    originalPrice,
    images,
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
  original_price?: number | null;
  category_id: string;
  sub_category_id?: string | null;
  image_url?: string | null;
  image_urls?: string[];
  stock: number;
  featured: boolean;
}): Promise<DbProduct> {
  if (!supabase) throw new Error("Supabase not configured");

  await assertAuthenticatedAdmin();

  const images = buildProductImageFields(product.image_urls ?? []);
  const originalPrice =
    product.original_price != null && product.original_price > product.price
      ? product.original_price
      : null;
  const row = {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    original_price: originalPrice,
    category_id: product.category_id,
    sub_category_id: product.sub_category_id ?? null,
    image_url: images.image_url,
    image_urls: images.image_urls,
    stock: product.stock,
    featured: product.featured,
  };

  if (product.id) {
    const { data, error } = await supabase
      .from("products")
      .update(row)
      .eq("id", product.id)
      .select()
      .single();
    if (error) throwQueryError(error);
    if (!data) throw new Error("Product update failed — no rows were changed.");
    return data as DbProduct;
  }

  const { data, error } = await supabase.from("products").insert(row).select().single();
  if (error) throwQueryError(error);
  return data as DbProduct;
}

export async function updateProductImages(
  id: string,
  urls: string[],
  options?: { allowEmpty?: boolean }
): Promise<DbProduct> {
  if (!supabase) throw new Error("Supabase not configured");

  const images = buildProductImageFields(urls);
  if (images.image_urls.length === 0 && !options?.allowEmpty) {
    throw new Error("No valid product photos to save.");
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      image_url: images.image_url,
      image_urls: images.image_urls,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throwQueryError(error);
  if (!data) throw new Error("Photo save failed — product not found or access denied.");

  if (!options?.allowEmpty) {
    const saved = getProductPhotoUrls(data as DbProduct);
    if (saved.length === 0) {
      throw new Error("Photos were not saved. Please log in again and retry.");
    }
  }

  return data as DbProduct;
}

async function assertAuthenticatedAdmin(): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("Your admin session expired. Please log in again and retry.");
  }
}

export async function deleteProduct(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throwQueryError(error);
}

export async function uploadAdminImage(file: File, folder = "images"): Promise<string> {
  if (!supabase) throw new Error("Supabase not configured");

  const ext = inferImageExtension(file);
  const safeName = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
  const path = `${folder}/${Date.now()}-${safeName}.${ext}`;
  const contentType = inferImageMime(file);

  const { error } = await supabase.storage.from("product-images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType,
  });
  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("row-level security") || message.includes("403") || message.includes("unauthorized")) {
      throw new Error("Please log in to admin again, then retry the upload.");
    }
    throwQueryError(error);
  }
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

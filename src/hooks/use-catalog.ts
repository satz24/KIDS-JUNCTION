"use client";

import { useCallback, useEffect, useState } from "react";
import type { DbCategory } from "@/types/database";
import type { Product } from "@/types";
import {
  fetchCategories,
  fetchProducts,
  getErrorMessage,
  isSupabaseConfigured,
} from "@/lib/supabase/queries";
import { products as staticProducts } from "@/lib/data/products";

const STATIC_CATEGORY_MAP: DbCategory[] = [
  { id: "baby", name: "Baby", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "footwear", name: "Footwear", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "girls", name: "Girls", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "boys", name: "Boys", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "baby-essentials", name: "Baby Essentials", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "new-collection", name: "New Collection", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "travel-bedroom", name: "Travel & Bedroom", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "toys-school", name: "Toys & School", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "gift-sets", name: "Gift Sets", image_url: "/brand/KJ_final.jpg", created_at: "" },
  { id: "online-gift-card", name: "Online Gift Card", image_url: "/brand/KJ_final.jpg", created_at: "" },
];

export function useCategories() {
  const [categories, setCategories] = useState<DbCategory[]>(STATIC_CATEGORY_MAP);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setCategories(STATIC_CATEGORY_MAP);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data.length > 0 ? data : STATIC_CATEGORY_MAP);
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e));
      setCategories(STATIC_CATEGORY_MAP);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { categories, loading, error, reload };
}

export function useProducts(options?: { categoryId?: string; featured?: boolean; limit?: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const data = await fetchProducts(options);
        if (data.length > 0) {
          setProducts(data);
          setError(null);
          setLoading(false);
          return;
        }
      }
      let fallback = staticProducts;
      if (options?.categoryId) {
        fallback = fallback.filter((p) => p.category === options.categoryId);
      }
      if (options?.featured) fallback = fallback.filter((p) => p.featured);
      if (options?.limit) fallback = fallback.slice(0, options.limit);
      setProducts(fallback);
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e));
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [options?.categoryId, options?.featured, options?.limit]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { products, loading, error, reload };
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      if (isSupabaseConfigured) {
        const { fetchProductBySlug } = await import("@/lib/supabase/queries");
        const data = await fetchProductBySlug(slug);
        if (!cancelled && data) {
          setProduct(data);
          setLoading(false);
          return;
        }
      }
      const { getProductBySlug } = await import("@/lib/data/products");
      if (!cancelled) {
        setProduct(getProductBySlug(slug) ?? null);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { product, loading };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import type { DbCategory, DbSubCategory } from "@/types/database";
import type { Product } from "@/types";
import {
  fetchCategories,
  fetchProducts,
  fetchSubCategories,
  getErrorMessage,
  isSupabaseConfigured,
} from "@/lib/supabase/queries";
import { STORE_CATEGORIES } from "@/lib/data/store-categories";
import { getStoreSubCategoriesForCategory, STORE_SUB_CATEGORIES } from "@/lib/data/store-sub-categories";
import { STORE_PRODUCTS } from "@/lib/data/store-products";

const STATIC_CATEGORY_MAP = STORE_CATEGORIES;

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

export function useSubCategories(categoryId?: string) {
  const [subCategories, setSubCategories] = useState<DbSubCategory[]>(() =>
    categoryId ? getStoreSubCategoriesForCategory(categoryId) : STORE_SUB_CATEGORIES
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const fallback = categoryId
      ? getStoreSubCategoriesForCategory(categoryId)
      : STORE_SUB_CATEGORIES;

    if (!isSupabaseConfigured) {
      setSubCategories(fallback);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchSubCategories(categoryId);
      setSubCategories(data.length > 0 ? data : fallback);
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e));
      setSubCategories(fallback);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { subCategories, loading, error, reload };
}

export function useProducts(options?: {
  categoryId?: string;
  subCategoryId?: string;
  featured?: boolean;
  limit?: number;
}) {
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
      let fallback = STORE_PRODUCTS;
      if (options?.categoryId) {
        fallback = fallback.filter((p) => p.category === options.categoryId);
      }
      if (options?.subCategoryId) {
        fallback = fallback.filter((p) => p.subCategory === options.subCategoryId);
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
  }, [options?.categoryId, options?.subCategoryId, options?.featured, options?.limit]);

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

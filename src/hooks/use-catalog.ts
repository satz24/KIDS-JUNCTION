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
import { getStoreSubCategoriesForCategory } from "@/lib/data/store-sub-categories";
import { STORE_PRODUCTS } from "@/lib/data/store-products";

const STATIC_CATEGORIES = STORE_CATEGORIES;

export function useCategories() {
  const [categories, setCategories] = useState<DbCategory[]>(() =>
    isSupabaseConfigured ? [] : STATIC_CATEGORIES
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setCategories(STATIC_CATEGORIES);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e));
      setCategories(STATIC_CATEGORIES);
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
  const [subCategories, setSubCategories] = useState<DbSubCategory[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const fallback = categoryId ? getStoreSubCategoriesForCategory(categoryId) : [];

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

function filterStaticProducts(options?: {
  categoryId?: string;
  subCategoryId?: string;
  featured?: boolean;
  limit?: number;
}): Product[] {
  let fallback = STORE_PRODUCTS;
  if (options?.categoryId) {
    fallback = fallback.filter((p) => p.category === options.categoryId);
  }
  if (options?.subCategoryId) {
    fallback = fallback.filter((p) => p.subCategory === options.subCategoryId);
  }
  if (options?.featured) fallback = fallback.filter((p) => p.featured);
  if (options?.limit) fallback = fallback.slice(0, options.limit);
  return fallback;
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

  const categoryId = options?.categoryId;
  const subCategoryId = options?.subCategoryId;
  const featured = options?.featured;
  const limit = options?.limit;

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      if (isSupabaseConfigured) {
        const data = await fetchProducts({ categoryId, subCategoryId, featured, limit });
        setProducts(data);
        setError(null);
        return;
      }
      setProducts(filterStaticProducts({ categoryId, subCategoryId, featured, limit }));
      setError(null);
    } catch (e) {
      setError(getErrorMessage(e));
      setProducts(filterStaticProducts({ categoryId, subCategoryId, featured, limit }));
    } finally {
      setLoading(false);
    }
  }, [categoryId, subCategoryId, featured, limit]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        if (isSupabaseConfigured) {
          const data = await fetchProducts({ categoryId, subCategoryId, featured, limit });
          if (cancelled) return;
          setProducts(data);
          setError(null);
          return;
        }
        if (cancelled) return;
        setProducts(filterStaticProducts({ categoryId, subCategoryId, featured, limit }));
        setError(null);
      } catch (e) {
        if (cancelled) return;
        setError(getErrorMessage(e));
        setProducts(filterStaticProducts({ categoryId, subCategoryId, featured, limit }));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryId, subCategoryId, featured, limit]);

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

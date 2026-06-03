"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  deleteProduct,
  fetchCategories,
  getErrorMessage,
  slugify,
  upsertProduct,
  uploadProductImage,
  isSupabaseConfigured,
} from "@/lib/supabase/queries";
import type { DbCategory, DbProduct } from "@/types/database";
import { AdminImageUpload } from "@/components/admin/admin-image-upload";
import { CategoryCircleImage } from "@/components/products/category-circle-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "baby",
    stock: "",
    description: "",
    featured: false,
    image_url: "",
  });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const [p, c] = await Promise.all([
        isSupabaseConfigured
          ? (async () => {
              const { supabase } = await import("@/lib/supabase/client");
              if (!supabase) return [];
              const { data, error: productsError } = await supabase
                .from("products")
                .select("*")
                .order("name");
              if (productsError) throw new Error(productsError.message);
              return (data as DbProduct[]) ?? [];
            })()
          : [],
        fetchCategories(),
      ]);
      setProducts(p);
      setCategories(c);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      setProducts([]);
      setCategories([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const productSections = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? products.filter((p) => p.name.toLowerCase().includes(query))
      : products;

    const sections = categories.map((category) => ({
      category,
      products: filtered.filter((p) => p.category_id === category.id),
    }));

    const knownIds = new Set(categories.map((c) => c.id));
    const uncategorized = filtered.filter((p) => !knownIds.has(p.category_id));
    if (uncategorized.length > 0) {
      sections.push({
        category: {
          id: "uncategorized",
          name: "Uncategorized",
          image_url: null,
          created_at: "",
        },
        products: uncategorized,
      });
    }

    return query ? sections.filter((section) => section.products.length > 0) : sections;
  }, [products, categories, search]);

  const openAddForm = (categoryId?: string) => {
    resetForm();
    if (categoryId) {
      setForm((f) => ({ ...f, category_id: categoryId }));
    }
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      category_id: categories[0]?.id ?? "baby",
      stock: "",
      description: "",
      featured: false,
      image_url: "",
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadProductImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    try {
      await upsertProduct({
        id: editing?.id,
        name: form.name,
        slug: editing?.slug ?? slugify(form.name),
        description: form.description,
        price: parseFloat(form.price),
        category_id: form.category_id,
        image_url: form.image_url || "/brand/KJ_final.jpg",
        stock: parseInt(form.stock) || 0,
        featured: form.featured,
      });
      await load();
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleEdit = (product: DbProduct) => {
    setEditing(product);
    setForm({
      name: product.name,
      price: String(product.price),
      category_id: product.category_id,
      stock: String(product.stock),
      description: product.description,
      featured: product.featured,
      image_url: product.image_url ?? "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    await load();
  };

  if (!isSupabaseConfigured) {
    return <p className="text-muted-foreground">Connect Supabase to manage products.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm">Changes appear on the website instantly</p>
        </div>
        <Button variant="gradient" onClick={() => openAddForm()}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10 surface-input" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{error}</p>
      )}

      {showForm && (
        <Card className="glass-panel border-0">
          <CardHeader>
            <CardTitle>{editing ? "Edit Product" : "New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label>Name</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="surface-input" />
              </div>
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="surface-input" />
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="surface-input" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Category</Label>
                <select
                  className="flex h-11 w-full rounded-xl surface-input px-3 text-sm"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="surface-input" />
              </div>
              <AdminImageUpload
                label="Product Photo"
                value={form.image_url}
                uploading={uploading}
                onUpload={handleImageUpload}
              />
              <label className="flex items-center gap-2 sm:col-span-2 text-sm font-semibold">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                Featured product
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" variant="gradient" disabled={uploading}>
                  {editing ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-8">
        {productSections.map(({ category, products: sectionProducts }) => (
          <section key={category.id} className="space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--glass-border)] pb-3">
              <div className="flex items-center gap-3 min-w-0">
                <CategoryCircleImage
                  src={category.image_url}
                  alt={category.name}
                  size="sm"
                  contain={!category.image_url?.startsWith("http")}
                />
                <div className="min-w-0">
                  <h2 className="font-display text-xl font-bold truncate">{category.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {sectionProducts.length} product{sectionProducts.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              {category.id !== "uncategorized" && (
                <Button size="sm" variant="outline" onClick={() => openAddForm(category.id)}>
                  <Plus className="h-3.5 w-3.5" /> Add to {category.name}
                </Button>
              )}
            </div>

            {sectionProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No products in this category yet.</p>
            ) : (
              <div className="grid gap-3">
                {sectionProducts.map((product) => (
                  <Card key={product.id} className="glass-card border-0">
                    <CardContent className="flex items-center gap-4 p-4">
                      <Image
                        src={product.image_url ?? "/brand/KJ_final.jpg"}
                        alt={product.name}
                        width={64}
                        height={64}
                        className="rounded-xl object-contain bg-white p-1 shrink-0"
                        unoptimized
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold truncate">{product.name}</p>
                          {product.featured && (
                            <Badge className="bg-brand-pink text-white border-0">Featured</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(Number(product.price))} · Stock: {product.stock}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        ))}

        {productSections.every((section) => section.products.length === 0) && (
          <p className="text-center text-muted-foreground py-12">No products match your search.</p>
        )}
      </div>
    </div>
  );
}

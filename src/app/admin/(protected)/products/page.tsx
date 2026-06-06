"use client";

import { useEffect, useMemo, useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  deleteProduct,
  fetchCategories,
  fetchSubCategories,
  getErrorMessage,
  slugify,
  updateProductImages,
  upsertProduct,
  uploadProductImage,
  isSupabaseConfigured,
} from "@/lib/supabase/queries";
import type { DbCategory, DbProduct, DbSubCategory } from "@/types/database";
import { AdminMultiImageUpload } from "@/components/admin/admin-multi-image-upload";
import {
  getDbProductCoverUrl,
  getProductPhotoUrls,
  sanitizeProductImageUrls,
} from "@/lib/products/product-images";
import { resolveImageSrc } from "@/lib/brand/logo-asset";
import { CategoryCircleImage } from "@/components/products/category-circle-image";
import { categoryImageUsesContain } from "@/lib/brand/category-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { compressImageForUpload } from "@/lib/images/compress-image";

function isPendingPreviewUrl(url: string): boolean {
  return url.startsWith("blob:") || url.startsWith("data:");
}

function readyImageUrls(urls: string[]): string[] {
  return sanitizeProductImageUrls(urls).filter((url) => !isPendingPreviewUrl(url));
}

function ProductRow({
  product,
  onEdit,
  onDelete,
}: {
  product: DbProduct;
  onEdit: (product: DbProduct) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="glass-card border-0">
      <CardContent className="flex items-center gap-4 p-4">
        <Image
          src={resolveImageSrc(getDbProductCoverUrl(product))}
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
            {product.original_price != null &&
            Number(product.original_price) > Number(product.price) ? (
              <>
                <span className="font-semibold text-foreground">
                  {formatPrice(Number(product.price))}
                </span>
                <span className="line-through ml-1.5">
                  {formatPrice(Number(product.original_price))}
                </span>
              </>
            ) : (
              formatPrice(Number(product.price))
            )}{" "}
            · Stock: {product.stock}
          </p>
        </div>
        <div className="flex gap-1 shrink-0">
          <Button size="icon" variant="ghost" onClick={() => onEdit(product)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => onDelete(product.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [subCategories, setSubCategories] = useState<DbSubCategory[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    original_price: "",
    category_id: "",
    sub_category_id: "",
    stock: "",
    description: "",
    featured: false,
    image_urls: [] as string[],
  });
  const [error, setError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const patchProductInList = (id: string, patch: Partial<DbProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const buildProductPayload = (imageUrls: string[]) => {
    const sub = subCategories.find((s) => s.id === form.sub_category_id);
    if (!sub) {
      throw new Error("Please select a sub-category for this product.");
    }
    const images = readyImageUrls(imageUrls);
    if (images.length === 0) {
      throw new Error("Please upload at least one product photo.");
    }
    const salePrice = parseFloat(form.price);
    if (Number.isNaN(salePrice) || salePrice < 0) {
      throw new Error("Enter a valid sale price.");
    }
    const originalRaw = form.original_price.trim();
    let original_price: number | null = null;
    if (originalRaw) {
      original_price = parseFloat(originalRaw);
      if (Number.isNaN(original_price) || original_price <= 0) {
        throw new Error("Enter a valid original price or leave it empty.");
      }
      if (original_price <= salePrice) {
        throw new Error("Original price must be higher than the sale price to show a discount.");
      }
    }
    return {
      id: editing?.id,
      name: form.name,
      slug: editing?.slug ?? slugify(form.name),
      description: form.description,
      price: salePrice,
      original_price,
      category_id: sub.category_id,
      sub_category_id: sub.id,
      image_urls: images,
      image_url: images[0],
      stock: parseInt(form.stock, 10) || 0,
      featured: form.featured,
    };
  };

  const persistIfEditing = async (imageUrls: string[]) => {
    if (!editing?.id) return null;
    const cleaned = readyImageUrls(imageUrls);
    if (cleaned.length === 0) return null;

    const saved = await updateProductImages(editing.id, cleaned);
    const savedUrls = getProductPhotoUrls(saved);
    setForm((f) => ({ ...f, image_urls: savedUrls }));
    patchProductInList(editing.id, {
      image_url: saved.image_url,
      image_urls: saved.image_urls,
    });
    setSaveNotice(`Saved ${savedUrls.length} photo${savedUrls.length === 1 ? "" : "s"} — visible on the shop now.`);
    return savedUrls;
  };

  const appendUploadedImage = (url: string): string[] => {
    let nextUrls: string[] = [];
    setForm((f) => {
      nextUrls = [...f.image_urls, url];
      return { ...f, image_urls: nextUrls };
    });
    return nextUrls;
  };

  const replaceImageUrl = (from: string, to: string): string[] => {
    let nextUrls: string[] = [];
    setForm((f) => {
      nextUrls = f.image_urls.map((url) => (url === from ? to : url));
      return { ...f, image_urls: nextUrls };
    });
    return nextUrls;
  };

  const removeImageUrl = (url: string) => {
    setForm((f) => ({ ...f, image_urls: f.image_urls.filter((item) => item !== url) }));
  };

  const load = async () => {
    try {
      const [p, c, s] = await Promise.all([
        isSupabaseConfigured
          ? (async () => {
              const { supabase } = await import("@/lib/supabase/client");
              if (!supabase) return [];
              const { data, error: productsError } = await supabase
                .from("products")
                .select("id,name,slug,description,price,original_price,category_id,sub_category_id,image_url,image_urls,stock,featured,created_at")
                .order("name");
              if (productsError) throw new Error(productsError.message);
              return (data as DbProduct[]) ?? [];
            })()
          : [],
        fetchCategories(),
        fetchSubCategories(),
      ]);
      setProducts(p);
      setCategories(c);
      setSubCategories(s);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      setProducts([]);
      setCategories([]);
      setSubCategories([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categoryGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? products.filter((p) => p.name.toLowerCase().includes(query))
      : products;

    return categories.map((category) => {
      const categorySubs = subCategories
        .filter((sub) => sub.category_id === category.id)
        .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));

      const categoryProducts = filtered.filter((p) => p.category_id === category.id);
      const assignedIds = new Set<string>();

      const subSections = categorySubs.map((subCategory) => {
        const subProducts = categoryProducts.filter((p) => p.sub_category_id === subCategory.id);
        subProducts.forEach((p) => assignedIds.add(p.id));
        return { subCategory, products: subProducts };
      });

      const unassigned = categoryProducts.filter((p) => !p.sub_category_id || !assignedIds.has(p.id));

      return { category, subSections, unassigned };
    });
  }, [products, categories, subCategories, search]);

  const hasVisibleProducts = categoryGroups.some(
    (group) =>
      group.unassigned.length > 0 || group.subSections.some((section) => section.products.length > 0)
  );

  const openAddForm = (subCategoryId?: string) => {
    const sub = subCategoryId ? subCategories.find((s) => s.id === subCategoryId) : undefined;
    const defaultSub = sub ?? subCategories[0];
    setEditing(null);
    setForm({
      name: "",
      price: "",
      original_price: "",
      category_id: defaultSub?.category_id ?? categories[0]?.id ?? "",
      sub_category_id: defaultSub?.id ?? "",
      stock: "",
      description: "",
      featured: false,
      image_urls: [],
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      original_price: "",
      category_id: "",
      sub_category_id: "",
      stock: "",
      description: "",
      featured: false,
      image_urls: [],
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    const sub = subCategories.find((s) => s.id === subCategoryId);
    setForm((f) => ({
      ...f,
      sub_category_id: subCategoryId,
      category_id: sub?.category_id ?? f.category_id,
    }));
  };

  const handleImageUpload = async (file: File) => {
    setSaveNotice(null);

    const previewUrl = URL.createObjectURL(file);
    flushSync(() => {
      appendUploadedImage(previewUrl);
      setUploading(true);
      setError(null);
    });

    try {
      const compressed = await compressImageForUpload(file);
      const url = await uploadProductImage(compressed);
      const newUrls = replaceImageUrl(previewUrl, url);
      URL.revokeObjectURL(previewUrl);

      if (editing?.id) {
        await persistIfEditing(newUrls);
      } else {
        setSaveNotice("Photo uploaded — click Create to save this new product.");
      }
    } catch (err) {
      removeImageUrl(previewUrl);
      URL.revokeObjectURL(previewUrl);
      setError(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const removed = form.image_urls[index];
    const newUrls = form.image_urls.filter((_, i) => i !== index);
    setForm((f) => ({ ...f, image_urls: newUrls }));
    setSaveNotice(null);
    if (removed?.startsWith("blob:")) {
      URL.revokeObjectURL(removed);
      return;
    }
    if (editing?.id) {
      try {
        if (newUrls.length === 0) {
          const saved = await updateProductImages(editing.id, [], { allowEmpty: true });
          patchProductInList(editing.id, {
            image_url: saved.image_url,
            image_urls: saved.image_urls,
          });
          setSaveNotice("All photos removed.");
        } else {
          await persistIfEditing(newUrls);
        }
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };

  const handleSetPrimaryImage = async (index: number) => {
    if (index <= 0 || index >= form.image_urls.length) return;
    const next = [...form.image_urls];
    const [picked] = next.splice(index, 1);
    next.unshift(picked);
    setForm((f) => ({ ...f, image_urls: next }));
    setSaveNotice(null);
    if (editing?.id) {
      try {
        await persistIfEditing(next);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;

    if (uploading || form.image_urls.some(isPendingPreviewUrl)) {
      setError("Photo still uploading — wait until the spinner on the thumbnail stops.");
      return;
    }
    if (!form.sub_category_id) {
      setError("Please select a sub-category for this product.");
      return;
    }
    const imageUrls = readyImageUrls(form.image_urls);
    if (imageUrls.length === 0) {
      setError(
        "No product photo saved yet. Click Upload Photos, pick an image, and wait for the green saved message before Update."
      );
      return;
    }
    try {
      setSaving(true);
      setSaveNotice(null);

      const saved = await upsertProduct(buildProductPayload(imageUrls));
      patchProductInList(saved.id, saved);

      if (editing) {
        setSaveNotice("Product updated — refresh the shop page to see the new photos.");
        setError(null);
      } else {
        await load();
        resetForm();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product: DbProduct) => {
    const imageUrls = getProductPhotoUrls(product);
    setEditing(product);
    setSaveNotice(null);
    setError(null);
    setForm({
      name: product.name,
      price: String(product.price),
      original_price:
        product.original_price != null && Number(product.original_price) > Number(product.price)
          ? String(product.original_price)
          : "",
      category_id: product.category_id,
      sub_category_id: product.sub_category_id ?? "",
      stock: String(product.stock),
      description: product.description,
      featured: product.featured,
      image_urls: imageUrls,
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
          <p className="text-muted-foreground text-sm">
            Add products under each sub-category — they appear on the shop filtered by sub-category
          </p>
        </div>
        <Button variant="gradient" onClick={() => openAddForm()} disabled={subCategories.length === 0}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10 surface-input"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{error}</p>
      )}

      {saveNotice && (
        <p className="text-sm text-brand-green bg-brand-green/10 rounded-xl px-3 py-2">{saveNotice}</p>
      )}

      {subCategories.length === 0 && (
        <p className="text-sm text-muted-foreground bg-muted/50 rounded-xl px-3 py-2">
          Create sub-categories first, then add products under each one.
        </p>
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
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="surface-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Sale Price (₹)</Label>
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="surface-input"
                />
              </div>
              <div className="space-y-2">
                <Label>Original Price / MRP (₹) — optional</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Leave empty for no discount"
                  value={form.original_price}
                  onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                  className="surface-input"
                />
                <p className="text-xs text-muted-foreground">
                  Must be higher than sale price — shows strikethrough on the shop
                </p>
              </div>
              <div className="space-y-2">
                <Label>Stock</Label>
                <Input
                  required
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="surface-input"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Sub Category</Label>
                <select
                  required
                  className="flex h-11 w-full rounded-xl surface-input px-3 text-sm"
                  value={form.sub_category_id}
                  onChange={(e) => handleSubCategoryChange(e.target.value)}
                >
                  <option value="">Select sub-category</option>
                  {categories.map((category) => {
                    const subs = subCategories.filter((s) => s.category_id === category.id);
                    if (subs.length === 0) return null;
                    return (
                      <optgroup key={category.id} label={category.name}>
                        {subs.map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                            {subs.filter((s) => s.name === sub.name).length > 1
                              ? ` (${sub.id})`
                              : ""}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="surface-input"
                />
              </div>
              <AdminMultiImageUpload
                values={form.image_urls}
                uploading={uploading}
                onUpload={handleImageUpload}
                onRemove={handleRemoveImage}
                onSetPrimary={handleSetPrimaryImage}
              />
              {uploading && (
                <p className="text-sm text-brand-blue sm:col-span-2">
                  Compressing &amp; uploading… preview shows instantly; wait for the green saved message before Update.
                </p>
              )}
              <label className="flex items-center gap-2 sm:col-span-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                />
                Featured product
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" variant="gradient" disabled={uploading || saving}>
                  {saving ? "Saving..." : editing ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-10">
        {categoryGroups.map(({ category, subSections, unassigned }) => {
          const totalInCategory =
            unassigned.length + subSections.reduce((sum, s) => sum + s.products.length, 0);
          if (search && totalInCategory === 0) return null;

          return (
            <section key={category.id} className="space-y-4">
              <div className="flex items-center gap-3 border-b border-[var(--glass-border)] pb-3">
                <CategoryCircleImage
                  src={category.image_url}
                  alt={category.name}
                  size="sm"
                  contain={categoryImageUsesContain(category.image_url)}
                />
                <div>
                  <h2 className="font-display text-xl font-bold">{category.name}</h2>
                  <p className="text-xs text-muted-foreground">
                    {totalInCategory} product{totalInCategory === 1 ? "" : "s"} ·{" "}
                    {subSections.length} sub-categor{subSections.length === 1 ? "y" : "ies"}
                  </p>
                </div>
              </div>

              {subSections.map(({ subCategory, products: subProducts }) => (
                <div key={subCategory.id} className="space-y-3 pl-2 sm:pl-4 border-l-2 border-brand-pink/20">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-brand-pink">{subCategory.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {subProducts.length} product{subProducts.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => openAddForm(subCategory.id)}>
                      <Plus className="h-3.5 w-3.5" /> Add to {subCategory.name}
                    </Button>
                  </div>

                  {subProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">No products in this sub-category yet.</p>
                  ) : (
                    <div className="grid gap-3">
                      {subProducts.map((product) => (
                        <ProductRow
                          key={product.id}
                          product={product}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {unassigned.length > 0 && (
                <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-amber-300/40">
                  <div>
                    <h3 className="font-semibold text-amber-700">Needs sub-category</h3>
                    <p className="text-xs text-muted-foreground">
                      Edit these products and assign a sub-category
                    </p>
                  </div>
                  <div className="grid gap-3">
                    {unassigned.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}

        {!hasVisibleProducts && (
          <p className="text-center text-muted-foreground py-12">No products match your search.</p>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  countProductsInCategory,
  deleteCategory,
  fetchCategories,
  fetchCategoryProductCounts,
  fetchSubCategoryCountsByCategory,
  getErrorMessage,
  slugify,
  upsertCategory,
  uploadCategoryImage,
  isSupabaseConfigured,
} from "@/lib/supabase/queries";
import type { DbCategory } from "@/types/database";
import { AdminImageUpload } from "@/components/admin/admin-image-upload";
import { CategoryCircleImage } from "@/components/products/category-circle-image";
import { categoryImageUsesContain } from "@/lib/brand/category-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [subCategoryCounts, setSubCategoryCounts] = useState<Record<string, number>>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DbCategory | null>(null);
  const [form, setForm] = useState({ id: "", name: "", image_url: "" });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const [data, counts, subCounts] = await Promise.all([
        fetchCategories(),
        fetchCategoryProductCounts(),
        fetchSubCategoryCountsByCategory(),
      ]);
      setCategories(data);
      setProductCounts(counts);
      setSubCategoryCounts(subCounts);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      setCategories([]);
      setProductCounts({});
      setSubCategoryCounts({});
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ id: "", name: "", image_url: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadCategoryImage(file);
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
      const id = editing?.id ?? slugify(form.name);
      await upsertCategory({
        id,
        name: form.name,
        image_url: form.image_url || "/brand/KJ_final.jpg",
      });
      await load();
      resetForm();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (cat: DbCategory) => {
    setEditing(cat);
    setForm({
      id: cat.id,
      name: cat.name,
      image_url: cat.image_url ?? "",
    });
    setShowForm(true);
  };

  const handleDelete = async (cat: DbCategory) => {
    setError(null);
    setDeletingId(cat.id);
    try {
      const count = productCounts[cat.id] ?? (await countProductsInCategory(cat.id));

      if (count > 0) {
        const confirmed = window.confirm(
          `"${cat.name}" has ${count} product(s).\n\nDelete this category and all ${count} linked product(s)? This cannot be undone.`
        );
        if (!confirmed) return;
      } else if (!window.confirm(`Delete "${cat.name}"?`)) {
        return;
      }

      await deleteCategory(cat.id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  if (!isSupabaseConfigured) {
    return <p className="text-muted-foreground">Connect Supabase to manage categories.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm">{categories.length} categories</p>
        </div>
        <Button variant="gradient" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{error}</p>
      )}

      {showForm && (
        <Card className="glass-panel border-0">
          <CardHeader><CardTitle>{editing ? "Edit Category" : "New Category"}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="surface-input"
                  placeholder="e.g. Baby Cycles"
                />
              </div>
              <AdminImageUpload
                label="Category Photo"
                value={form.image_url}
                uploading={uploading}
                onUpload={handleImageUpload}
                previewRounded="full"
              />
              <div className="flex gap-2">
                <Button type="submit" variant="gradient" disabled={uploading}>
                  Save
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const count = productCounts[cat.id] ?? 0;
          const subCount = subCategoryCounts[cat.id] ?? 0;
          return (
            <Card key={cat.id} className="glass-card border-0">
              <CardContent className="p-4 flex items-center gap-3">
                <CategoryCircleImage
                  src={cat.image_url}
                  alt={cat.name}
                  size="sm"
                  contain={categoryImageUsesContain(cat.image_url)}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold truncate">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.id}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {count} product{count === 1 ? "" : "s"} · {subCount} sub-categor
                    {subCount === 1 ? "y" : "ies"}
                  </p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => handleEdit(cat)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  disabled={deletingId === cat.id}
                  onClick={() => handleDelete(cat)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

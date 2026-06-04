"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  deleteSubCategory,
  fetchCategories,
  fetchSubCategories,
  fetchSubCategoryProductCounts,
  getErrorMessage,
  slugify,
  upsertSubCategory,
  isSupabaseConfigured,
} from "@/lib/supabase/queries";
import type { DbCategory, DbSubCategory } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSubCategoriesPage() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [subCategories, setSubCategories] = useState<DbSubCategory[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DbSubCategory | null>(null);
  const [form, setForm] = useState({ category_id: "", name: "", sort_order: "1" });
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const [cats, subs, counts] = await Promise.all([
        fetchCategories(),
        fetchSubCategories(),
        fetchSubCategoryProductCounts(),
      ]);
      setCategories(cats);
      setSubCategories(subs);
      setProductCounts(counts);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      setCategories([]);
      setSubCategories([]);
      setProductCounts({});
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sections = useMemo(() => {
    return categories.map((category) => ({
      category,
      items: subCategories.filter((sub) => sub.category_id === category.id),
    }));
  }, [categories, subCategories]);

  const resetForm = () => {
    setForm({
      category_id: categories[0]?.id ?? "",
      name: "",
      sort_order: "1",
    });
    setEditing(null);
    setShowForm(false);
  };

  const openAddForm = (categoryId?: string) => {
    resetForm();
    if (categoryId) {
      const category = categories.find((c) => c.id === categoryId);
      setForm({
        category_id: categoryId,
        name: category?.name ?? "",
        sort_order: String(
          subCategories.filter((s) => s.category_id === categoryId).length + 1
        ),
      });
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    try {
      const categoryId = form.category_id;
      const id =
        editing?.id ??
        `${slugify(categoryId)}-${slugify(form.name) || "sub"}-${Date.now().toString(36)}`;
      await upsertSubCategory({
        id,
        category_id: categoryId,
        name: form.name,
        sort_order: parseInt(form.sort_order, 10) || 0,
      });
      await load();
      resetForm();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEdit = (sub: DbSubCategory) => {
    setEditing(sub);
    setForm({
      category_id: sub.category_id,
      name: sub.name,
      sort_order: String(sub.sort_order),
    });
    setShowForm(true);
  };

  const handleDelete = async (sub: DbSubCategory) => {
    setError(null);
    setDeletingId(sub.id);
    try {
      const count = productCounts[sub.id] ?? 0;
      if (count > 0) {
        const confirmed = window.confirm(
          `"${sub.name}" has ${count} product(s) linked.\n\nDelete this sub-category anyway? Products will stay in the parent category.`
        );
        if (!confirmed) return;
      } else if (!window.confirm(`Delete "${sub.name}"?`)) {
        return;
      }

      await deleteSubCategory(sub.id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  if (!isSupabaseConfigured) {
    return <p className="text-muted-foreground">Connect Supabase to manage sub-categories.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display text-3xl font-bold">Sub Categories</h1>
          <p className="text-muted-foreground text-sm">{subCategories.length} sub-categories</p>
        </div>
        <Button variant="gradient" onClick={() => openAddForm()}>
          <Plus className="h-4 w-4" /> Add Sub Category
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{error}</p>
      )}

      {showForm && (
        <Card className="glass-panel border-0">
          <CardHeader>
            <CardTitle>{editing ? "Edit Sub Category" : "New Sub Category"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Parent Category</Label>
                <select
                  required
                  className="flex h-11 w-full rounded-xl surface-input px-3 text-sm"
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  disabled={Boolean(editing)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
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
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                  className="surface-input"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="gradient">
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

      <div className="space-y-8">
        {sections.map(({ category, items }) => (
          <section key={category.id} className="space-y-3">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--glass-border)] pb-3">
              <div>
                <h2 className="font-display text-xl font-bold">{category.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {items.length} sub-categor{items.length === 1 ? "y" : "ies"}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => openAddForm(category.id)}>
                <Plus className="h-3.5 w-3.5" /> Add to {category.name}
              </Button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground py-2">No sub-categories yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((sub) => {
                  const count = productCounts[sub.id] ?? 0;
                  return (
                    <Card key={sub.id} className="glass-card border-0">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{sub.name}</p>
                          <p className="text-xs text-muted-foreground">{sub.id}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {count} product{count === 1 ? "" : "s"} · Order {sub.sort_order}
                          </p>
                        </div>
                        <Button size="icon" variant="ghost" onClick={() => handleEdit(sub)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={deletingId === sub.id}
                          onClick={() => handleDelete(sub)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

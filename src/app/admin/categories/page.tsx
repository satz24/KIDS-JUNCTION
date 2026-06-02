"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  deleteCategory,
  fetchCategories,
  slugify,
  upsertCategory,
  isSupabaseConfigured,
} from "@/lib/supabase/queries";
import type { DbCategory } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DbCategory | null>(null);
  const [form, setForm] = useState({ id: "", name: "", image_url: "/brand/KJ_final.jpg" });

  const load = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm({ id: "", name: "", image_url: "/brand/KJ_final.jpg" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;
    const id = editing?.id ?? slugify(form.name);
    await upsertCategory({ id, name: form.name, image_url: form.image_url });
    await load();
    resetForm();
  };

  const handleEdit = (cat: DbCategory) => {
    setEditing(cat);
    setForm({ id: cat.id, name: cat.name, image_url: cat.image_url ?? "/brand/KJ_final.jpg" });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete category? Products must be moved first.")) return;
    try {
      await deleteCategory(id);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
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

      {showForm && (
        <Card className="glass-panel border-0">
          <CardHeader><CardTitle>{editing ? "Edit Category" : "New Category"}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="surface-input" />
              </div>
              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="surface-input" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" variant="gradient">Save</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Card key={cat.id} className="glass-card border-0">
            <CardContent className="p-4 flex items-center gap-3">
              <Image src={cat.image_url ?? "/brand/KJ_final.jpg"} alt={cat.name} width={56} height={56} className="rounded-full object-contain bg-white p-1" unoptimized />
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{cat.name}</p>
                <p className="text-xs text-muted-foreground">{cat.id}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => handleEdit(cat)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { products as initialProducts } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "boys-wear",
    brand: "",
    stockCount: "",
    description: "",
  });

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ name: "", price: "", category: "boys-wear", brand: "", stockCount: "", description: "" });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: form.name,
                price: parseFloat(form.price),
                category: form.category as Product["category"],
                brand: form.brand,
                stockCount: parseInt(form.stockCount),
                description: form.description,
              }
            : p
        )
      );
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        slug: form.name.toLowerCase().replace(/\s+/g, "-"),
        name: form.name,
        description: form.description,
        longDescription: form.description,
        price: parseFloat(form.price),
        images: ["https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=800&fit=crop"],
        category: form.category as Product["category"],
        brand: form.brand,
        ageRange: "2-8 years",
        rating: 0,
        reviewCount: 0,
        inStock: true,
        stockCount: parseInt(form.stockCount) || 0,
        tags: [],
      };
      setProducts((prev) => [...prev, newProduct]);
    }
    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      brand: product.brand,
      stockCount: String(product.stockCount),
      description: product.description,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Price</Label>
                <Input required type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <Label>Brand</Label>
                <Input required value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
              <div>
                <Label>Stock</Label>
                <Input required type="number" value={form.stockCount} onChange={(e) => setForm({ ...form, stockCount: e.target.value })} />
              </div>
              <div>
                <Label>Category</Label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <Label>Description</Label>
                <Input required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2 flex gap-2">
                <Button type="submit">{editingProduct ? "Update" : "Create"} Product</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Product</th>
              <th className="text-left p-4 font-medium hidden sm:table-cell">Category</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-left p-4 font-medium hidden md:table-cell">Stock</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-t hover:bg-muted/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0">
                      <Image src={product.images[0]} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  <Badge variant="secondary">{product.category.replace("-", " ")}</Badge>
                </td>
                <td className="p-4 font-medium">{formatPrice(product.price)}</td>
                <td className="p-4 hidden md:table-cell">
                  <span className={product.stockCount < 10 ? "text-destructive font-medium" : ""}>
                    {product.stockCount}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

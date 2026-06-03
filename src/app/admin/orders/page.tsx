"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  deleteOrder,
  fetchOrders,
  getErrorMessage,
  updateOrderStatus,
  isSupabaseConfigured,
} from "@/lib/supabase/queries";
import type { DbOrder, OrderStatus } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (order: DbOrder) => {
    const confirmed = window.confirm(
      `Delete order from ${order.customer_name} (${formatPrice(Number(order.total_amount))})?\n\nThis cannot be undone.`
    );
    if (!confirmed) return;

    setError(null);
    setDeletingId(order.id);
    try {
      await deleteOrder(order.id);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  if (!isSupabaseConfigured) {
    return <p className="text-muted-foreground">Connect Supabase to view orders.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground text-sm">WhatsApp orders from customers</p>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">
          {error}
          {error.toLowerCase().includes("permission denied") && (
            <> — Add <code>SUPABASE_SERVICE_ROLE_KEY</code> to .env or re-run <code>supabase/setup.sql</code> in Supabase.</>
          )}
        </p>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading orders...</p>
      ) : orders.length === 0 ? (
        <Card className="glass-card border-0">
          <CardContent className="p-8 text-center text-muted-foreground">No orders yet</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="glass-card border-0">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-base">{order.customer_name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {order.status}
                    </Badge>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                      disabled={deletingId === order.id}
                      onClick={() => handleDelete(order)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      {deletingId === order.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">
                  <strong>Phone:</strong> {order.phone}
                </p>
                <p className="text-sm">
                  <strong>Address:</strong> {order.address}
                </p>
                <p className="text-sm font-bold text-brand-green">
                  Total: {formatPrice(Number(order.total_amount))}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleString()}
                </p>
                <select
                  className="rounded-xl surface-input px-3 py-2 text-sm"
                  value={order.status}
                  onChange={(e) => changeStatus(order.id, e.target.value as OrderStatus)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

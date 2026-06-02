"use client";

import { useEffect, useState } from "react";
import { fetchOrders, getErrorMessage, updateOrderStatus, isSupabaseConfigured } from "@/lib/supabase/queries";
import type { DbOrder, OrderStatus } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

const statuses: OrderStatus[] = ["pending", "confirmed", "processing", "completed", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    await updateOrderStatus(id, status);
    await load();
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
        <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-3 py-2">{error}</p>
      )}

      {loading ? (
        <p className="text-muted-foreground">Loading orders...</p>
      ) : orders.length === 0 ? (
        <Card className="glass-card border-0"><CardContent className="p-8 text-center text-muted-foreground">No orders yet</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="glass-card border-0">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-base">{order.customer_name}</CardTitle>
                  <Badge variant="secondary" className="capitalize">{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm"><strong>Phone:</strong> {order.phone}</p>
                <p className="text-sm"><strong>Address:</strong> {order.address}</p>
                <p className="text-sm font-bold text-brand-green">Total: {formatPrice(Number(order.total_amount))}</p>
                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                <select
                  className="rounded-xl surface-input px-3 py-2 text-sm"
                  value={order.status}
                  onChange={(e) => changeStatus(order.id, e.target.value as OrderStatus)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
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

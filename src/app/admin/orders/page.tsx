"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

const orders = [
  { id: "KJ-1001", customer: "Sarah M.", email: "sarah@email.com", items: 3, total: 89.97, status: "delivered" as const, date: "2026-05-23" },
  { id: "KJ-1002", customer: "James K.", email: "james@email.com", items: 1, total: 59.99, status: "shipped" as const, date: "2026-05-23" },
  { id: "KJ-1003", customer: "Emily R.", email: "emily@email.com", items: 2, total: 134.95, status: "processing" as const, date: "2026-05-22" },
  { id: "KJ-1004", customer: "Michael T.", email: "michael@email.com", items: 1, total: 39.99, status: "pending" as const, date: "2026-05-22" },
  { id: "KJ-1005", customer: "Lisa P.", email: "lisa@email.com", items: 4, total: 174.96, status: "delivered" as const, date: "2026-05-21" },
  { id: "KJ-1006", customer: "David C.", email: "david@email.com", items: 2, total: 64.98, status: "cancelled" as const, date: "2026-05-20" },
];

const statusColors = {
  pending: "secondary",
  processing: "default",
  shipped: "outline",
  delivered: "success",
  cancelled: "destructive",
} as const;

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage and track customer orders
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Pending", count: 1 },
          { label: "Processing", count: 1 },
          { label: "Shipped", count: 1 },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">{s.count}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border hover:bg-muted/30 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{order.id}</p>
                    <Badge variant={statusColors[order.status]}>{order.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.customer} · {order.email}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.date} · {order.items} items</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

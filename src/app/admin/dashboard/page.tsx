"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Grid3X3, ShoppingBag, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats, isSupabaseConfigured } from "@/lib/supabase/queries";
import type { DbOrder } from "@/types/database";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    productCount: 0,
    categoryCount: 0,
    orderCount: 0,
    recentOrders: [] as DbOrder[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Total Products", value: stats.productCount, icon: Package, color: "text-brand-pink" },
    { label: "Total Categories", value: stats.categoryCount, icon: Grid3X3, color: "text-brand-blue" },
    { label: "Total Orders", value: stats.orderCount, icon: ShoppingBag, color: "text-brand-green" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-8 w-8 text-brand-green" />
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Overview of your Kids Junction store</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="glass-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className={`h-4 w-4 ${color}`} />
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{loading ? "—" : value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : stats.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href="/admin/orders"
                  className="flex items-center justify-between rounded-xl glass px-4 py-3 hover:-translate-y-0.5 transition-transform"
                >
                  <div>
                    <p className="font-semibold text-sm">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-green">{formatPrice(Number(order.total_amount))}</p>
                    <p className="text-xs capitalize text-muted-foreground">{order.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

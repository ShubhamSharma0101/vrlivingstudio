import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
} from "lucide-react";

import { getAdminAnalytics } from "@/server/services/admin-analytics.service";
import { DashboardStatCard } from "@/features/admin/components/dashboard-stat-card";
import { RecentOrdersWidget } from "@/features/admin/components/recent-orders-widget";
import { InventoryAlerts } from "@/features/admin/components/inventory-alerts";

export default async function AdminDashboardPage() {
  const analytics = await getAdminAnalytics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">VR Living Studio analytics</p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStatCard
          title="Revenue"
          value={`₹${analytics.revenue.toLocaleString()}`}
          subtitle="Total earnings"
          icon={DollarSign}
        />

        <DashboardStatCard
          title="Orders"
          value={analytics.totalOrders.toString()}
          subtitle="Customer purchases"
          icon={ShoppingBag}
        />

        <DashboardStatCard
          title="Products"
          value={analytics.totalProducts.toString()}
          subtitle="Inventory count"
          icon={Package}
        />

        <DashboardStatCard
          title="Low Stock"
          value={analytics.lowStockProductsCount.toString()}
          subtitle="Needs attention"
          icon={AlertTriangle}
        />
      </div>

      {/* Widgets */}
      <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
        <RecentOrdersWidget orders={analytics.recentOrders} />

        <InventoryAlerts products={analytics.lowStockProducts} />
      </div>
    </div>
  );
}
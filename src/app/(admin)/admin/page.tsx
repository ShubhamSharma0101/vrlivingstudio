import { getAdminAnalytics } from "@/server/services/admin-analytics.service";

import { KpiCard } from "@/features/admin/components/kpi-card";

import { TopProductsChart } from "@/features/admin/components/top-products-chart";

import { InventoryAlerts } from "@/features/admin/components/inventory-alerts";

export default async function AdminDashboardPage() {
  const analytics =
    await getAdminAnalytics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          VR Living Studio analytics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Revenue"
          value={`₹${analytics.revenue.toFixed(2)}`}
        />

        <KpiCard
          title="Orders"
          value={
            analytics.totalOrders
          }
        />

        <KpiCard
          title="Customers"
          value={
            analytics.totalCustomers
          }
        />

        <KpiCard
          title="Products"
          value={
            analytics.totalProducts
          }
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopProductsChart
          data={
            analytics.topProducts
          }
        />

       <InventoryAlerts
        products={
          analytics.lowStockProducts
        }
      />
      </div>
    </div>
  );
}
import { prisma } from "@/server/db/prisma";

export async function getAdminAnalytics() {
  const [
    paidOrders,
    totalProducts,
    lowStockProductsCount,
    lowStockProducts,
    topProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.findMany({
      where: {
        paymentStatus: "PAID",
      },
      include: {
        items: true,
      },
    }),

    prisma.product.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.product.count({
      where: {
        stock: {
          lte: 5,
        },
        deletedAt: null,
      },
    }),

    prisma.product.findMany({
      where: {
        stock: {
          lte: 5,
        },
        deletedAt: null,
      },
      include: {
        category: true,
        images: {
          where: {
            isPrimary: true,
          },
          take: 1,
        },
      },
      orderBy: {
        stock: "asc",
      },
      take: 8,
    }),

    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    }),

    prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      include: {
        user: true,
      },
    }),
  ]);

  const revenue = paidOrders.reduce(
    (acc, order) => acc + Number(order.totalAmount),
    0
  );

  const totalOrders = paidOrders.length;

  const totalCustomers = new Set(paidOrders.map((order) => order.userId)).size;

  const topProductsData = await Promise.all(
    topProducts.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      return {
        name: product?.title ?? "Unknown",
        quantity: item._sum.quantity ?? 0,
      };
    })
  );

  return {
    revenue,
    totalOrders,
    totalCustomers,
    totalProducts,
    lowStockProductsCount,
    lowStockProducts: lowStockProducts.map((product) => ({
      id: product.id,
      title: product.title,
      stock: product.stock,
      slug: product.slug,
      category: product.category.name,
      image: product.images[0]?.url ?? null,
    })),
    topProducts: topProductsData,
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      email: order.user.email,
      total: Number(order.totalAmount),
      status: order.status,
    })),
  };
}
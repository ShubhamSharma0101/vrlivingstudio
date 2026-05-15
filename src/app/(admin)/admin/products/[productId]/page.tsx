import { notFound } from "next/navigation";

import { prisma } from "@/server/db/prisma";

import { CreateProductForm } from "@/features/products/components/create-product-form";
import { AdjustStockForm } from "@/features/products/components/adjust-stock-form";
import { InventoryTimeline } from "@/features/products/components/inventory-timeline";
import { ProductImageUpload } from "@/features/products/components/product-image-upload";

import { ProductImageGallery } from "@/features/products/components/product-image-gallery";

import { addProductImage } from "@/features/products/actions/add-product-image";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{
        productId: string;
    }>;
}) {
    const { productId } = await params;

    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: { id: productId },
            include: {
                inventoryMovements: {
                    orderBy: {
                    createdAt: "desc",
                    },

                    take: 20,
                },

                images: true,
                },
        }),
        prisma.category.findMany({
            orderBy: { name: "asc" },
        }),
    ]);

    if (!product) {
        notFound();
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-6">
            {/* Header Section with Read-Only Stock Status */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                    <p className="text-muted-foreground">
                        Manage product details, pricing, and view stock history.
                    </p>
                </div>
                {/* Visual indicator of current stock state */}
                <div className="rounded-lg border bg-card p-4 shadow-sm sm:min-w-[150px]">
                    <div className="text-sm font-medium text-muted-foreground">Current Stock</div>
                    <div className="text-2xl font-bold mt-1">
                        {product.stock} <span className="text-sm font-normal text-muted-foreground">units</span>
                    </div>
                </div>
            </div>

            {/* Content Layout Grid */}
            <div className="grid gap-8 lg:grid-cols-3 items-start">
                
                {/* Main Product Details Form (Stock changes excluded/disabled here) */}
                <div className="space-y-6 rounded-xl border p-6">
  <div>
    <h2 className="text-xl font-semibold">
      Product Images
    </h2>
  </div>

  <ProductImageUpload
    onUpload={async ({ url }) => {
      "use server";

      await addProductImage({
        productId: product.id,
        url,
      });
    }}
  />

  <ProductImageGallery
    images={product.images.map((image) => ({
      id: image.id,
      url: image.url,
    }))}
  />
</div>
                <div className="lg:col-span-2 space-y-6">
                    <CreateProductForm
                        categories={categories}
                        initialData={{
                            id: product.id,
                            title: product.title,
                            description: product.description,
                            price: product.price.toString(),
                            // We still pass it if the component schema requires it, 
                            // but your Form component should disable/hide the stock input if `initialData.id` exists.
                            stock: product.stock, 
                            categoryId: product.categoryId,
                            status: product.status,
                        }}
                    />
                </div>

                {/* Sidebar: Dedicated Inventory Control Tower */}
                <div className="space-y-6">
                    <AdjustStockForm
                        productId={product.id}
                        currentStock={product.stock}
                    />

                    <InventoryTimeline
                        items={product.inventoryMovements}
                    />
                </div>

            </div>
        </div>
    );
}
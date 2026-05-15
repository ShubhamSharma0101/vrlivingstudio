import { notFound } from "next/navigation";

import { prisma } from "@/server/db/prisma";

import { CreateProductForm } from "@/features/products/components/create-product-form";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{
        productId: string;
    }>;
}) {
    const { productId } = await params;

    const [product, categories] =
        await Promise.all([
            prisma.product.findUnique({
                where: {
                    id: productId,
                },
            }),

            prisma.category.findMany({
                orderBy: {
                    name: "asc",
                },
            }),
        ]);

    if (!product) {
        notFound();
    }

    return (
        <div className="max-w-2xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold">
                    Edit Product
                </h1>

                <p className="text-muted-foreground">
                    Update product details
                </p>
            </div>

            <CreateProductForm
                categories={categories}
                initialData={{
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    price: product.price.toString(),
                    stock: product.stock,
                    categoryId: product.categoryId,
                    status: product.status,
                }}
            />
        </div>
    );
}
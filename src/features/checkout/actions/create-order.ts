"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/server/db/prisma";

import { getCurrentUser } from "@/lib/auth";

export async function createOrder(addressId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");


  const [cartItems, address] = await Promise.all([
    prisma.cartItem.findMany({
      where: {
        userId: user.id,
      },
      include: {
        product: {
          include: {
            images: {
              where: {
                isPrimary: true, // Only fetch the main product image
              },
              take: 1,
            },
          },
        },
      },
    }),
    prisma.address.findUnique({
      where: {
        id: addressId,
      },
    }),
  ]);

  if (!address || address.userId !== user.id) throw new Error("Invalid address");
  if (cartItems.length === 0) throw new Error("Cart is empty");

  // VALIDATION
  for (const item of cartItems) {
    const product = item.product;
    // Fix the TypeScript error here
    if (product.deletedAt || product.status !== "ACTIVE") {
      throw new Error(`${product.title} is no longer available`);
    }
    if (item.quantity > product.stock) {
      throw new Error(`Insufficient stock for ${product.title}`);
    }
  }

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0
  );

  // 🏆 THE PROFESSIONAL WAY: Use a Transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create the Order
    const order = await tx.order.create({
      data: {
        userId: user.id,
        status: "PENDING",
        paymentStatus: "PENDING",
        subtotal,
        shippingAmount: 0,
        totalAmount: subtotal,
        addressSnapshot: { /* ... your snapshot data ... */ },
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            title: item.product.title,
            image: item.product.images?.[0]?.url || "",
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    // 2. Update Stock and Create Movements for every item
    for (const item of cartItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
        },
      });

      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          quantity: -item.quantity,
          type: "PURCHASE",
          note: `Order ${order.id}`,
        },
      });
    }

    // 3. Clear the Cart
    await tx.cartItem.deleteMany({
      where: { userId: user.id },
    });

    return order;
  });

  // Revalidate outside the transaction
  revalidatePath("/cart");
  revalidatePath("/orders");

  return { success: true, orderId: result.id };
}
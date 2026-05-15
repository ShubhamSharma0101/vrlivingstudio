"use server";

import { prisma } from "@/server/db/prisma";
import { getCurrentUser } from "@/lib/auth";
import { razorpay } from "@/lib/razorpay";

export async function createPaymentOrder(
  addressId: string
) {
  const user =
    await getCurrentUser();

  if (!user) {
    throw new Error(
      "Unauthorized"
    );
  }

  const [cartItems, address] =
    await Promise.all([
      prisma.cartItem.findMany({
        where: {
          userId: user.id,
        },

        include: {
          product: true,
        },
      }),

      prisma.address.findUnique({
        where: {
          id: addressId,
        },
      }),
    ]);

  if (
    !address ||
    address.userId !== user.id
  ) {
    throw new Error(
      "Invalid address"
    );
  }

  if (
    cartItems.length === 0
  ) {
    throw new Error(
      "Cart empty"
    );
  }

  for (const item of cartItems) {
    if (
      item.quantity >
      item.product.stock
    ) {
      throw new Error(
        `${item.product.title} out of stock`
      );
    }
  }

  const subtotal =
    cartItems.reduce(
      (acc, item) =>
        acc +
        Number(
          item.product.price
        ) *
          item.quantity,
      0
    );

  const totalAmount =
    subtotal;

  const order =
    await prisma.order.create({
      data: {
        userId: user.id,

        status: "PENDING",

        paymentStatus:
          "PENDING",

        subtotal,

        shippingAmount: 0,

        totalAmount,

        addressSnapshot: {
          fullName:
            address.fullName,
          phone:
            address.phone,
          line1:
            address.line1,
          city:
            address.city,
          state:
            address.state,
          postalCode:
            address.postalCode,
          country:
            address.country,
        },

        items: {
          create:
            cartItems.map(
              (
                item
              ) => ({
                productId:
                  item.productId,

                title:
                  item.product
                    .title,

                image:
                  "",

                price:
                  item
                    .product
                    .price,

                quantity:
                  item.quantity,
              })
            ),
        },
      },
    });

  const razorpayOrder =
    await razorpay.orders.create({
      amount:
        Math.round(
          totalAmount * 100
        ),

      currency: "INR",

      receipt:
        order.id,
    });

  await prisma.order.update({
    where: {
      id: order.id,
    },

    data: {
      razorpayOrderId:
        razorpayOrder.id,
    },
  });

  return {
    success: true,

    orderId:
      order.id,

    razorpayOrderId:
      razorpayOrder.id,

    amount:
      razorpayOrder.amount,
  };
}
import crypto from "crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/server/db/prisma";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    const generatedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env
            .RAZORPAY_KEY_SECRET!
        )
        .update(
          `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest(
          "hex"
        );

    const isValid =
      generatedSignature ===
      razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        {
          success:
            false,
        },
        {
          status:
            400,
        }
      );
    }

    const order =
      await prisma.order.findFirst({
        where: {
          razorpayOrderId:
            razorpay_order_id,
        },

        include: {
          items: true,
        },
      });

    if (!order) {
      throw new Error(
        "Order not found"
      );
    }

    if (
        order.paymentStatus ===
        "PAID"
      ) {
        return NextResponse.json({
          success: true,
          orderId: order.id,
        });
      }

    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,

        razorpayPaymentId:
          razorpay_payment_id,

        amount:
          order.totalAmount,

        status: "PAID",
      },
    });

    // PAYMENT SUCCESS
    await prisma.order.update({
      where: {
        id: order.id,
      },

      data: {
        paymentStatus:
          "PAID",

        status:
          "CONFIRMED",

        razorpayPaymentId:
          razorpay_payment_id,
      },
    });

    // DEDUCT STOCK
    for (const item of order.items) {
      await prisma.product.update({
        where: {
          id:
            item.productId,
        },

        data: {
          stock: {
            decrement:
              item.quantity,
          },
        },
      });

      await prisma.inventoryMovement.create(
        {
          data: {
            productId:
              item.productId,

            quantity:
              -item.quantity,

            type:
              "PURCHASE",

            note: `Paid order ${order.id}`,
          },
        }
      );
    }

    // CLEAR CART
    await prisma.cartItem.deleteMany(
      {
        where: {
          userId:
            order.userId,
        },
      }
    );

    return NextResponse.json(
      {
        success:
          true,

        orderId:
          order.id,
      }
    );
  } catch (error) {
    console.error(
      error
    );

    return NextResponse.json(
      {
        success:
          false,
      },
      {
        status:
          500,
      }
    );
  }
}
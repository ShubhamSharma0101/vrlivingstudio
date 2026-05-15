import { NextResponse } from "next/server";

import { prisma } from "@/server/db/prisma";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      orderId,
      razorpayPaymentId,
    } = body;

    const order =
      await prisma.order.findUnique({
        where: {
          id: orderId,
        },
      });

    if (!order) {
      throw new Error(
        "Order not found"
      );
    }

    await prisma.order.update({
      where: {
        id: orderId,
      },

      data: {
        paymentStatus:
            "FAILED",

        status:
            "ON_HOLD",
        },
    });

    await prisma.paymentTransaction.create(
      {
        data: {
          orderId:
            order.id,

          razorpayPaymentId:
            razorpayPaymentId ??
            null,

          amount:
            order.totalAmount,

          status:
            "FAILED",
        },
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
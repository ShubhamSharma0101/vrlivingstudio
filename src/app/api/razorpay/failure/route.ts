import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { aj } from "@/lib/arcjet"; // 1. Imported your configured Arcjet protection client

export async function POST(request: Request) {
  try {
    // 2. Run security guard checks (Costs 1 token bucket capacity item)
    const decision = await aj.protect(request, { requested: 1 });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { orderId, razorpayPaymentId } = body;

    const order = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // Update order to reflect failure state
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: "FAILED",
        status: "ON_HOLD",
      },
    });

    // Create tracking log entry in payment transaction history ledger
    await prisma.paymentTransaction.create({
      data: {
        orderId: order.id,
        razorpayPaymentId: razorpayPaymentId ?? null,
        amount: order.totalAmount,
        status: "FAILED",
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Failure Webhook Logging Interception Error:", error);

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
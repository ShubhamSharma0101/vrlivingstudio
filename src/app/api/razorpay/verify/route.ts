import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db/prisma";
import { aj } from "@/lib/arcjet";
import { sendOrderEmail } from "@/features/emails/actions/send-order-email";
import { sendAdminOrderAlert } from "@/features/emails/actions/send-admin-order-alert";

export async function POST(request: Request) {
  try {
    // ✅ FIXED: Moved safely inside the function body 
    // ✅ FIXED: Passed second parameter stating this verification costs 1 token bucket item
    const decision = await aj.protect(request, { requested: 1 });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // 1. Verify signature authenticity
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // 2. Locate associated context order
    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: razorpay_order_id },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order context not found" },
        { status: 404 }
      );
    }

    // Idempotency Guard: prevent double execution if endpoint re-triggers
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ success: true, orderId: order.id });
    }

    // 3. Use an atomic transaction for database modifications
    await prisma.$transaction(async (tx) => {
      // Create permanent ledger record
      await tx.paymentTransaction.create({
        data: {
          orderId: order.id,
          razorpayPaymentId: razorpay_payment_id,
          amount: order.totalAmount,
          status: "PAID",
        },
      });

      // Advance checkout status values
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: "PAID",
          status: "CONFIRMED",
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      // Synchronize item quantities & create timeline entries
      for (const item of order.items) {
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
            note: `Paid order ${order.id}`,
          },
        });
      }

      // Empty shopping state
      await tx.cartItem.deleteMany({
        where: { userId: order.userId },
      });
    });

    // 4. Side Effects: Executed outside database transactions to avoid connection pooling timeouts
    const user = await prisma.user.findUnique({
      where: { id: order.userId },
    });

    if (user?.email) {
      try {
        await sendOrderEmail({
          email: user.email,
          customerName: user.name ?? "Customer",
          orderId: order.id,
          total: Number(order.totalAmount),
        });
      } catch (emailError) {
        console.error("Background notification task failed:", emailError);
      }
    }

    if (user?.email) {
      try {
        await sendAdminOrderAlert({
          orderId: order.id,
          customerEmail: user.email,
          total: Number(order.totalAmount),
        });
      } catch (adminEmailError) {
        console.error("Background Admin alert task failed:", adminEmailError);
      }
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Webhook Verification Error Failure Context:", error);
    return NextResponse.json(
      { success: false, error: "Internal server pipeline issue" },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = Stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("✅ Webhook received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.CheckoutSession;
    const userId = session.metadata?.userId;
    const amount = (session.amount_total ?? 0) / 100;

    console.log("userId:", userId, "amount:", amount);

    if (userId) {
      try {
        await db.invoice.create({
          data: {
            userId,
            description: "Subscription payment",
            amount,
            status: "paid",
          },
        });
        console.log("✅ Invoice created in DB!");
      } catch (dbErr) {
        console.error("DB error:", dbErr);
      }
    }
  }

  return NextResponse.json({ received: true });
}
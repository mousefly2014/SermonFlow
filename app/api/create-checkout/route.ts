import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST() {
  const priceId = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!priceId || !appUrl) {
    return NextResponse.json({ error: "Missing Stripe configuration." }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}?billing=success`,
    cancel_url: `${appUrl}?billing=cancelled`
  });

  return NextResponse.json({ url: session.url });
}

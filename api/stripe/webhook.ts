import type { VercelRequest, VercelResponse } from "@vercel/node";
import getRawBody from "raw-body";
import Stripe from "stripe";
import { grantProgramAccess } from "../lib/grantProgramAccess";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret || !webhookSecret) {
    console.error("[stripe/webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return res.status(503).send("Webhook not configured");
  }

  const sig = req.headers["stripe-signature"];
  if (!sig || typeof sig !== "string") {
    return res.status(400).send("Missing stripe-signature");
  }

  let rawBody: Buffer;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error("[stripe/webhook] raw body", err);
    return res.status(400).send("Invalid body");
  }

  const stripe = new Stripe(secret);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("[stripe/webhook] signature", err);
    return res.status(400).send(`Webhook signature verification failed`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      if (userId && session.payment_status === "paid") {
        await grantProgramAccess(userId, "stripe_webhook");
      }
    }
  } catch (err) {
    console.error("[stripe/webhook] handler", err);
    return res.status(500).json({ error: "Webhook handler failed" });
  }

  return res.status(200).json({ received: true });
}

import type Stripe from "stripe";
import { getSupabaseAdmin } from "./supabaseAdmin.js";

function stripeId(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

/**
 * Saves a paid Checkout Session in public.purchases.
 * Idempotent: the webhook, /welcome and /dashboard can all call it for the same session; the first write wins.
 * Never throws, so a logging problem can't block the buyer's access. Returns false if the row could not be saved.
 */
export async function recordPurchase(
  session: Stripe.Checkout.Session,
  userId: string | null,
  email: string | null,
): Promise<boolean> {
  if (session.payment_status !== "paid") return false;
  try {
    const admin = getSupabaseAdmin();
    const { error } = await admin.from("purchases").upsert(
      {
        stripe_session_id: session.id,
        stripe_payment_intent_id: stripeId(session.payment_intent),
        stripe_customer_id: stripeId(session.customer),
        stripe_payment_link_id: stripeId(session.payment_link),
        user_id: userId,
        email,
        customer_name: session.customer_details?.name?.trim() || null,
        amount_total: session.amount_total ?? null,
        currency: session.currency ?? null,
        livemode: session.livemode,
        purchased_at: new Date(session.created * 1000).toISOString(),
      },
      { onConflict: "stripe_session_id", ignoreDuplicates: true },
    );
    if (error) {
      console.error("[recordPurchase]", session.id, error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[recordPurchase]", session.id, e);
    return false;
  }
}

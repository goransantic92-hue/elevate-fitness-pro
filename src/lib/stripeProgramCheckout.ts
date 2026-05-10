import type { User } from "@supabase/supabase-js";

const DEFAULT_PAYMENT_LINK = "https://buy.stripe.com/aFa3cu1Ou1nu61mgSj3cc0b";

/** Stripe Payment Link with Supabase user id for webhook mapping. */
export function buildProgramCheckoutUrl(user: User): string {
  const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK?.trim() || DEFAULT_PAYMENT_LINK;
  const url = new URL(paymentLink);
  url.searchParams.set("client_reference_id", user.id);
  if (user.email) {
    url.searchParams.set("prefilled_email", user.email);
  }
  return url.toString();
}

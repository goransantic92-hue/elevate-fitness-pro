import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getUserFromBearer } from "../lib/authUser";
import { grantProgramAccess } from "../lib/grantProgramAccess";

type Body = { sessionId?: string };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    return res.status(503).json({ error: "Stripe is not configured on the server." });
  }

  const { user, error: authError } = await getUserFromBearer(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ error: authError ?? "Unauthorized" });
  }

  let body: Body = {};
  try {
    body =
      typeof req.body === "string" ? (JSON.parse(req.body) as Body) : ((req.body as Body) ?? {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  if (!sessionId.startsWith("cs_")) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  const stripe = new Stripe(secret);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const metaUser = session.metadata?.supabase_user_id;
    if (!metaUser || metaUser !== user.id) {
      return res.status(403).json({ error: "Session does not belong to this account" });
    }

    await grantProgramAccess(user.id, "stripe");

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("[stripe/verify-session]", e);
    return res.status(502).json({ error: "Could not verify payment" });
  }
}

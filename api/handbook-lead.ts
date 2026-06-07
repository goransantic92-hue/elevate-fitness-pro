import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  HANDBOOK_IDS,
  handbookMeta,
  isHandbookId,
  readHandbookPdf,
  type HandbookId,
} from "./lib/handbooks";
import { saveHandbookLead, markHandbookLeadSent } from "./lib/saveHandbookLead";

const DEFAULT_NOTIFY = "info@ptmilosilic.com";
const DEFAULT_FROM = "Coach Milos <info@ptmilosilic.com>";
const SITE_URL = "https://busystrong90.com";

type Payload = {
  name?: string;
  email?: string;
  handbooks?: string[];
};

function trimMax(s: string | undefined, max: number): string {
  const t = (s ?? "").trim();
  return t.length > max ? t.slice(0, max) : t;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parsePayload(req: VercelRequest): Payload | null {
  const raw = req.body as unknown;
  if (raw == null) return null;
  if (typeof raw === "object" && !Buffer.isBuffer(raw)) return raw as Payload;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as Payload;
    } catch {
      return null;
    }
  }
  if (Buffer.isBuffer(raw)) {
    try {
      return JSON.parse(raw.toString("utf8")) as Payload;
    } catch {
      return null;
    }
  }
  return null;
}

async function sendResend(params: {
  apiKey: string;
  from: string;
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: { filename: string; content: string }[];
}): Promise<void> {
  const payload: Record<string, unknown> = {
    from: params.from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  };
  if (params.replyTo) payload.reply_to = params.replyTo;
  if (params.attachments?.length) payload.attachments = params.attachments;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const text = await r.text();
    let detail = text;
    try {
      const j = JSON.parse(text) as { message?: string };
      if (j.message) detail = j.message;
    } catch {
      /* keep raw */
    }
    throw new Error(`Resend ${r.status}: ${detail}`);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return await handleHandbookLead(req, res);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[handbook-lead] unhandled error", msg);
    return res.status(500).json({ error: "Server error while sending handbook. Please try again later." });
  }
}

async function handleHandbookLead(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "Email service is not configured." });
  }

  const notifyEmail = process.env.COACHING_NOTIFY_EMAIL?.trim() || DEFAULT_NOTIFY;
  const fromEmail = process.env.COACHING_FROM_EMAIL?.trim() || DEFAULT_FROM;

  const raw = parsePayload(req);
  if (!raw) {
    return res.status(400).json({ error: "Invalid or empty JSON body" });
  }

  const name = trimMax(raw.name, 120);
  const email = trimMax(raw.email, 320);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const selectedRaw = Array.isArray(raw.handbooks) ? raw.handbooks : [];
  const selected = [...new Set(selectedRaw.map((h) => trimMax(String(h), 40)).filter(isHandbookId))];

  if (!name || !emailOk) {
    return res.status(400).json({ error: "Please enter your name and a valid email." });
  }
  if (selected.length === 0) {
    return res.status(400).json({ error: "Please select at least one handbook." });
  }

  const leadId = await saveHandbookLead({
    name,
    email,
    handbookIds: selected,
    source: "homepage",
  });

  let attachments: { filename: string; content: string }[];
  try {
    attachments = selected.map((id) => {
      const meta = handbookMeta(id);
      const buf = readHandbookPdf(id);
      return {
        filename: meta.attachmentName,
        content: buf.toString("base64"),
      };
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[handbook-lead] PDF read failed", msg);
    return res.status(503).json({
      error: "Handbook files are not available on the server yet. Please contact support or try again later.",
    });
  }

  const titles = selected.map((id) => handbookMeta(id).emailTitle);
  const titlesHtml = titles.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
  const firstName = escapeHtml(name.split(/\s+/)[0] || name);

  const coachHtml = `
<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;">
<p><strong>Handbook download request</strong></p>
<p><strong>Name:</strong> ${escapeHtml(name)}<br/>
<strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Selected (${selected.length}):</strong></p>
<ul>${titlesHtml}</ul>
</body></html>`;

  const applicantHtml = `
<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#111;max-width:560px;">
<p>Hi ${firstName},</p>
<p>Here ${selected.length === 1 ? "is the handbook" : "are the handbooks"} you requested from Coach Milos:</p>
<ul>${titlesHtml}</ul>
<p>${selected.length === 1 ? "It is attached" : "They are attached"} to this email as PDF${selected.length === 1 ? "" : "s"}.</p>
<p>These guides are built for busy fathers who want simple systems — not more noise. If you're ready for the full 90-day program (training, nutrition, and habits in one place), you can start here:</p>
<p style="margin:24px 0;">
  <a href="${SITE_URL}/pricing" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">See BUSY STRONG 90</a>
</p>
<p>Talk soon,<br/>Milos</p>
</body></html>`;

  try {
    await sendResend({
      apiKey,
      from: fromEmail,
      to: [notifyEmail],
      subject: `Handbook lead: ${name} (${selected.length} PDF${selected.length === 1 ? "" : "s"})`,
      html: coachHtml,
      replyTo: email,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[handbook-lead] coach notify failed", msg);
    return res.status(502).json({ error: "Could not send email. Please try again later." });
  }

  try {
    const subject =
      selected.length === 1
        ? `Your free handbook: ${titles[0]}`
        : `Your free handbooks (${selected.length}) from Coach Milos`;

    await sendResend({
      apiKey,
      from: fromEmail,
      to: [email],
      subject,
      html: applicantHtml,
      replyTo: notifyEmail,
      attachments,
    });

    if (leadId) {
      await markHandbookLeadSent(leadId);
    }

    return res.status(200).json({ ok: true, count: selected.length });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[handbook-lead] applicant email failed", msg);
    return res.status(502).json({ error: "Could not deliver your handbook. Please try again later." });
  }
}

// Reference for bundlers
void HANDBOOK_IDS;

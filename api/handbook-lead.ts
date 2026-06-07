import type { VercelRequest, VercelResponse } from "@vercel/node";

const DEFAULT_NOTIFY = "info@ptmilosilic.com";
const DEFAULT_FROM = "Coach Milos <info@ptmilosilic.com>";
const SITE_URL = "https://busystrong90.com";

const HANDBOOK_IDS = ["eat-nutrition", "fuel-supplements", "muscle-handbook", "busy-strong-7day"] as const;
type HandbookId = (typeof HANDBOOK_IDS)[number];

const HANDBOOKS: Record<
  HandbookId,
  { filename: string; attachmentName: string; emailTitle: string }
> = {
  "eat-nutrition": {
    filename: "EAT_Nutrition_Guide.pdf",
    attachmentName: "EAT_Nutrition_Guide.pdf",
    emailTitle: "EAT Nutrition Guide",
  },
  "fuel-supplements": {
    filename: "FUEL_Supplement_Guide.pdf",
    attachmentName: "FUEL_Supplement_Guide.pdf",
    emailTitle: "FUEL Supplement Guide",
  },
  "muscle-handbook": {
    filename: "Muscle_Handbook_Milos_Ilic.pdf",
    attachmentName: "Muscle_Handbook_by_Milos_Ilic.pdf",
    emailTitle: "Muscle Handbook by Milos Ilic",
  },
  "busy-strong-7day": {
    filename: "Busy_Strong_7Day_CoachMilos.pdf",
    attachmentName: "Busy_Strong_7Day_CoachMilos.pdf",
    emailTitle: "Busy Strong 7-Day Starter",
  },
};

type Payload = {
  name?: string;
  email?: string;
  handbooks?: string[];
};

function isHandbookId(value: string): value is HandbookId {
  return (HANDBOOK_IDS as readonly string[]).includes(value);
}

function getSiteUrl(): string {
  const explicit = process.env.SITE_URL?.trim().replace(/\/$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return vercel.startsWith("http") ? vercel.replace(/\/$/, "") : `https://${vercel.replace(/\/$/, "")}`;
  return SITE_URL;
}

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

async function readHandbookPdf(id: HandbookId): Promise<Buffer> {
  const meta = HANDBOOKS[id];
  const url = `${getSiteUrl()}/handbooks/${encodeURIComponent(meta.filename)}`;
  const r = await fetch(url);
  if (!r.ok) {
    throw new Error(`Handbook file missing: ${meta.filename} (${r.status})`);
  }
  return Buffer.from(await r.arrayBuffer());
}

async function saveHandbookLead(record: {
  name: string;
  email: string;
  handbookIds: string[];
}): Promise<string | null> {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;

  try {
    const r = await fetch(`${url}/rest/v1/handbook_leads`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        name: record.name,
        email: record.email.trim().toLowerCase(),
        handbook_ids: record.handbookIds,
        source: "homepage",
        emails_sent: false,
      }),
    });
    if (!r.ok) {
      console.error("[handbook-lead] db insert failed", r.status, await r.text());
      return null;
    }
    const rows = (await r.json()) as { id?: string }[];
    return rows[0]?.id ?? null;
  } catch (e) {
    console.error("[handbook-lead] db insert error", e);
    return null;
  }
}

async function markHandbookLeadSent(leadId: string): Promise<void> {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return;

  try {
    await fetch(`${url}/rest/v1/handbook_leads?id=eq.${encodeURIComponent(leadId)}`, {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emails_sent: true }),
    });
  } catch (e) {
    console.error("[handbook-lead] db update error", e);
  }
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

    const leadId = await saveHandbookLead({ name, email, handbookIds: selected });

    let attachments: { filename: string; content: string }[];
    try {
      attachments = await Promise.all(
        selected.map(async (id) => {
          const meta = HANDBOOKS[id];
          const buf = await readHandbookPdf(id);
          return {
            filename: meta.attachmentName,
            content: buf.toString("base64"),
          };
        }),
      );
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[handbook-lead] PDF fetch failed", msg);
      return res.status(503).json({
        error: "Handbook files are not available on the server yet. Please contact support or try again later.",
      });
    }

    const titles = selected.map((id) => HANDBOOKS[id].emailTitle);
    const titlesHtml = titles.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
    const firstName = escapeHtml(name.split(/\s+/)[0] || name);

    const coachHtml = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111;">
<p><strong>Handbook download request</strong></p>
<p><strong>Name:</strong> ${escapeHtml(name)}<br/><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Selected (${selected.length}):</strong></p><ul>${titlesHtml}</ul></body></html>`;

    const applicantHtml = `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.6;color:#111;max-width:560px;">
<p>Hi ${firstName},</p>
<p>Here ${selected.length === 1 ? "is the handbook" : "are the handbooks"} you requested from Coach Milos:</p>
<ul>${titlesHtml}</ul>
<p>${selected.length === 1 ? "It is attached" : "They are attached"} to this email as PDF${selected.length === 1 ? "" : "s"}.</p>
<p>These guides are built for busy fathers who want simple systems — not more noise. If you're ready for the full 90-day program, start here:</p>
<p style="margin:24px 0;"><a href="${SITE_URL}/pricing" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;">See BUSY STRONG 90</a></p>
<p>Talk soon,<br/>Milos</p></body></html>`;

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

      if (leadId) await markHandbookLeadSent(leadId);

      return res.status(200).json({ ok: true, count: selected.length });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[handbook-lead] applicant email failed", msg);
      return res.status(502).json({ error: "Could not deliver your handbook. Please try again later." });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[handbook-lead] unhandled error", msg);
    return res.status(500).json({ error: "Server error while sending handbook. Please try again later." });
  }
}

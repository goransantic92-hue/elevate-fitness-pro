import { getSupabaseAdmin } from "./supabaseAdmin";

export type HandbookLeadRecord = {
  name: string;
  email: string;
  handbookIds: string[];
  source?: string;
};

function getAdmin() {
  try {
    return getSupabaseAdmin();
  } catch {
    console.warn("[handbook-lead] Supabase not configured — lead not saved to database");
    return null;
  }
}

/** Persists a handbook signup. Returns row id when saved. */
export async function saveHandbookLead(record: HandbookLeadRecord): Promise<string | null> {
  const admin = getAdmin();
  if (!admin) return null;

  const { data, error } = await admin
    .from("handbook_leads")
    .insert({
      name: record.name,
      email: record.email.trim().toLowerCase(),
      handbook_ids: record.handbookIds,
      source: record.source ?? "homepage",
      emails_sent: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[handbook-lead] database insert failed", error.message);
    return null;
  }

  return data?.id ?? null;
}

export async function markHandbookLeadSent(leadId: string): Promise<void> {
  const admin = getAdmin();
  if (!admin) return;

  const { error } = await admin.from("handbook_leads").update({ emails_sent: true }).eq("id", leadId);
  if (error) {
    console.error("[handbook-lead] database update failed", error.message);
  }
}

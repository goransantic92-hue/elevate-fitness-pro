/** Handbook ids — must match `api/lib/handbooks.ts` */
export const HANDBOOK_IDS = ["eat-nutrition", "fuel-supplements", "muscle-handbook", "busy-strong-7day"] as const;

export type HandbookId = (typeof HANDBOOK_IDS)[number];

export function isHandbookId(value: string): value is HandbookId {
  return (HANDBOOK_IDS as readonly string[]).includes(value);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asString(value: unknown, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

export function asStringArray(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return fallback;
  const items = value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  return items.length > 0 ? items : fallback;
}

export function asNullableString(value: unknown, fallback: string | null): string | null {
  if (value === null) return null;
  return typeof value === "string" ? value : fallback;
}

export type StatItem = { value: string; label: string };

export function asStats(value: unknown, fallback: StatItem[]): StatItem[] {
  if (!Array.isArray(value)) return fallback;
  const stats = value
    .map((item) => {
      if (!isRecord(item)) return null;
      const statValue = asString(item.value, "").trim();
      const label = asString(item.label, "").trim();
      if (!statValue || !label) return null;
      return { value: statValue, label };
    })
    .filter((item): item is StatItem => item !== null);
  return stats.length > 0 ? stats : fallback;
}

export function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function arrayToLines(items: string[]): string {
  return items.join("\n");
}

export function hasNonEmptyRecord(value: unknown): boolean {
  return isRecord(value) && Object.keys(value).length > 0;
}

export function hasPublishedPayload(data: unknown): boolean {
  if (!isRecord(data)) return false;
  return Object.values(data).some((section) => hasNonEmptyRecord(section) || (Array.isArray(section) && section.length > 0));
}

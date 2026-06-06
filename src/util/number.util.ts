function parseOptionalNumber(value: unknown): number | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  if (trimmed === "") {
    return undefined;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function sanitizeOptionalNumberFields<T extends Record<string, unknown>>(
  payload: T,
  fields: Array<keyof T>,
): T {
  const normalized = { ...payload };

  for (const field of fields) {
    const parsed = parseOptionalNumber(normalized[field]);
    if (parsed === undefined) {
      delete normalized[field];
      continue;
    }

    (normalized as Record<string, unknown>)[field as string] = parsed;
  }

  return normalized;
}

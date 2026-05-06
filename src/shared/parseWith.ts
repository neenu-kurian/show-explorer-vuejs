import type { ZodType } from "zod";
import type { Result } from "@/types/result";

export function parseWith<T>(result: Result<unknown>, schema: ZodType<T>): Result<T> {
  if (!result.ok) return result;
  const parsed = schema.safeParse(result.data);
  if (!parsed.success) return { ok: false, error: { type: "VALIDATION" } };
  return { ok: true, data: parsed.data };
}

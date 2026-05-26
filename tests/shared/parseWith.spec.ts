import { parseWith } from "@/shared/parseWith";
import type { Result } from "@/types/result";
import { z } from "zod";

describe("parseWith", () => {
  const SimpleSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  it("should return the original error if result.ok is false", () => {
    const errorResult: Result<unknown> = {
      ok: false,
      error: { type: "NETWORK" }
    };

    const result = parseWith(errorResult, SimpleSchema);

    expect(result).toEqual(errorResult);
    expect(result.ok).toBe(false);
  });

  it("should return parsed data if data matches schema", () => {
    const rawData = { id: 1, name: "Test Item" };
    const successResult: Result<unknown> = { ok: true, data: rawData };

    const result = parseWith(successResult, SimpleSchema);
    expect(result).toEqual({ ok: true, data: rawData });
  });

  it("should return a VALIDATION error if data does not match schema", () => {
    const badData = { id: "not-a-number", name: "Test Item" };
    const successResult: Result<unknown> = { ok: true, data: badData };

    const result = parseWith(successResult, SimpleSchema);

    expect(result).toEqual({
      ok: false,
      error: { type: "VALIDATION" },
    });
  });
});

import { TIMEOUT } from "@/constants";
import type { Result } from "@/types/result";

export async function apiFetch(url: string, signal?: AbortSignal): Promise<Result<unknown>> {
  const signals = [AbortSignal.timeout(TIMEOUT)];
  if (signal) signals.push(signal);
  const combinedSignal = AbortSignal.any(signals);
  try {
    const response = await fetch(url, { signal: combinedSignal });
    if (!response.ok) {
      if (response.status === 404) {
        return { ok: false, error: { type: "NOT_FOUND" } };
      }
      return { ok: false, error: { type: "SERVER", status: response.status } };
    }
    return { ok: true, data: await response.json() };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, error: { type: "ABORTED" } };
    }
    if (err instanceof DOMException && err.name === "TimeoutError") {
      return { ok: false, error: { type: "TIMEOUT"} };
    }
    if(err instanceof SyntaxError) {
      return { ok: false, error: { type: "PARSE"} };
    }
    return {
      ok: false,
      error: { type: "NETWORK", message: err instanceof Error ? err.message : undefined },
    };
  }
}

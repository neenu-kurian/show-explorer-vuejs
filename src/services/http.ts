import type { Result } from '@/types/result';

export async function apiFetch(url: string, signal?: AbortSignal): Promise<Result<unknown>> {
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      if (response.status === 404) {
        return { ok: false, error: { type: 'NOT_FOUND' } };
      }
      return { ok: false, error: { type: 'SERVER', status: response.status } };
    }
    return { ok: true, data: await response.json() };
  } catch (err) {
    return {
      ok: false,
      error: { type: 'NETWORK', message: err instanceof Error ? err.message : undefined },
    };
  }
}

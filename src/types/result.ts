export type ApiError =
  | { type: "NOT_FOUND"; id?: number }
  | { type: "NETWORK"; message?: string }
  | { type: "VALIDATION"; message?: string }
  | { type: "INVALID_INPUT"; message?: string }
  | { type: "ABORTED"; message?: string }
  | { type: "TIMEOUT"; message?: string }
  | { type: "SERVER"; status: number; message?: string };

export type Result<T> = { ok: true; data: T } | { ok: false; error: ApiError };

import { API_URL } from "@/constants";
import { CastListDtoSchema } from "@/services/schemas";
import { parseWith } from "@/shared/parseWith";
import type { CastMember } from "@/types/cast";
import type { Result } from "@/types/result";
import { apiFetch } from "./http";

export async function fetchCastData(
  id: number,
  signal?: AbortSignal,
): Promise<Result<CastMember[]>> {
  const response = await apiFetch(`${API_URL}/shows/${id}/cast`, signal);
  return parseWith(response, CastListDtoSchema);
}

import { API_URL } from "@/constants";
import { SearchResultListDtoSchema } from "@/services/schemas";
import { parseWith } from "@/shared/parseWith";
import type { Result } from "@/types/result";
import type { ShowSearchResult } from "@/types/search";
import { apiFetch } from "./http";

export async function searchShowsApi(
  query: string,
  signal?: AbortSignal,
): Promise<Result<ShowSearchResult[]>> {
  const response = await apiFetch(`${API_URL}/search/shows?q=${encodeURIComponent(query)}`, signal);
  return parseWith(response, SearchResultListDtoSchema);
}

import { searchShowsApi } from "@/services/search";
import type { Result } from "@/types/result";
import type { Show } from "@/types/show";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSearchStore = defineStore("search", () => {
  const searchQuery = ref("");
  const searchResult = ref<Result<Show[]> | null>(null);

  async function searchShows(query: string, signal?: AbortSignal) {
    searchQuery.value = query;
    const result = await searchShowsApi(query, signal);
    if (signal?.aborted) return;
    searchResult.value = result.ok
      ? { ok: true, data: result.data.map((item) => item.show) }
      : result;
  }

  function clearSearch() {
    searchQuery.value = "";
    searchResult.value = null;
  }

  return {
    searchQuery,
    searchResult,
    clearSearch,
    searchShows,
  };
});

import { fetchShows } from "@/services/shows";
import { categorizeShows, sortShows } from "@/shared/normaliser";
import type { Result } from "@/types/result";
import type { CategorizedShows, SortBy } from "@/types/show";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useCatalogStore = defineStore("catalog", () => {
  const showsByCategory = ref<Result<CategorizedShows> | null>(null);
  const sortBy = ref<SortBy>("rating-desc");

  const sortedShows = computed<Result<CategorizedShows> | null>(() => {
    if (!showsByCategory.value?.ok) {
      return showsByCategory.value;
    }
    return { ok: true, data: sortShows(showsByCategory.value.data, sortBy.value) };
  });

  async function getShowsByCategory(signal?: AbortSignal) {
    const result = await fetchShows(signal);
    if (signal?.aborted) return;
    showsByCategory.value = result.ok ? { ok: true, data: categorizeShows(result.data) } : result;
  }

  return {
    showsByCategory,
    sortBy,
    sortedShows,
    getShowsByCategory,
  };
});

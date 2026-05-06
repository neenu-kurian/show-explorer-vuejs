import { SEARCH_TIMEOUT } from "@/constants";
import { getErrorMessage } from "@/shared/errorMapper";
import { useSearchStore } from "@/stores/search";
import { storeToRefs } from "pinia";
import { computed, onUnmounted, ref } from "vue";

export function useDebouncedSearch() {
  const searchStore = useSearchStore();
  const searchLoading = ref(false);
  const hasSearched = ref(false);
  const { searchQuery, searchResult } = storeToRefs(searchStore);
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;
  let abortController: AbortController | null = null;

  const shows = computed(() => {
    if (!searchResult.value?.ok) return [];
    return searchResult.value.data;
  });

  const searchError = computed(() => {
    if (!searchResult.value || searchResult.value.ok) return null;
    return getErrorMessage(searchResult.value.error);
  });

  const cancelPending = () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      searchTimeout = null;
    }
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };

  const handleSearch = () => {
    cancelPending();
    if (searchQuery.value.trim() === "") {
      clearSearch();
      return;
    }
    searchTimeout = setTimeout(async () => {
      searchLoading.value = true;
      abortController = new AbortController();
      await searchStore.searchShows(searchQuery.value, abortController.signal);
      searchLoading.value = false;
      hasSearched.value = true;
    }, SEARCH_TIMEOUT);
  };

  const clearSearch = () => {
    cancelPending();
    hasSearched.value = false;
    searchStore.clearSearch();
  };

  onUnmounted(cancelPending);

  return {
    searchQuery,
    searchLoading,
    hasSearched,
    handleSearch,
    clearSearch,
    shows,
    searchError,
  };
}

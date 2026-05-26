import { SEARCH_TIMEOUT } from "@/constants";
import { getErrorMessage } from "@/shared/errorMapper";
import { useSearchStore } from "@/stores/search";
import { storeToRefs } from "pinia";
import { computed, onUnmounted, ref } from "vue";

export function useDebouncedSearch() {
  const searchStore = useSearchStore();
  const searchLoading = ref(false);
  const { searchQuery, searchResult } = storeToRefs(searchStore);
  let searchTimeout: ReturnType<typeof setTimeout> | null = null;
  let abortController: AbortController | null = null;
  const hasSearched = ref(!!searchResult.value);
  let latestRequestId = 0;

  const shows = computed(() => {
    if (!searchResult.value?.ok) return [];
    return searchResult.value.data;
  });

  const searchError = computed(() => {
    if (!searchResult.value || searchResult.value.ok) return null;
    return getErrorMessage(searchResult.value.error);
  });

  const isSearchActive = computed(() => searchLoading.value || hasSearched.value);

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
    const currentRequestId = ++latestRequestId;
    searchTimeout = setTimeout(async () => {
      searchLoading.value = true;
      abortController = new AbortController();
      await searchStore.searchShows(searchQuery.value, abortController.signal);
      if (currentRequestId !== latestRequestId) return;
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
    isSearchActive,
    shows,
    clearSearch,
    searchError,
  };
}

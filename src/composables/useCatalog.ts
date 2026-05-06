import { getErrorMessage } from "@/shared/errorMapper";
import { useCatalogStore } from "@/stores/catalog";
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref } from "vue";

export function useCatalog() {
  const catalogStore = useCatalogStore();
  const { sortedShows, sortBy, showsByCategory } = storeToRefs(catalogStore);
  const loading = ref(true);
  let abortController: AbortController | null = null;

  const catalogData = computed(() => {
    if (!sortedShows.value?.ok) return {};
    return sortedShows.value.data;
  });

  const error = computed(() => {
    if (!sortedShows.value || sortedShows.value.ok) return null;
    return getErrorMessage(sortedShows.value.error);
  });

  onMounted(async () => {
    if (!showsByCategory.value) {
      abortController = new AbortController();
      const signal = abortController.signal;
      await catalogStore.getShowsByCategory(signal);
      if (signal.aborted) return;
    }
    loading.value = false;
  });

  const cancelPending = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };
  onUnmounted(cancelPending);
  return { sortBy, loading, error, catalogData };
}

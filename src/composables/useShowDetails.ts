import { getErrorMessage } from "@/shared/errorMapper";
import { useShowDetailStore } from "@/stores/showDetail";
import { computed, onUnmounted, ref } from "vue";

export function useShowDetails(showId: number) {
  const showStore = useShowDetailStore();
  const loading = ref(true);
  const castLoading = ref(false);
  let abortController: AbortController | null = null;

  const showEntry = computed(() => showStore.getShowEntry(showId));

  const error = computed(() => {
    const entry = showEntry.value;
    if (!entry || entry.show.ok) return null;
    return getErrorMessage(entry.show.error);
  });

  const castError = computed(() => {
    const entry = showEntry.value;
    if (!entry || !entry.cast || entry.cast.ok) return null;
    return getErrorMessage(entry.cast.error);
  });

  const isNotFound = computed(() => {
    const entry = showEntry.value;
    return !!entry && !entry.show.ok && entry.show.error.type === "NOT_FOUND";
  });

  const show = computed(() => {
    const entry = showEntry.value;
    if (!entry || !entry.show.ok) return null;
    return entry.show.data;
  });

  const cast = computed(() => {
    const entry = showEntry.value;
    if (!entry || !entry.cast || !entry.cast.ok) return [];
    return entry.cast.data;
  });

  const fetchShow = async () => {
    loading.value = true;
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
    abortController = new AbortController();
    const signal = abortController.signal;
    const showEntry = showStore.getShowEntry(showId);
    const showNeedsFetch =
      !showEntry || (!showEntry.show.ok && showEntry.show.error.type !== "NOT_FOUND");
    const castNeedsFetch = !showEntry?.cast;

    if (showNeedsFetch) {
      await showStore.fetchShowDetails(showId, signal);
      if (signal.aborted) return;
      const updatedEntry = showStore.getShowEntry(showId);
      if (!updatedEntry || !updatedEntry.show.ok) {
        loading.value = false;
        return;
      }
    }
    loading.value = false;
    if (showNeedsFetch || castNeedsFetch) {
      castLoading.value = true;
      await showStore.fetchCastDetails(showId, signal);
      if (signal.aborted) return;
      castLoading.value = false;
    }
  };

  const cancelPending = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };

  onUnmounted(cancelPending);

  return {
    show,
    cast,
    loading,
    error,
    castError,
    castLoading,
    isNotFound,
    fetchShow,
  };
}

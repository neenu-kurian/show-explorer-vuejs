import { fetchCastData } from "@/services/cast";
import { fetchShowData } from "@/services/shows";
import type { ShowEntry } from "@/types/showDetail";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useShowDetailStore = defineStore("showDetail", () => {
  const showDetails = ref<Record<number, ShowEntry | undefined>>({});

  async function fetchShowDetails(id: number, signal?: AbortSignal) {
    const result = await fetchShowData(id, signal);
    if (signal?.aborted) return;
    showDetails.value[id] = { show: result, cast: null };
  }

  async function fetchCastDetails(id: number, signal?: AbortSignal){
    const result = await fetchCastData(id, signal);
    if (signal?.aborted) return;
    const entry = showDetails.value[id];
    if (entry) {
      entry.cast = result;
    }
  }

  function getShowEntry(id: number) {
    return showDetails.value[id];
  }

  return {
    showDetails,
    getShowEntry,
    fetchShowDetails,
    fetchCastDetails,
  };
});

import { withSetup } from "../helpers/withSetup";
import { useDebouncedSearch } from "@/composables/useDebouncedSearch";
import { useSearchStore } from "@/stores/search";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/services/search", () => ({
  searchShowsApi: vi.fn().mockResolvedValue({ ok: true, data: [] }),
}));

describe("useDebouncedSearch", () => {
  let store: ReturnType<typeof useSearchStore>;
  let cleanup = null as (() => void) | null;

  beforeEach(() => {
    vi.useFakeTimers();
    setActivePinia(createPinia());
    store = useSearchStore();
  });

  const setup = () => {
    const { result, unmount } = withSetup(() => useDebouncedSearch());
    cleanup = unmount;
    return result;
  };

  afterEach(() => {
    cleanup?.();
    cleanup = null;
    vi.useRealTimers();
  });

  it("should initialize with empty search state", () => {
    const result = setup();
    expect(result.searchQuery.value).toBe("");
    expect(result.searchLoading.value).toBe(false);
  });

  it("should debounce search queries", async () => {
    const searchShowsSpy = vi.spyOn(store, "searchShows");
    const result = setup();
    const { searchQuery, handleSearch } = result;

    searchQuery.value = "wire";
    handleSearch();

    searchQuery.value = "the wire";
    handleSearch();

    vi.advanceTimersByTime(750);

    expect(searchShowsSpy).toHaveBeenCalledTimes(1);
    expect(searchShowsSpy).toHaveBeenCalledWith("the wire", expect.any(AbortSignal));
  });

  it("should not search empty queries", async () => {
    const searchShowsSpy = vi.spyOn(store, "searchShows");
    const result = setup();
    const { searchQuery, handleSearch } = result;

    searchQuery.value = "";
    handleSearch();

    vi.advanceTimersByTime(750);

    expect(searchShowsSpy).not.toHaveBeenCalled();
  });

  it("should not search whitespace-only queries", async () => {
    const searchShowsSpy = vi.spyOn(store, "searchShows");
    const result = setup();
    const { searchQuery, handleSearch } = result;

    searchQuery.value = "   ";
    handleSearch();

    vi.advanceTimersByTime(750);

    expect(searchShowsSpy).not.toHaveBeenCalled();
  });

  it("should cancel pending searches", () => {
    const searchShowsSpy = vi.spyOn(store, "searchShows");
    const result = setup();
    const { searchQuery, handleSearch, clearSearch } = result;

    searchQuery.value = "test";
    handleSearch();
    clearSearch();

    vi.advanceTimersByTime(750);

    expect(searchShowsSpy).not.toHaveBeenCalled();
  });

  it("should clear search state", () => {
    const clearSearchSpy = vi.spyOn(store, "clearSearch");
    const result = setup();
    const { searchQuery, clearSearch } = result;

    searchQuery.value = "test query";
    clearSearch();

    expect(searchQuery.value).toBe("");
    expect(clearSearchSpy).toHaveBeenCalled();
  });

  it("should handle search errors gracefully", async () => {
    const searchShowsSpy = vi.spyOn(store, "searchShows");
    const result = setup();
    const { searchQuery, handleSearch } = result;

    searchQuery.value = "test";
    handleSearch();

    vi.advanceTimersByTime(750);
    await vi.runAllTimersAsync();

    expect(searchShowsSpy).toHaveBeenCalledWith("test", expect.any(AbortSignal));
  });
});

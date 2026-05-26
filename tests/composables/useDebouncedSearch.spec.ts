import { useDebouncedSearch } from "@/composables/useDebouncedSearch";
import { useSearchStore } from "@/stores/search";
import { createPinia, setActivePinia } from "pinia";
import { withSetup } from "../helpers/withSetup";

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

  it("should debounce search queries", () => {
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

  it("should not search empty queries", () => {
    const searchShowsSpy = vi.spyOn(store, "searchShows");
    const result = setup();
    const { searchQuery, handleSearch } = result;

    searchQuery.value = "";
    handleSearch();

    vi.advanceTimersByTime(750);

    expect(searchShowsSpy).not.toHaveBeenCalled();
  });

  it("should not search whitespace-only queries", () => {
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
    const searchShowsSpy = vi.spyOn(store, "searchShows").mockImplementationOnce(async () => {
      store.searchResult = { ok: false, error: { type: "NETWORK" } };
    });

    const result = setup();
    const { searchQuery, handleSearch, searchLoading } = result;

    searchQuery.value = "test";
    handleSearch();

    vi.advanceTimersByTime(750);
    await vi.runAllTimersAsync();

    expect(searchShowsSpy).toHaveBeenCalledWith("test", expect.any(AbortSignal));
    expect(searchLoading.value).toBe(false);
  });

  it("should cancel first search if another one is triggered", async () => {
    const searchShowsSpy = vi.spyOn(store, "searchShows");
    const result = setup();
    const { searchQuery, handleSearch } = result;
    searchQuery.value = "test";
    handleSearch();
    vi.advanceTimersByTime(750);

    searchQuery.value = "test 2";
    handleSearch();
    vi.advanceTimersByTime(750);

    expect(searchShowsSpy).toHaveBeenCalledTimes(2);
    const firstAbortCall = searchShowsSpy.mock.calls[0]![1] as AbortSignal;
    const secondAbortCall = searchShowsSpy.mock.calls[1]![1] as AbortSignal;
    expect(firstAbortCall.aborted).toBe(true);
    expect(secondAbortCall.aborted).toBe(false);
  });

  it("should cancel pending searches when component is unmounted", async () => {
    const searchShowsSpy = vi.spyOn(store, "searchShows");
    const { result, unmount } = withSetup(() => useDebouncedSearch());
    const { searchQuery, handleSearch } = result;
    searchQuery.value = "test";
    handleSearch();
    vi.advanceTimersByTime(750);
    unmount();
    expect(searchShowsSpy).toHaveBeenCalledTimes(1);
    const signal = searchShowsSpy.mock.calls[0]![1] as AbortSignal;
    expect(signal.aborted).toBe(true);
  });
});

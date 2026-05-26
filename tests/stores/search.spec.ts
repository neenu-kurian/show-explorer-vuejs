import { searchShowsApi } from "@/services/search";
import { useSearchStore } from "@/stores/search";
import type { Show } from "@/types/show";
import { createPinia, setActivePinia } from "pinia";
import { mockResults } from "../testdata";

vi.mock("@/services/search.ts", () => ({
  searchShowsApi: vi.fn(),
}));

const searchMock = vi.mocked(searchShowsApi);

describe("searchStore", () => {
  let store: ReturnType<typeof useSearchStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useSearchStore();
    vi.clearAllMocks();
  });

  it("initializes with empty state", () => {
    expect(store.searchQuery).toBe("");
    expect(store.searchResult).toEqual(null);
  });

  it("stores query and results on successful search", async () => {
    searchMock.mockResolvedValueOnce(mockResults);
    await store.searchShows("test");
    expect(store.searchQuery).toBe("test");
    expect(store.searchResult).not.toBeNull();
    expect(store.searchResult?.ok).toBe(true);
    const result = store.searchResult as { ok: true; data: Show[] };
    expect(result.data).toHaveLength(1);
  });

  it("stores error result on search failure", async () => {
    searchMock.mockResolvedValueOnce({
      ok: false,
      error: { type: "SERVER", status: 500, message: "HTTP 500" },
    });
    await store.searchShows("fail");
    expect(store.searchQuery).toBe("fail");
    expect(store.searchResult).not.toBeNull();
    expect(store.searchResult?.ok).toBe(false);
  });

  it("overwrites previous results on new search", async () => {
    searchMock.mockResolvedValueOnce(mockResults);
    await store.searchShows("first");
    expect(store.searchResult?.ok).toBe(true);
    searchMock.mockResolvedValueOnce({ ok: true, data: [] });
    await store.searchShows("second");
    expect(store.searchQuery).toBe("second");
    expect(store.searchResult).not.toBeNull();
    expect(store.searchResult?.ok).toBe(true);
    const result = store.searchResult as { ok: true; data: [] };
    expect(result.data).toHaveLength(0);
  });
});

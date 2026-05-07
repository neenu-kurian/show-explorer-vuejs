import { useSearchStore } from "@/stores/search";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockResults } from "../testdata";
import { searchShowsApi } from "@/services/search";

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
    if (!store.searchResult || !store.searchResult.ok) {
      throw new Error("Expected successful result");
    }
    expect(store.searchResult.ok).toBe(true);
    expect(store.searchResult.data).toHaveLength(1);
  });

  it("stores error result on search failure", async () => {
    searchMock.mockResolvedValueOnce({
      ok: false,
      error: { type: "SERVER", status: 500, message: "HTTP 500" },
    });

    await store.searchShows("fail");
    expect(store.searchQuery).toBe("fail");
    expect(store.searchResult?.ok).toBe(false);
  });

  it("overwrites previous results on new search", async () => {
    searchMock.mockResolvedValueOnce({
      ok: true,
      data: [
        {
          score: 1,
          show: {
            id: 1,
            name: "First",
            genres: [],
            status: "",
            runtime: null,
            premiered: null,
            rating: { average: null },
            image: null,
            summary: null,
          },
        },
      ],
    });
    await store.searchShows("first");
    searchMock.mockResolvedValueOnce({ ok: true, data: [] });
    await store.searchShows("second");
    expect(store.searchQuery).toBe("second");
    if (!store.searchResult || !store.searchResult.ok) {
      throw new Error("Expected successful result");
    }
    expect(store.searchResult.ok).toBe(true);
    expect(store.searchResult.data).toHaveLength(0);
  });
});

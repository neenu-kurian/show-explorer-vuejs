import { useCatalogStore } from "@/stores/catalog";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockShows } from "../testdata";
import { fetchShows } from "@/services/shows";

vi.mock("@/services/shows", () => ({
  fetchShows: vi.fn(),
  fetchShowData: vi.fn(),
}));

const fetchMock = vi.mocked(fetchShows);

describe("catalogStore", () => {
  let store: ReturnType<typeof useCatalogStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useCatalogStore();
    vi.clearAllMocks();
  });

  it("initializes with null state", () => {
    expect(store.showsByCategory).toEqual(null);
    expect(store.sortBy).toBe("rating-desc");
  });

  it("fetches and categorizes shows on success", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, data: mockShows });

    await store.getShowsByCategory();

    expect(store.showsByCategory?.ok).toBe(true);
    if (!store.showsByCategory || !store.showsByCategory.ok) {
      throw new Error("Expected successful result");
    }
    expect(store.showsByCategory.data).toHaveProperty("Drama");
    expect(store.showsByCategory.data["Drama"]).toHaveLength(2);
  });

  it("stores error result on fetch failure", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, error: { type: "SERVER", status: 500 } });

    await store.getShowsByCategory();

    expect(store.showsByCategory?.ok).toBe(false);
  });

  describe("sortedShows getter", () => {
    beforeEach(async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, data: mockShows });
      await store.getShowsByCategory();
    });

    it("sorts by rating descending by default", () => {
      const sorted = store.sortedShows;

      if (!sorted || !sorted.ok) {
        throw new Error("Expected successful result");
      }
      expect(sorted.ok).toBe(true);
      const ratings = sorted.data["Drama"]!.map((eachitem) => eachitem.rating.average);
      expect(ratings).toEqual([8.0, 6.0]);
    });

    it("sorts by rating ascending when changed", () => {
      store.sortBy = "rating-asc";

      const sorted = store.sortedShows;
      if (!sorted || !sorted.ok) {
        throw new Error("Expected successful result");
      }
      expect(sorted.ok).toBe(true);
      const ratings = sorted.data["Drama"]!.map((s) => s.rating.average);
      expect(ratings).toEqual([6.0, 8.0]);
    });

    it("passes through error state without sorting", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, error: { type: "NETWORK" } });
      await store.getShowsByCategory();

      const sorted = store.sortedShows;
      expect(sorted?.ok).toBe(false);
    });
  });
});

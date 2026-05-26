import { fetchShows } from "@/services/shows";
import { useCatalogStore } from "@/stores/catalog";
import type { CategorizedShows } from "@/types/show";
import { createPinia, setActivePinia } from "pinia";
import { mockShows } from "../testdata";

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
    const result = store.showsByCategory;
    expect(result?.ok).toBe(true);
    const data = (store.showsByCategory as { ok: true; data: CategorizedShows }).data;
    expect(data).toHaveProperty("Drama");
    expect(data["Drama"]).toHaveLength(2);
  });

  it("stores error result on fetch failure", async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, error: { type: "SERVER", status: 500 } });
    await store.getShowsByCategory();
    expect(store.showsByCategory).toEqual(
      expect.objectContaining({ ok: false })
    );
  });

  describe("sortedShows getter", () => {
    beforeEach(async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, data: mockShows });
      await store.getShowsByCategory();
    });

    it("sorts by rating descending by default", () => {
      const sorted = store.sortedShows;
      expect(sorted?.ok).toBe(true);
      const data = (sorted as { ok: true, data: CategorizedShows }).data;
      const ratings = data["Drama"].map((eachitem) => eachitem.rating.average);
      expect(ratings).toEqual([8.0, 6.0]);
    });

    it("sorts by rating ascending when changed", () => {
      store.sortBy = "rating-asc";
      const sorted = store.sortedShows;
      expect(sorted?.ok).toBe(true);
      const data = (sorted as { ok: true, data: CategorizedShows }).data;
      const ratings = data["Drama"].map((s) => s.rating.average);
      expect(ratings).toEqual([6.0, 8.0]);
    });

    it("passes through error state without sorting", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, error: { type: "NETWORK" } });
      await store.getShowsByCategory();
      expect(store.sortedShows).toEqual(
        expect.objectContaining({ ok: false })
      );
    });
  });
});

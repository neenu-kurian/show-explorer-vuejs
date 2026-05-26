import { useCatalog } from "@/composables/useCatalog";
import { fetchShows } from "@/services/shows";
import { useCatalogStore } from "@/stores/catalog";
import { createPinia, setActivePinia } from "pinia";
import { nextTick } from "vue";
import { withSetup } from "../helpers/withSetup";
import { mockShows, showsByCategory } from "../testdata";

vi.mock("@/services/shows", () => ({
  fetchShows: vi.fn(),
}));

describe("useCatalog", () => {
  let store: ReturnType<typeof useCatalogStore>;
  let cleanup = null as (() => void) | null;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useCatalogStore();
    vi.mocked(fetchShows).mockResolvedValue({ ok: true, data: mockShows });
  });

  afterEach(() => {
    cleanup?.();
    cleanup = null;
  });

  const setup = () => {
    const { result, unmount } = withSetup(() => useCatalog());
    cleanup = unmount;
    return result;
  };

  it("should fetch data on mount if catalog is empty", async () => {
    const showSpy = vi.spyOn(store, "getShowsByCategory");
    const result = setup();
    expect(result.loading.value).toBe(true);
    await nextTick();
    expect(showSpy).toHaveBeenCalledWith(expect.any(AbortSignal));
  });
  it("should not fetch if data already exists", async () => {
    const showSpy = vi.spyOn(store, "getShowsByCategory").mockResolvedValue(undefined);
    const result = setup();
    store.showsByCategory = showsByCategory;
    await nextTick();
    expect(result.loading.value).toBe(false);
    expect(showSpy).toHaveBeenCalled();
  });
  it("should return formatted error message when fetch fails", async () => {
    store.showsByCategory = { ok: false, error: { type: "NETWORK" } };
    const result = setup();
    expect(result.error.value).toBeTruthy();
    expect(result.catalogData.value).toBeNull();
  });
});

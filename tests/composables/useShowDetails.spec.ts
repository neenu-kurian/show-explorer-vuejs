import { useShowDetails } from "@/composables/useShowDetails";
import { fetchCastData } from "@/services/cast";
import { fetchShowData } from "@/services/shows";
import { useShowDetailStore } from "@/stores/showDetail";
import { createPinia, setActivePinia } from "pinia";
import { withSetup } from "../helpers/withSetup";
import { mockCast, mockShow } from "../testdata";

vi.mock("@/services/shows", () => ({
  fetchShowData: vi.fn(),
  fetchShows: vi.fn(),
}));

vi.mock("@/services/cast", () => ({
  fetchCastData: vi.fn(),
}));

describe("useShowDetails", () => {
  let store: ReturnType<typeof useShowDetailStore>;
  let cleanup = null as (() => void) | null;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useShowDetailStore();
    vi.mocked(fetchShowData).mockResolvedValue({ ok: true, data: mockShow });
    vi.mocked(fetchCastData).mockResolvedValue({ ok: true, data: mockCast });
  });

  afterEach(() => {
    cleanup?.();
    cleanup = null;
  });

  const setup = (id: number) => {
    const { result, unmount } = withSetup(() => useShowDetails(id));
    cleanup = unmount;
    return result;
  };

  it("should return null show when data not loaded", () => {
    const result = setup(999);
    expect(result.show.value).toBeNull();
  });

  it("should return show data after fetch", async () => {
    const result = setup(179);
    const { show, fetchShow } = result;
    await fetchShow();
    expect(show.value).toEqual(mockShow);
  });

  it("should return cast members after fetch", async () => {
    const result = setup(179);
    const { cast, fetchShow } = result;
    await fetchShow();
    expect(cast.value).toEqual(mockCast);
  });

  it("should call fetchShowDetails and fetchCastDetails on fetchShow", async () => {
    const showSpy = vi.spyOn(store, "fetchShowDetails");
    const castSpy = vi.spyOn(store, "fetchCastDetails");
    const result = setup(179);
    const { fetchShow } = result;
    await fetchShow();
    expect(showSpy).toHaveBeenCalledWith(179, expect.any(AbortSignal));
    expect(castSpy).toHaveBeenCalledWith(179, expect.any(AbortSignal));
  });

  it("should not refetch show already loaded", async () => {
    const result = setup(179);
    const { fetchShow } = result;
    await fetchShow();
    const showSpy = vi.spyOn(store, "fetchShowDetails");
    await fetchShow();
    expect(showSpy).not.toHaveBeenCalled();
  });

  it("should not refetch show with NOT_FOUND error", async () => {
    vi.mocked(fetchShowData).mockResolvedValueOnce({ ok: false, error: { type: "NOT_FOUND" } });
    const result = setup(999);
    const { fetchShow } = result;
    await fetchShow();
    const showSpy = vi.spyOn(store, "fetchShowDetails");
    await fetchShow();
    expect(showSpy).not.toHaveBeenCalled();
  });

  it("should refetch show with SERVER error", async () => {
    vi.mocked(fetchShowData).mockResolvedValue({
      ok: false,
      error: { type: "SERVER", status: 500 },
    });
    const result = setup(42);
    const { fetchShow } = result;
    await fetchShow();
    const showSpy = vi.spyOn(store, "fetchShowDetails");
    await fetchShow();
    expect(showSpy).toHaveBeenCalled();
  });

  it("should set isNotFound when show returns NOT_FOUND", async () => {
    vi.mocked(fetchShowData).mockResolvedValue({ ok: false, error: { type: "NOT_FOUND" } });
    const result = setup(999);
    const { fetchShow, isNotFound } = result;
    await fetchShow();
    expect(isNotFound.value).toBe(true);
  });

  it("should expose error message when show fetch fails", async () => {
    vi.mocked(fetchShowData).mockResolvedValue({ ok: false, error: { type: "NETWORK" } });
    const result = setup(999);
    const { fetchShow, error } = result;
    await fetchShow();
    expect(error.value).toBeTruthy();
  });
  it("should cancel fetch on unmount", async () => {
    const showSpy = vi.spyOn(store, "fetchShowDetails");
    const { result, unmount } = withSetup(() => useShowDetails(179));
    // Start fetching but don't 'await' yet
    result.fetchShow();
    unmount();
    expect(showSpy).toHaveBeenCalledTimes(1);
    const signal = showSpy.mock.calls[0]![1] as AbortSignal;
    expect(signal.aborted).toBe(true);
  });

  it("should skip show fetch but fetch cast if show data already exists", async () => {
    store.$patch({
      showDetails: { 179: { show: { ok: true, data: mockShow }, cast: null } },
    });
    const showSpy = vi.spyOn(store, "fetchShowDetails");
    const castSpy = vi.spyOn(store, "fetchCastDetails");
    const result = setup(179);
    await result.fetchShow();
    expect(showSpy).not.toHaveBeenCalled();
    expect(castSpy).toHaveBeenCalled();
  });

  it("should expose castError if cast fetch fails but show fetch succeeds", async () => {
    vi.mocked(fetchCastData).mockResolvedValue({
      ok: false,
      error: { type: "SERVER", status: 500 },
    });
    const result = setup(179);
    await result.fetchShow();
    expect(result.error.value).toBeNull();
    expect(result.castError.value).toBeTruthy();
  });
});

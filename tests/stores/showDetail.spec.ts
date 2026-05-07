import { fetchCastData } from "@/services/cast";
import { fetchShowData } from "@/services/shows";
import { useShowDetailStore } from "@/stores/showDetail";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockCast, mockShow } from "../testdata";

vi.mock("@/services/shows.ts", () => ({
  fetchShowData: vi.fn(),
}));

vi.mock("@/services/cast.ts", () => ({
  fetchCastData: vi.fn(),
}));

const fetchShowMock = vi.mocked(fetchShowData);
const fetchCastMock = vi.mocked(fetchCastData);

describe("showDetailStore", () => {
  let store: ReturnType<typeof useShowDetailStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useShowDetailStore();
    vi.clearAllMocks();
  });

  it("initializes with empty cache", () => {
    expect(store.getShowEntry(42)).toBeUndefined();
  });

  it("caches successful show result by id", async () => {
    fetchShowMock.mockResolvedValueOnce({ ok: true, data: mockShow });
    await store.fetchShowDetails(42);
    expect(store.getShowEntry(42)).toBeDefined();
    const entry = store.getShowEntry(42)!;
    expect(entry).toBeDefined();
    const show = entry.show;
    expect(show.ok).toBe(true);
    expect(show.ok ? show.data.name : undefined).toBe("The Wire");
  });

  it("caches NOT_FOUND error by Id", async () => {
    fetchShowMock.mockResolvedValueOnce({
      ok: false,
      error: { type: "NOT_FOUND" },
    });
    await store.fetchShowDetails(999);
    expect(store.getShowEntry(999)).toEqual({
      show: { ok: false, error: { type: "NOT_FOUND" } },
      cast: null,
    });
  });

  it("caches SERVER error response by id", async () => {
    fetchShowMock.mockResolvedValueOnce({
      ok: false,
      error: { type: "SERVER", status: 500 },
    });
    await store.fetchShowDetails(42);
    const entry = store.getShowEntry(42)!;
    expect(entry).toBeDefined();
    expect(entry.show.ok).toBe(false);
  });

  it("does not cache cancelled show requests", async () => {
    const controller = new AbortController();
    fetchShowMock.mockResolvedValueOnce({
      ok: true,
      data: mockShow,
    });
    controller.abort();
    await store.fetchShowDetails(42, controller.signal);
    expect(store.getShowEntry(42)).toBeUndefined();
  });

  it("attaches cast to existing show entry", async () => {
    fetchShowMock.mockResolvedValueOnce({ ok: true, data: mockShow });
    await store.fetchShowDetails(42);
    fetchCastMock.mockResolvedValueOnce({ ok: true, data: mockCast });
    await store.fetchCastDetails(42);
    const entry = store.getShowEntry(42)!;
    const cast = entry.cast;
    expect(cast?.ok).toBe(true);
    expect(cast?.ok ? cast.data : undefined).toHaveLength(1);
  });

  it("stores cast for an existing show entry", async () => {
    fetchShowMock.mockResolvedValueOnce({ ok: true, data: mockShow });
    await store.fetchShowDetails(42);
    fetchCastMock.mockResolvedValueOnce({ ok: true, data: mockCast });
    await store.fetchCastDetails(42);
    const entry = store.getShowEntry(42)!;
    expect(entry.show).toEqual({ ok: true, data: mockShow });
    expect(entry.cast).toEqual({ ok: true, data: mockCast });
  });

  it("does nothing if show is not in cache", async () => {
    fetchCastMock.mockResolvedValueOnce({ ok: true, data: mockCast });
    await store.fetchCastDetails(99);
    expect(store.getShowEntry(99)).toBeUndefined();
  });
});

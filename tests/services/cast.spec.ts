import { API_URL } from "@/constants";
import { fetchCastData } from "@/services/cast";

describe("fetchCastData", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("hits the cast endpoint", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });
    await fetchCastData(7);
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/shows/7/cast`, {
      signal: expect.any(AbortSignal),
    });
  });

  it("returns error when fetch fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("timeout"));
    const response = await fetchCastData(7);
    expect(response.ok).toBe(false);
    if (response.ok) {
      throw new Error("Expected error");
    }
    expect(response.error.type).toBe("NETWORK");
  });
});

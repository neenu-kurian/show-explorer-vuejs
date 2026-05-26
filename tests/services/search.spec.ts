import { API_URL } from "@/constants";
import { searchShowsApi } from "@/services/search";
import { searchResults } from "../testdata";

describe("searchShows", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });
  it("calls search with encoded query", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });
    await searchShowsApi("tom & jerry");
    expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/search/shows?q=tom%20%26%20jerry`, {
      signal: expect.any(AbortSignal),
    });
  });

  it("returns shows when ok", async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(searchResults) });
    const response = await searchShowsApi("d");
    expect(response.ok).toBe(true);
    if (!response || !response.ok) {
      throw new Error("Expected successful result");
    }
    const finalResult = [searchResults[0], searchResults[1]];
    expect(response.data).toEqual(finalResult);
  });
});

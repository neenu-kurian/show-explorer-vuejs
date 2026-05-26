import { API_URL } from "@/constants";
import { fetchShowData, fetchShows } from "@/services/shows";
import { rawData } from "../testdata";

describe("services", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("fetchShows", () => {
    it("hits the shows endpoint", async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });
      await fetchShows();
      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/shows`, {
        signal: expect.any(AbortSignal),
      });
    });

    it("returns uncategorised data when response is ok", async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(rawData) });
      const response = await fetchShows();
      if (!response || !response.ok) {
        throw new Error("Expected successful result");
      }
      expect(response.ok).toBe(true);
      expect(response.data).toEqual(rawData);
    });

    it("returns error when response is not ok", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });
      const response = await fetchShows();
      if (response.ok) {
        throw new Error("Expected error");
      }
      expect(response.ok).toBe(false);
      expect(response.error.type).toBe("SERVER");
      if (response.error.type !== "SERVER") throw new Error("Expected SERVER error");
      expect(response.error.status).toBe(500);
    });

    it("passes the abort signal to the fetch call", async () => {
      const controller = new AbortController();
      fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });
      await fetchShows(controller.signal);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ signal: controller.signal }),
      );
    });

    it("returns error when fetch throws", async () => {
      fetchMock.mockRejectedValueOnce(new Error("Network error"));
      const response = await fetchShows();
      if (!response || response.ok) {
        throw new Error("Expected error");
      }
      expect(response.ok).toBe(false);
      expect(response.error.type).toBe("NETWORK");
    });

    it("returns a parsing error when the data doesn't match the schema", async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: "data" }),
      });
      const response = await fetchShows();
      expect(response.ok).toBe(false);
      if (!response || response.ok) {
        throw new Error("Expected error");
      }
      expect(response.error.type).toBe("VALIDATION");
    });
  });

  describe("fetchShowData", () => {
    it("hits the correct show detail endpoint", async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(rawData[0]) });

      await fetchShowData(179);

      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/shows/179`, {
        signal: expect.any(AbortSignal),
      });
    });
    it("passes the abort signal to the fetch call", async () => {
      const controller = new AbortController();
      fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });

      await fetchShowData(179, controller.signal);

      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ signal: controller.signal }),
      );
    });
    it("returns error with type NOT_FOUND when not ok (404)", async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 404 });
      const response = await fetchShowData(99);
      expect(!response.ok).toBe(true);
      if (response.ok) {
        throw new Error("Expected error");
      }
      expect(response.error.type).toBe("NOT_FOUND");
    });
  });
});

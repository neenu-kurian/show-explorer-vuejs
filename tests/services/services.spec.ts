import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { fetchShows, fetchShowData } from "@/services/shows";
import { fetchCastData } from "@/services/cast";
import { searchShowsApi } from "@/services/search";
import { API_URL } from "@/constants";
import { rawData, showDetails, searchResults } from "../testdata";

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

    it("returns error when fetch throws", async () => {
      fetchMock.mockRejectedValueOnce(new Error("Network error"));
      const response = await fetchShows();
      if (!response || response.ok) {
        throw new Error("Expected error");
      }
      expect(response.ok).toBe(false);
      expect(response.error.type).toBe("NETWORK");
    });
  });

  describe("fetchShowData", () => {
    it("hits the show detail endpoint with id", async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(showDetails) });
      await fetchShowData(42);
      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/shows/42`, {
        signal: expect.any(AbortSignal),
      });
    });

    it("returns show when ok", async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(showDetails) });
      const response = await fetchShowData(42);
      if (!response || !response.ok) {
        throw new Error("Expected successful result");
      }
      expect(response.ok).toBe(true);
      expect(response.data).toEqual(showDetails);
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

  describe("fetchCastData", () => {
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
      expect(!response.ok).toBe(true);
      if (response.ok) {
        throw new Error("Expected error");
      }
      expect(response.error.type).toBe("NETWORK");
    });
  });

  describe("searchShows", () => {
    it("calls search with encoded query", async () => {
      fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve([]) });
      await searchShowsApi("breaking bad");
      expect(fetchMock).toHaveBeenCalledWith(`${API_URL}/search/shows?q=breaking%20bad`, {
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
});

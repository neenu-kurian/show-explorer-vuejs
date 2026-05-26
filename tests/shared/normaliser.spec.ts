import { categorizeShows, sortShows } from "@/shared/normaliser";
import type { CategorizedShows, Show } from "@/types/show";

const createShow = (id: number, genres: string[], rating: number | null): Show => ({
  id,
  name: `Show ${id}`,
  genres,
  rating: { average: rating },
} as Show);

describe("catalogUtils", () => {
  describe("categorizeShows", () => {
    it("should group shows by their genres", () => {
      const shows = [
        createShow(1, ["Drama", "Action"], 5),
        createShow(2, ["Drama"], 8),
      ];

      const result = categorizeShows(shows);

      expect(result["Drama"]).toHaveLength(2);
      expect(result["Action"]).toHaveLength(1);
      expect(result["Action"][0].id).toBe(1);
    });

    it("should return an empty object if no shows are provided", () => {
      expect(categorizeShows([])).toEqual({});
    });
  });

  describe("sortShows", () => {
    const mockData: CategorizedShows = {
      Drama: [
        createShow(1, ["Drama"], 5),
        createShow(2, ["Drama"], 10),
        createShow(3, ["Drama"], null), // Should be treated as 0
      ],
    };

    it("should sort by rating descending (high to low)", () => {
      const result = sortShows(mockData, "rating-desc");
      const ratings = result["Drama"].map(s => s.rating.average);

      expect(ratings).toEqual([10, 5, null]);
    });

    it("should sort by rating ascending (low to high)", () => {
      const result = sortShows(mockData, "rating-asc");
      const ratings = result["Drama"].map(s => s.rating.average);

      expect(ratings).toEqual([null, 5, 10]);
    });

    it("should not mutate the original input array", () => {
      const originalFirstItem = mockData["Drama"]![0];
      sortShows(mockData, "rating-desc");

        expect(mockData["Drama"][0]).toBe(originalFirstItem);
    });
  });
});

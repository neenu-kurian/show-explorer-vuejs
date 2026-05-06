import type { CategorizedShows, Show, SortBy } from "@/types/show";

export function categorizeShows(shows: Show[]): CategorizedShows {
  const result: CategorizedShows = {};
  shows.forEach((show) => {
    show.genres.forEach((genre) => {
      if (!result[genre]) result[genre] = [];
      result[genre].push(show);
    });
  });
  return result;
}

export function sortShows(showsToSort: CategorizedShows, sortBy: SortBy): CategorizedShows {
  return Object.entries(showsToSort).reduce<CategorizedShows>((acc, [genre, shows]) => {
    acc[genre] = [...shows].sort((show1, show2) => {
      const ratingA = show1.rating.average ?? 0;
      const ratingB = show2.rating.average ?? 0;
      return sortBy === "rating-asc" ? ratingA - ratingB : ratingB - ratingA;
    });
    return acc;
  }, {});
}

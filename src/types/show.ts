export type Image = {
  medium?: string;
  original?: string;
};

export type Rating = {
  average: number | null;
};

export type SortBy = "rating-asc" | "rating-desc";

export type Show = {
  readonly id: number;
  name?: string;
  genres: string[];
  status: string;
  runtime: number | null;
  premiered: string | null;
  rating: Rating;
  image: Image | null;
  summary: string | null;
};

export type CategorizedShows = Record<string, Show[]>;

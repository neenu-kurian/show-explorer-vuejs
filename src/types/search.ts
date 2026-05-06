import type { Show } from "./show";

export type SearchResultProps = {
  searchQuery: string;
  hasSearched: boolean;
  shows: Show[];
  searchError: string | null;
  loading: boolean;
};

export type ShowSearchResult = {
  score: number;
  show: Show;
};

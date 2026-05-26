import type { SortOption } from "@/types/components";

export const API_URL = import.meta.env.VITE_API_URL || "https://api.tvmaze.com";

export const MAX_CAST_MEMBERS_TO_DISPLAY = 8;

export const SEARCH_TIMEOUT = 750;

export const sortOptions = [
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
] satisfies readonly SortOption[];

export const SHOW_ERRORS = {
  SHOW_DETAIL_FETCH_ERROR: "Failed to load show details. Please try again later.",
  CAST_FETCH_ERROR: "Failed to load cast details. Please try again later.",
  SEARCH_ERROR: "Failed to load search results. Please try again later.",
  SHOW_NOT_FOUND: "Show not found",
  INVALID_ID: "We can't find that show. It looks like the link might be broken or ID is invalid.",
  SHOW_FETCH_ERROR: "Failed to load shows. Please try again later.",
  NETWORK_ERROR: "No internet connection. Please check your connection and try again.",
  REQUEST_TIMEOUT: "The request took too long. Please try again later.",
  RESPONSE_PARSE_ERROR: "Received unexpected data. Please try again later.",
} satisfies Readonly<Record<string, string>>;

export const TIMEOUT = 10000;

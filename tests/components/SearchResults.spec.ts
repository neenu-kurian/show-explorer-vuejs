import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";
import SearchResults from "@/components/SearchResults.vue";
import { shows } from "../testdata";
import type { Show } from "@/types/show";
import { SHOW_ERRORS } from "@/constants";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ShowCard.vue", () => ({
  default: {
    template: '<div role="list-item"></div>',
    props: ["show"],
  },
}));

vi.mock("@/components/AppLoader.vue", () => ({
  default: {
    template: '<div data-testid="app-loader"></div>',
    props: ["message"],
  },
}));

const renderComponent = (props: {
  searchQuery?: string;
  shows?: Show[];
  searchError?: string | null;
  hasSearched?: boolean;
  loading?: boolean;
}) =>
  render(SearchResults, {
    props: {
      searchQuery: props.searchQuery ?? "test",
      shows: props.shows ?? [],
      searchError: props.searchError ?? null,
      hasSearched: props.hasSearched ?? false,
      loading: props.loading ?? false,
    },
  });

describe("SearchResults.vue", () => {
  it("matches snapshot", () => {
    const { container } = renderComponent({
      searchQuery: "test",
      shows: [],
      loading: true,
    });
    expect(container).toMatchSnapshot();
  });

  it("render loader when loading", () => {
    renderComponent({ loading: true });
    const loader = screen.getByTestId("app-loader");
    expect(loader).toBeInTheDocument();
  });

  it("renders error message when there is error", () => {
    renderComponent({ searchError: SHOW_ERRORS.SHOW_FETCH_ERROR });
    const error = screen.getByText(SHOW_ERRORS.SHOW_FETCH_ERROR);
    expect(error).toBeInTheDocument();
  });

  it("renders empty state when no results are found", () => {
    renderComponent({
      shows: [],
      hasSearched: true,
      searchQuery: "fddgdfgdfgdfgd",
    });
    const noResultText = screen.getByText('No shows found matching "fddgdfgdfgdfgd"');
    expect(noResultText).toBeInTheDocument();
  });

  it("renders shows when search finds results", () => {
    renderComponent({ shows });
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    const searchResults = screen.getAllByRole("listitem");
    expect(searchResults.length).toBe(shows.length);
  });
});

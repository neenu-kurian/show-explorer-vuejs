import SearchResults from "@/components/SearchResults.vue";
import { SHOW_ERRORS } from "@/constants";
import type { Show } from "@/types/show";
import { render, screen } from "@testing-library/vue";
import { shows } from "../testdata";

vi.mock("@/components/ShowCard.vue", () => ({
  default: {
    template: '<div></div>',
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
      shows,
      hasSearched: true,
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
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent(SHOW_ERRORS.SHOW_FETCH_ERROR);
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

    it("does not render empty state before a search has been made", () => {
    renderComponent({ shows: [], hasSearched: false });
    expect(screen.queryByText(/no shows found/i)).not.toBeInTheDocument();
  });

  it("renders shows when search finds results", () => {
    renderComponent({ shows });
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    const searchResults = screen.getAllByRole("listitem");
    expect(searchResults.length).toBe(shows.length);
  });
});

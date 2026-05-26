import SearchResults from "@/components/SearchResults.vue";
import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";
import { mockShows } from "../testdata";

describe("SearchResults Integration", () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/show/:id", name: "show-detail", component: { template: "<div />" } },
    ],
  });

  it("renders the one showCard per result", () => {
    render(SearchResults, {
      props: {
        searchQuery: "test",
        hasSearched: true,
        loading: false,
        searchError: null,
        shows: mockShows,
      },
      global: {
        plugins: [router],
      },
    });

    const showA = screen.getByRole("img", { name: mockShows[0].name });
    expect(showA).toBeInTheDocument();
    const showB = screen.getByRole("img", { name: mockShows[1].name });
    expect(showB).toBeInTheDocument();
    expect(screen.getAllByRole("listitem").length).toBe(mockShows.length);
  });

  it("links to show detail with correct id for each search result", async () => {
    render(SearchResults, {
      props: {
        searchQuery: "test",
        hasSearched: true,
        loading: false,
        searchError: null,
        shows: mockShows,
      },
      global: {
        plugins: [router],
      },
    });
    const link = screen.getAllByRole("link");
    expect(link[0]).toHaveAttribute("href", `/show/${mockShows[0].id}`);
    expect(link[1]).toHaveAttribute("href", `/show/${mockShows[1].id}`);
  });
});

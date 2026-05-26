import ShowCatalog from "@/components/ShowCatalog.vue";
import { useCatalogStore } from "@/stores/catalog";
import type { CategorizedShows } from "@/types/show";
import { render, screen, within } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";
import { showsByCategory } from "../testdata";

describe("ShowCatalog Integration", () => {
    const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/show/:id", name: "show-detail", component: { template: "<div />" } },
    ],
  });

  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("render a section per genre with its shows", () => {
    const store = useCatalogStore();
    store.showsByCategory = showsByCategory;
    render(ShowCatalog, {
      global: { plugins: [router] },
    });
    const genres = screen.getAllByRole("heading", { level: 2 });
    expect(genres.length).toBe(2);
    const musicSection = screen.getByRole("region", { name: "Music" });
    const musicSectionItems = within(musicSection).getAllByRole("listitem");
    expect(musicSectionItems).toHaveLength(2);
    const dramaSection = screen.getByRole("region", { name: "Drama" });
    const dramaSectionItems = within(dramaSection).getAllByRole("listitem");
    expect(dramaSectionItems).toHaveLength(2);
  });

  it("matches the heading with genre name from the data", () => {
    const store = useCatalogStore();
    store.showsByCategory = showsByCategory;
    render(ShowCatalog, {
      global: { plugins: [router] },
    });
    const catalogData = (showsByCategory as { ok: true; data: CategorizedShows }).data;
    const firstGenre = Object.keys(catalogData)[0];
    const firstHeading = screen.getAllByRole("heading", { level: 2 })[0];
    expect(firstHeading).toHaveTextContent(firstGenre);
    const secondGenre = Object.keys(catalogData)[1];
    const secondHeading = screen.getAllByRole("heading", { level: 2 })[1];
    expect(secondHeading).toHaveTextContent(secondGenre);
  });

  it("renders all shows within a genre section as cards", () => {
    const store = useCatalogStore();
    store.showsByCategory = showsByCategory;
    render(ShowCatalog, {
      global: { plugins: [router] },
    });
    const catalogData = (showsByCategory as { ok: true; data: CategorizedShows }).data;
    const firstGenre = Object.keys(catalogData)[0];
    const firstGenreSection = screen.getByRole("region", { name: firstGenre });
    const showCards = within(firstGenreSection).getAllByRole("listitem");
    expect(showCards.length).toBe(catalogData[firstGenre].length);
  });
});

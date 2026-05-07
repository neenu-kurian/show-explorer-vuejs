import { render, screen, waitFor } from "@testing-library/vue";
import HomeView from "@/views/HomeView.vue";
import { createPinia, setActivePinia } from "pinia";
import { useCatalogStore } from "@/stores/catalog";
import { showsByCategory } from "../testdata";
import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/ShowCard.vue", () => ({
  default: {
    template: '<div class="show-card" data-testid="show-card"></div>',
    props: ["show"],
  },
}));

const renderComponent = (props = {}) =>
  render(HomeView, {
    props,
    global: {
      stubs: {
        RouterLink: true,
      },
    },
  });

describe("HomeView.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });
  it("matches snapshot", async () => {
    const catalogStore = useCatalogStore();
    catalogStore.$patch({ showsByCategory });
    const { container } = renderComponent();
    await screen.findByRole("heading", { name: "Music" });
    expect(container).toMatchSnapshot();
  });

  it("displays the loader", async () => {
    const catalogStore = useCatalogStore();
    catalogStore.$patch({
      showsByCategory: null,
    });
    renderComponent();
    expect(await screen.findByText("Loading shows...")).toBeInTheDocument();
  });

  it("displays shows by category when not searching", async () => {
    const catalogStore = useCatalogStore();
    catalogStore.$patch({ showsByCategory });
    renderComponent();
    const categoryData = showsByCategory.ok ? showsByCategory.data : {};
    const totalShows = Object.values(categoryData).reduce((sum, shows) => sum + shows.length, 0);
    await waitFor(() => {
      const showCards = screen.getAllByTestId("show-card");
      expect(showCards).toHaveLength(totalShows);
    });
  });

  it('displays "No shows found" when there are no shows', async () => {
    const catalogStore = useCatalogStore();
    vi.spyOn(catalogStore, "getShowsByCategory").mockResolvedValue(undefined);
    catalogStore.$patch({
      showsByCategory: { ok: true, data: {} },
    });
    renderComponent();
    expect(await screen.findByText("No shows found")).toBeInTheDocument();
  });
});

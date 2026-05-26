import { useCatalogStore } from "@/stores/catalog";
import HomeView from "@/views/HomeView.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { showsByCategory } from "../testdata";

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
        RouterLink: {
          template: '<a :href="to"><slot /></a>',
          props: ["to"]
        },
      },
    },
  });

describe("HomeView.vue", () => {
  let catalogStore: ReturnType<typeof useCatalogStore>;
  beforeEach(() => {
    setActivePinia(createPinia());
    catalogStore = useCatalogStore();
  });
  it("matches snapshot", async () => {
    catalogStore.$patch({ showsByCategory });
    const { container } = renderComponent();
    await screen.findByRole("heading", { name: "Music" });
    expect(container).toMatchSnapshot();
  });

  it("displays the loader", async () => {
    catalogStore.$patch({
      showsByCategory: null,
    });
    renderComponent();
    expect(await screen.findByText(/Loading shows/i)).toBeInTheDocument();
  });

  it("displays shows by category when not searching", async () => {
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
    vi.spyOn(catalogStore, "getShowsByCategory").mockResolvedValue(undefined);
    catalogStore.$patch({
      showsByCategory: { ok: true, data: {} },
    });
    renderComponent();
    expect(await screen.findByText("No shows found")).toBeInTheDocument();
  });
});

import ShowDetailView from "@/views/ShowDetailView.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { showDetails } from "../testdata";

vi.mock("@/services/shows", () => ({
  fetchShowData: vi.fn(),
  fetchShows: vi.fn(),
}));

vi.mock("@/services/cast", () => ({
  fetchCastData: vi.fn(),
}));

const mockBack = vi.fn();
const mockReplace = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({ back: mockBack, replace: mockReplace }),
  useRoute: () => ({
    params: { id: "42" },
  }),
  RouterLink: { template: '<a :href="to"><slot /></a>', props: ["to"] },
}));

import { fetchCastData } from "@/services/cast";
import { fetchShowData } from "@/services/shows";
import { RouterLink } from "vue-router";

vi.mock("@/components/ArrowLeftIcon.vue", () => ({
  default: { template: '<div data-testid="arrow-left-icon"></div>' },
}));

vi.mock("@/components/AppImage.vue", () => ({
  default: {
    name: "AppImage",
    template: '<img data-testid="app-image" />',
    props: ["src", "alt", "loading"],
  },
}));

vi.mock("@/components/ShowRating.vue", () => ({
  default: {
    name: "ShowRating",
    template: '<span data-testid="show-rating"></span>',
    props: ["score"],
  },
}));

vi.mock("@/components/InfoChip.vue", () => ({
  default: {
    name: "InfoChip",
    template: '<span data-testid="info-chip"></span>',
    props: ["label", "value"],
  },
}));

vi.mock("@/components/CastMember.vue", () => ({
  default: {
    name: "CastMember",
    template: '<div data-testid="cast-member"></div>',
    props: ["member"],
  },
}));

const renderComponent = (id = 42) =>
  render(ShowDetailView, {
    props: { id },
    global: {
      components: { RouterLink },
    },
  });

describe("ShowDetail.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockBack.mockClear();
    mockReplace.mockClear();
    vi.mocked(fetchShowData).mockResolvedValue({ ok: true, data: showDetails });
    vi.mocked(fetchCastData).mockResolvedValue({ ok: true, data: [] });
  });

  it("matches snapshot", async () => {
    const { container } = renderComponent();
    await screen.findByRole("heading", { name: showDetails.name });
    expect(container).toMatchSnapshot();
  });

  it("displays loader while loading", () => {
    vi.mocked(fetchShowData).mockImplementation(() => new Promise(() => {}));
    renderComponent();
    expect(screen.getByText(/Loading show details/i)).toBeInTheDocument();
  });

  it("displays show details when available", async () => {
    renderComponent();
    const nameElement = await screen.findByRole("heading", { name: showDetails.name });
    expect(nameElement).toBeInTheDocument();
  });

  it("displays error message when show failed to load", async () => {
    vi.mocked(fetchShowData).mockResolvedValue({
      ok: false,
      error: { type: "SERVER", status: 500 },
    });
    renderComponent();
    const errorMsg = await screen.findByText(/Failed to load show details/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it("redirects to not-found when show does not exist", async () => {
    vi.mocked(fetchShowData).mockResolvedValue({ ok: false, error: { type: "NOT_FOUND" } });
    renderComponent();
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith({ name: "not-found" });
    });
  });

  it("renders a back to shows link", async () => {
    renderComponent();
    const link = await screen.findByRole("link", { name: /back to shows/i });
    expect(link).toBeInTheDocument();
  });
});

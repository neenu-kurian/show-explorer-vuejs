import { render, screen, waitFor } from "@testing-library/vue";
import { showDetails } from "../testdata";
import { createPinia, setActivePinia } from "pinia";
import "@testing-library/jest-dom";
import ShowDetailView from "@/views/ShowDetailView.vue";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
  RouterLink: { template: "<a><slot /></a>" },
}));

import { fetchShowData } from "@/services/shows";
import { fetchCastData } from "@/services/cast";

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
      mocks: { $router: { back: mockBack, replace: mockReplace } },
      components: { RouterLink: { props: ["to"], template: '<a href="/"><slot /></a>' } },
    },
  });

describe("ShowDetail.vue", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockBack.mockReset();
    mockReplace.mockReset();
    vi.mocked(fetchShowData).mockResolvedValue({ ok: true, data: showDetails });
    vi.mocked(fetchCastData).mockResolvedValue({ ok: true, data: [] });
  });

  it("matches snapshot", async () => {
    const { container } = renderComponent();
    await waitFor(() => expect(container).not.toHaveTextContent("Loading show details..."));
    expect(container).toMatchSnapshot();
  });

  it("displays loader while loading", () => {
    vi.mocked(fetchShowData).mockImplementation(() => new Promise(() => {}));
    const { container } = renderComponent();
    expect(container).toHaveTextContent("Loading show details...");
  });

  it("displays show details when available", async () => {
    const { container } = renderComponent();
    await waitFor(() => {
      expect(container).toHaveTextContent(showDetails.name);
    });
  });

  it("displays error message when show failed to load", async () => {
    vi.mocked(fetchShowData).mockResolvedValue({
      ok: false,
      error: { type: "SERVER", status: 500 },
    });
    const { container } = renderComponent();
    await waitFor(() => {
      expect(container).toHaveTextContent("Failed to load show details. Please try again later.");
    });
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
    await waitFor(() => expect(screen.getByText(/back to shows/i)).toBeInTheDocument());
    expect(screen.getByRole("link", { name: /back to shows/i })).toBeInTheDocument();
  });
});

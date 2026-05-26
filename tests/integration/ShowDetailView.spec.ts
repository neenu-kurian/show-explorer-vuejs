import { fetchCastData } from "@/services/cast";
import { fetchShowData } from "@/services/shows";
import type { CastMember } from "@/types/cast";
import type { Result } from "@/types/result";
import ShowDetailView from "@/views/ShowDetailView.vue";
import { render, screen, waitFor } from "@testing-library/vue";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";
import { createDeferred } from "../setup";
import { mockCast, mockShow } from "../testdata";

vi.mock("@/services/shows", () => ({ fetchShowData: vi.fn() }));
vi.mock("@/services/cast", () => ({ fetchCastData: vi.fn() }));

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", name: "home", component: { template: "<div />" } },
    { path: "/show/:id", name: "show-detail", component: { template: "<div />" } },
    { path: "/not-found", name: "not-found", component: { template: "<div />" } },
  ],
});

describe("ShowDetailView Integration", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("renders the show details correctly", async () => {
    vi.mocked(fetchShowData).mockResolvedValueOnce({ ok: true, data: mockShow });
    vi.mocked(fetchCastData).mockResolvedValueOnce({ ok: true, data: mockCast });

    render(ShowDetailView, {
      props: { id: mockShow.id },
      global: { plugins: [router] },
    });

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: mockShow.name })).toBeInTheDocument();
    });
    expect(screen.getByText(/8\.9/)).toBeInTheDocument();
  });

  it("renders cast list once show and cast data have loaded", async () => {
    const { promise, resolve } = createDeferred<Result<CastMember[]>>();
    vi.mocked(fetchShowData).mockResolvedValueOnce({ ok: true, data: mockShow });
    vi.mocked(fetchCastData).mockReturnValueOnce(promise);
    render(ShowDetailView, {
      props: { id: mockShow.id },
      global: { plugins: [router] },
    });
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: mockShow.name })).toBeInTheDocument();
    });
    expect(screen.queryByText("Actor")).not.toBeInTheDocument();
    resolve({ ok: true, data: mockCast });
    await waitFor(() => {
      expect(screen.getByText("Actor")).toBeInTheDocument();
    });
    expect(screen.getByText("Character")).toBeInTheDocument();
  });

  it("navigates to not-found page if show data fetch fails", async () => {
    vi.mocked(fetchShowData).mockResolvedValueOnce({ ok: false, error: { type: "NOT_FOUND" }});
    render(ShowDetailView, {
      props: { id: 999 },
      global: { plugins: [router] },
    });
    await waitFor(() => {
      expect(router.currentRoute.value.name).toBe("not-found");
    });
  });

  it("displays an error message if show data fetch fails", async () => {
    vi.mocked(fetchShowData).mockResolvedValueOnce({ ok: false, error: { type: "SERVER", status: 500 }});
    render(ShowDetailView, {
      props: { id: 999 },
      global: { plugins: [router] },
    });
    await waitFor(() => {
      expect(screen.getByText("Failed to load show details. Please try again later.")).toBeInTheDocument();
    });
  });

  it("goes back to home page when back button is clicked", async () => {
    vi.mocked(fetchShowData).mockResolvedValueOnce({ ok: true, data: mockShow });
    vi.mocked(fetchCastData).mockResolvedValueOnce({ ok: true, data: mockCast });
    render(ShowDetailView, {
      props: { id: mockShow.id },
      global: { plugins: [router] },
    });
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: mockShow.name })).toBeInTheDocument();
    });
    const backButton = screen.getByRole("link", { name: /back to shows/i });
    await backButton.click();
    await waitFor(() => {
      expect(router.currentRoute.value.name).toBe("home");
    });
  });
});

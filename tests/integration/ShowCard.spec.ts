import ShowCard from "@/components/ShowCard.vue";
import { render, screen } from "@testing-library/vue";
import { describe, expect, it } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";
import { showDetails } from "../testdata";

describe("ShowCard Integration", () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: { template: "<div />" } },
      { path: "/show/:id", name: "show-detail", component: { template: "<div />" } },
    ],
  });

  it("renders the full component tree correctly", async () => {
    router.push("/");

    render(ShowCard, {
      props: { show: showDetails },
      global: {
        plugins: [router],
      },
    });

    const posterImg = screen.getByRole("img", { name: showDetails.name });
    expect(posterImg).toHaveAttribute("src", showDetails.image?.medium);
    expect(screen.getByText(/8\.9/)).toBeInTheDocument();
    expect(screen.getByText(showDetails.name)).toBeInTheDocument();
  });

  it("navigates to the correct URL when clicked", async () => {
    render(ShowCard, {
      props: { show: showDetails },
      global: { plugins: [router] },
    });

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", `/show/${showDetails.id}`);
  });

  it("displays the fallback icon instead of an image when image is null", () => {
    const { container } = render(ShowCard, {
      props: { show: { ...showDetails, image: null } },
      global: { plugins: [router] },
    });
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector('[data-slot="icon"]')).toBeInTheDocument();
  });
});

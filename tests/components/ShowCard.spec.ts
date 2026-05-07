import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";
import ShowCard from "@/components/ShowCard.vue";
import { showDetails } from "../testdata";
import type { Show } from "@/types/show";
import { describe, expect, it, vi } from "vitest";

const showWithoutImage = {
  ...showDetails,
  image: null,
};

vi.mock("@heroicons/vue/24/outline", () => ({
  PhotoIcon: {
    template: '<div data-testid="photo-icon"></div>',
  },
}));

vi.mock("@/components/AppImage.vue", () => ({
  default: {
    template: `
      <div class="h-full">
        <img v-if="src" :src="src" :alt="alt" :loading="loading ?? 'lazy'" data-testid="app-image" />
        <div v-else>
          <slot name="fallback">
            <span>No Image Available</span>
          </slot>
        </div>
      </div>
    `,
    props: ["src", "alt", "loading"],
  },
}));

vi.mock("@/components/ShowRating.vue", () => ({
  default: {
    template: '<span data-testid="show-rating">{{ score }}</span>',
    props: ["score"],
  },
}));

const renderComponent = (props: { show: Show }) =>
  render(ShowCard, {
    props,
    global: {
      stubs: {
        RouterLink: {
          props: ["to"],
          template:
            '<a :href="\'/show/\' + to.params.id" role="link" :data-testid="\'/show/\' + to.params.id"><slot /></a>',
        },
      },
    },
  });

describe("ShowCard.vue", () => {
  it("matches snapshot", () => {
    const { container } = renderComponent({
      show: showDetails,
    });
    expect(container).toMatchSnapshot();
  });

  it("shows fallback image when image is not present", () => {
    renderComponent({ show: showWithoutImage });
    const fallbackImage = screen.getByRole("img");
    expect(fallbackImage).toBeInTheDocument();
  });

  it("renders show image with alt text", () => {
    renderComponent({ show: showDetails });
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", showDetails.image?.medium);
    expect(img).toHaveAttribute("alt", showDetails.name);
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("renders show rating", () => {
    renderComponent({ show: showDetails });
    const rating = screen.getByTestId("show-rating");
    expect(rating).toHaveTextContent(showDetails.rating.average.toString());
  });

  it("links to show detail route with show id", () => {
    renderComponent({ show: showDetails });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/show/42");
  });
});

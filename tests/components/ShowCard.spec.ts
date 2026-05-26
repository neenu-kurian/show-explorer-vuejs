import ShowCard from "@/components/ShowCard.vue";
import type { Show } from "@/types/show";
import { render, screen } from "@testing-library/vue";
import { showDetails } from "../testdata";

const showWithoutImage = {
  ...showDetails,
  image: null,
};

vi.mock("@heroicons/vue/24/outline", () => ({
  PhotoIcon: {
    template: '<div data-testid="photo-icon"></div>',
  },
}));

vi.mock("@/components/ShowPoster.vue", () => ({
  default: {
    template: '<div><img v-if="src" :src="src" :alt="alt" loading="lazy" data-testid="app-image" /><div v-else><slot name="fallback"><span>No Image Available</span></slot></div></div>',
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
          template: '<a href="/show/42"><slot /></a>',
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

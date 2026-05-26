import ShowRating from "@/components/ShowRating.vue";
import { render, screen } from "@testing-library/vue";

describe("ShowRating.vue", () => {
  it("matches snapshot", () => {
    const { container } = render(ShowRating, {
      props: {
        score: 8.5,
      },
    });
    expect(container).toMatchSnapshot();
  });

  it("renders the score formatted to one decimal place", () => {
    render(ShowRating, {
      props: { score: 9 },
    });
    expect(screen.getByText("9.0/10")).toBeInTheDocument();
  });

  it("is accessible via the aria-label", () => {
    render(ShowRating, {
      props: { score: 7.456 },
    });
    const ratingElement = screen.getByLabelText("Rating: 7.5 out of 10");
    expect(ratingElement).toBeInTheDocument();
  });
});

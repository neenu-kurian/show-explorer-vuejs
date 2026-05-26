import ShowPoster from "@/components/ShowPoster.vue";
import { render, screen } from "@testing-library/vue";

describe("ShowPoster.vue", () => {
  const defaultProps = {
    src: "https://static.tvmaze.com/uploads/images/original_untouched/0/73.jpg",
    alt: "Glee Image",
  };
  it("matches snapshot", () => {
    const { container } = render(ShowPoster, {
      props: defaultProps,
    });
    expect(container).toMatchSnapshot();
  });

  it("renders the image with correct src and alt attributes", () => {
    render(ShowPoster, { props: defaultProps });
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", defaultProps.src);
    expect(img).toHaveAttribute("alt", defaultProps.alt);
  });

  it("renders the default fallback text when src is missing", () => {
    render(ShowPoster, {
      props: { alt: "No Image" }
    });
    expect(screen.getByText("No Image Available")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders the fallback slot content when src is missing", () => {
    render(ShowPoster, {
      props: { alt: "Custom Fallback" },
      slots: {
        fallback: '<span data-testid="custom-icon">Icon</span>'
      }
    });
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    expect(screen.queryByText("No Image Available")).not.toBeInTheDocument();
  });

  it("shows fallback when the image fails to load", async () => {
  render(ShowPoster, { props: defaultProps });
  const img = screen.getByRole("img");
  await img.dispatchEvent(new Event("error"));
  expect(screen.getByText("No Image Available")).toBeInTheDocument();
});
});

import AppLoader from "@/components/AppLoader.vue";
import { render, screen } from "@testing-library/vue";

describe("AppLoader.vue", () => {
  it("matches snapshot", () => {
    const { container } = render(AppLoader, {
      props: {
        message: "Loading...",
      },
    });
    expect(container).toMatchSnapshot();
  });
  it("displays the default message when no prop is provided", () => {
    render(AppLoader);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
  it("displays a custom message when the prop is provided", () => {
    const customMessage = "Fetching your data...";
    render(AppLoader, {
      props: { message: customMessage },
    });
    expect(screen.getByText(customMessage)).toBeTruthy();
  });
  it("has the correct accessibility role", () => {
    render(AppLoader);
    expect(screen.getByRole("status")).toBeTruthy();
  });
});

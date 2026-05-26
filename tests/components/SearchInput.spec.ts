import SearchInput from "@/components/SearchInput.vue";
import { render, screen } from "@testing-library/vue";

vi.mock("@heroicons/vue/24/outline", () => ({
  MagnifyingGlassIcon: {
    template: '<div data-testid="search-icon"></div>',
  },
}));

const renderComponent = () =>
  render(SearchInput, {
    props: {
      modelValue: "",
      placeholder: "Search for TV shows...",
    },
  });

describe("SearchInput.vue", () => {
  it("matches snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("renders the search input with default props", () => {
    renderComponent();
    const input = screen.getByRole("searchbox", { name: "Search shows" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "search");
    expect(input).toHaveAttribute("placeholder", "Search for TV shows...");
    expect(input).toHaveValue("");
  });
});

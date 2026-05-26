import SortDropDown from "@/components/SortDropdown.vue";
import { fireEvent, render, screen } from "@testing-library/vue";
import { sortOptions } from "../testdata";

vi.mock("@heroicons/vue/24/outline", () => ({
  ChevronDownIcon: { template: "<span />" },
}));

const renderComponent = (overrides = {}) =>
  render(SortDropDown, {
    props: { options: sortOptions, ...overrides },
  });

describe("SortDropDown.vue", () => {
  it("matches snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });

  it("renders all options with correct labels", () => {
    renderComponent();
    sortOptions.forEach(({ label }) => {
      expect(screen.getByRole("option", { name: label })).toBeInTheDocument();
    });
  });

  it("reflects the modelValue as the selected option", () => {
    renderComponent({ modelValue: "rating-asc" });
    const select = screen.getByRole("combobox", { name: /sort shows by rating/i });
    expect(select).toHaveValue("rating-asc");
  });

   it("emits update:modelValue with the selected value when changed", async () => {
    const onUpdate = vi.fn();
    renderComponent({ "onUpdate:modelValue": onUpdate });
    const select = screen.getByRole("combobox", { name: /sort shows by rating/i });
    await fireEvent.update(select, "rating-asc");
    expect(onUpdate).toHaveBeenCalledExactlyOnceWith("rating-asc");
  });
});

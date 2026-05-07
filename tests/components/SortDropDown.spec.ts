import { render } from "@testing-library/vue";
import SortDropDown from "@/components/SortDropdown.vue";
import { sortOptions } from "../testdata";
import { describe, expect, it } from "vitest";

describe("SortDropDown.vue", () => {
  it("matches snapshot", () => {
    const { container } = render(SortDropDown, {
      props: {
        options: sortOptions,
      },
    });
    expect(container).toMatchSnapshot();
  });
});

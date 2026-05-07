import { render } from "@testing-library/vue";
import InfoChip from "@/components/InfoChip.vue";
import { describe, expect, it } from "vitest";

describe("InfoChip.vue", () => {
  it("matches snapshot", () => {
    const { container } = render(InfoChip, {
      props: {
        label: "Duration",
        value: "60m",
      },
    });
    expect(container).toMatchSnapshot();
  });
});

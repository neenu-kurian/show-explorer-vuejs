import { render } from "@testing-library/vue";
import AppLoader from "@/components/AppLoader.vue";
import { describe, expect, it } from "vitest";

describe("AppLoader.vue", () => {
  it("matches snapshot", () => {
    const { container } = render(AppLoader, {
      props: {
        message: "Loading...",
      },
    });
    expect(container).toMatchSnapshot();
  });
});

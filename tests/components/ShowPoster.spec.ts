import { render } from "@testing-library/vue";
import ShowPoster from "@/components/ShowPoster.vue";
import { describe, expect, it } from "vitest";
describe("ShowPoster.vue", () => {
  it("matches snapshot", () => {
    const { container } = render(ShowPoster, {
      props: {
        src: "https://static.tvmaze.com/uploads/images/original_untouched/0/73.jpg",
        alt: "Glee Image",
      },
    });
    expect(container).toMatchSnapshot();
  });
});

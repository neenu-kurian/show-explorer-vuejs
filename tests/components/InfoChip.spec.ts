import InfoChip from "@/components/InfoChip.vue";
import { render, screen } from "@testing-library/vue";

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

  it("renders the label and value correctly", () => {
    render(InfoChip, {
      props: { label: "Rating", value: "8.5" },
    });

    expect(screen.getByText("Rating")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  it("renders only the label when value is not provided", () => {
    render(InfoChip, {
      props: { label: "Status" },
    });

    expect(screen.getByText("Status")).toBeInTheDocument();
  });
});

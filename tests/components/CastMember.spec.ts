import CastMember from "@/components/CastMember.vue";
import { render, screen } from "@testing-library/vue";
import { CastMemberProp } from "../testdata";

vi.mock("@/components/ShowPoster.vue", () => ({
  default: {
    template: '<img data-testid="mock-poster" :src="src" :alt="alt" />',
    props: ["src", "alt"],
  },
}));

const renderComponent = (member = CastMemberProp) =>
  render(CastMember, {
    props: { member },
  });

describe("CastMember.vue", () => {
  it("matches snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
  it("displays the cast member name and character name", () => {
    renderComponent();
    expect(screen.getByText(CastMemberProp.person.name)).toBeInTheDocument();
    expect(screen.getByText(CastMemberProp.character.name)).toBeInTheDocument();
  });
  it("passes the correct image and alt text to the poster component", () => {
    renderComponent();
    const img = screen.getByTestId("mock-poster");
    expect(img).toHaveAttribute("src", CastMemberProp.person.image?.medium);
    expect(img).toHaveAttribute("alt", CastMemberProp.person.name);
  });
  it("does not render the character name if it is missing", () => {
    const partialMember = {
      ...CastMemberProp,
      character: { ...CastMemberProp.character, name: "" }
    };
    renderComponent(partialMember);
    expect(screen.queryByText(CastMemberProp.character.name)).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/vue";
import CastMember from "@/components/CastMember.vue";
import { CastMemberProp } from "../testdata";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";

const renderComponent = () =>
  render(CastMember, {
    props: {
      member: CastMemberProp,
    },
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
});

import NotFoundView from "@/views/NotFoundView.vue";
import { render, screen } from "@testing-library/vue";

describe("NotFoundView", () => {
  it("renders the 404 content and a working link to home", () => {
    render(NotFoundView, {
      global: {
        stubs: {
          RouterLink: {
            template: '<a :href="to"><slot /></a>',
            props: ['to']
          }
        }
      }
    });
    expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /go back to home/i });
    expect(link.getAttribute("href")).toBe("/");
  });
});

import { htmlToText } from "@/shared/htmlToText";

describe("htmlToText", () => {
  it("returns empty string for empty input", () => {
    expect(htmlToText("")).toBe("");
  });

  it("returns empty string for falsy input", () => {
    expect(htmlToText(null as unknown as string)).toBe("");
    expect(htmlToText(undefined as unknown as string)).toBe("");
  });

  it("returns plain text unchanged", () => {
    expect(htmlToText("Breaking Bad")).toBe("Breaking Bad");
  });

  it("strips a simple tag", () => {
    expect(htmlToText("<p>Hello</p>")).toBe("Hello");
  });

  it("strips multiple different tags", () => {
    expect(htmlToText("<h1>Title</h1><p>Body</p>")).toBe("TitleBody");
  });

  it("strips tags with attributes", () => {
    expect(htmlToText('<a href="https://example.com">Click</a>')).toBe("Click");
  });

  it("strips self-closing tags", () => {
    expect(htmlToText("Line one<br/>Line two")).toBe("Line oneLine two");
  });

  it("strips script tags, leaving no executable content", () => {
    expect(htmlToText('<script>alert("xss")</script>')).toBe('alert("xss")');
  });

  it("strips inline event handlers", () => {
    expect(htmlToText('<img src="x" onerror="alert(1)">')).toBe("");
  });

  it("preserves text between nested tags", () => {
    expect(htmlToText("<div><span>Nested</span></div>")).toBe("Nested");
  });
});

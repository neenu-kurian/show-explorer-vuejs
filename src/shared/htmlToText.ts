export function htmlToText(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}

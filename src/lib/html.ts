/**
 * Moves every heading in merchant-written HTML (descriptions, articles, pages)
 * one level down, so it can't compete with the page's own `<h1>`.
 */
export function demoteHeadings(html: string): string {
  return html.replace(/<(\/?)h([1-5])(?=[\s>])/gi, (_, slash: string, level: string) => {
    return `<${slash}h${Number(level) + 1}`;
  });
}

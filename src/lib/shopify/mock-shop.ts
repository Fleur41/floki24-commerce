import { mainMenu } from "@/content/navigation";
import type { MenuItem } from "@/content/types";
import { isMockShop } from "./client";

/**
 * When the app runs without store credentials it talks to the public
 * mock.shop catalog, which has its own collection handles. This map points
 * the floki24 handles used in the navigation and on the homepage at the
 * closest mock collection, so the demo is browsable end to end.
 *
 * Navigation links not listed here inherit the alias of their nearest
 * parent menu item (see `navigationAliases`).
 *
 * With real credentials the map is ignored and handles pass through.
 */
const mockCollectionAliases: Record<string, string> = {
  angebote: "relaxed-lounging",
  "neue-artikel": "gathering-table-collection",
  "saunen-infrarotkabinen": "sanctuary-bath",
  "saunen-whirpool": "sanctuary-bath",
  whirlpools: "sanctuary-bath",
  massagesessel: "relaxed-lounging",
  gartenmobel: "gathering-table-collection",
  mobel: "textured-comfort",
  camping: "botanical-accents",
  strandkorbe: "relaxed-lounging",
  wellnessprodukte: "sanctuary-bath",
  "duschkabinen-badewannen": "sanctuary-bath",
  kinderbetten: "serene-slumber-suite",
  pavillions: "botanical-accents",
  "garten-terrasse": "gathering-table-collection",
  "sport-freizeit": "productive-nooks",
  tierbedarf: "organized-calm",
  haustierzubehor: "organized-calm",
  "baumarkt-heimwerken": "culinary-essentials",
  "baby-kind": "serene-slumber-suite",
  wohnzimmer: "luminous-living-spaces",
  "kuche-esszimmer": "culinary-essentials",
  schlafzimmer: "serene-slumber-suite",
  badezimmer: "sanctuary-bath",
  dekoration: "reflective-decor",
};

/** Used for menu branches with no aliased ancestor (e.g. "Haus & Wohnen" has no link). */
const DEFAULT_MOCK_COLLECTION = "textured-comfort";

function collectionHandle(href: string | undefined): string | undefined {
  return href?.match(/^\/collections\/([^/?#]+)/)?.[1];
}

/** Maps every collection linked from the main menu to the alias of its nearest aliased ancestor. */
function navigationAliases(items: MenuItem[], inherited: string, aliases: Record<string, string>) {
  for (const item of items) {
    const handle = collectionHandle(item.href);
    const alias = (handle && mockCollectionAliases[handle]) || inherited;
    if (handle) aliases[handle] ??= alias;
    if (item.items) navigationAliases(item.items, alias, aliases);
  }
  return aliases;
}

const aliases: Record<string, string> = isMockShop
  ? { ...navigationAliases(mainMenu, DEFAULT_MOCK_COLLECTION, {}), ...mockCollectionAliases }
  : {};

export function resolveCollectionHandle(handle: string): string {
  return aliases[handle] || handle;
}

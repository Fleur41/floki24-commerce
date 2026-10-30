import type { MenuItem } from "./types";

/**
 * Main navigation ("Mega Menü") mirrored from floki24.ch.
 * Items without an `href` are column headings that only group links.
 */
export const mainMenu: MenuItem[] = [
  {
    title: "Garten & Terrasse",
    href: "/collections/garten-terrasse",
    items: [
      {
        title: "Gartenmöbel",
        href: "/collections/gartenmobel",
        items: [
          { title: "Strandkörbe", href: "/collections/strandkorbe" },
          { title: "Strandkorbzubehör", href: "/collections/strandkorbzubehor" },
          { title: "Bänke", href: "/collections/banke" },
          { title: "Hocker", href: "/collections/hocker" },
          { title: "Hollywoodschaukeln", href: "/collections/hollywoodschaukeln" },
          { title: "Liegestühle", href: "/collections/liegestuhle" },
          { title: "Lounge Möbel", href: "/collections/lounge-mobel" },
          { title: "Outdoor Bar Möbel", href: "/collections/outdoor-bar-mobel" },
          { title: "Outdoor Sitzsäcke", href: "/collections/outdoor-sitzsacke" },
          { title: "Polsterauflagen", href: "/collections/polsterauflagen" },
          { title: "Sets", href: "/collections/sets" },
          { title: "Sitzgruppen", href: "/collections/sitzgruppen" },
          { title: "Stühle & Sessel", href: "/collections/stuhle-sessel" },
          { title: "Tische", href: "/collections/tische" },
        ],
      },
      {
        title: "Gewächshaus & Gärtnern",
        href: "/collections/gewachshaus-gartnern",
        items: [
          { title: "Gewächshäuser", href: "/collections/gewachshauser" },
          { title: "Hochbeete", href: "/collections/hochbeete" },
          { title: "Pflanztische", href: "/collections/pflanztische" },
        ],
      },
      {
        title: "Gartenpavillons",
        href: "/collections/pavillions",
        items: [
          { title: "Pavillons", href: "/collections/pavillions" },
          { title: "Ersatzdach für Pavillons", href: "/collections/ersatzdach-fur-pavillons" },
        ],
      },
      {
        title: "Pflegemittel",
        href: "/collections/pflegemittel",
        items: [
          { title: "Pflegemittel", href: "/collections/pflegemittel" },
          { title: "Sonnenschutz & Sichtschutz", href: "/collections/sonnenschutz-sichtschutz" },
          { title: "Schirme & Schirmständer", href: "/collections/schirme-schirmstander" },
          { title: "Schutzhüllen", href: "/collections/schutzhullen" },
          { title: "Terrassenüberdachung", href: "/collections/terrassenuberdachung" },
          { title: "Strandkorbzubehör", href: "/collections/strandkorbzubehor" },
        ],
      },
      {
        title: "Badespass",
        href: "/collections/badespass",
        items: [
          { title: "Outdoor Whirlpools", href: "/collections/outdoor-whirlpools" },
          { title: "Whirlpool-Zubehör", href: "/collections/whirlpool-zubehor" },
        ],
      },
    ],
  },
  {
    title: "Haus & Wohnen",
    items: [
      {
        title: "Wohnzimmer",
        href: "/collections/wohnzimmer",
        items: [
          { title: "Bar Möbel", href: "/collections/bar-mobel" },
          { title: "Massagesessel", href: "/collections/massagesessel" },
          { title: "Aufstehsessel", href: "/collections/aufstehsessel" },
          { title: "Sessel & Hocker", href: "/collections/sessel-hocker" },
          { title: "Sofas & Wohnlandschaften", href: "/collections/sofas-wohnlandschaften" },
          { title: "TV-Boards", href: "/collections/tv-boards" },
          { title: "Wandregale", href: "/collections/wandregale" },
        ],
      },
      {
        title: "Küche & Esszimmer",
        href: "/collections/kuche-esszimmer",
        items: [
          { title: "Esstische", href: "/collections/esstische" },
          { title: "Weinschränke & -regale", href: "/collections/weinschranke-regale" },
        ],
      },
      {
        title: "Büro & Arbeitsplatz",
        items: [
          { title: "Bürostühle", href: "/collections/burostuhle" },
          { title: "Schreibtische", href: "/collections/schreibtische" },
          { title: "Sekretäre", href: "/collections/sekretare" },
          { title: "Massagesessel", href: "/collections/massagesessel" },
          { title: "Wandregale", href: "/collections/wandregale" },
        ],
      },
      {
        title: "Schlafzimmer",
        href: "/collections/schlafzimmer",
        items: [
          { title: "Betten", href: "/collections/betten" },
          { title: "Betten bis 140cm", href: "/collections/betten-bis-140cm" },
          { title: "Doppelbetten", href: "/collections/betten-ab-160cm" },
          { title: "Himmelbetten", href: "/collections/himmelbetten" },
          { title: "Lattenroste", href: "/collections/lattenroste" },
          { title: "Matratzen", href: "/collections/matratzen" },
          { title: "Kleiderschränke", href: "/collections/kleiderschranke" },
          { title: "Nachttische", href: "/collections/nachttische" },
          { title: "Spiegel", href: "/collections/spiegel" },
          { title: "Wandregale", href: "/collections/wandregale" },
        ],
      },
      {
        title: "Kindermöbel",
        href: "/collections/kindermobel",
        items: [
          { title: "Kinderbetten", href: "/collections/kinderbetten" },
          { title: "Kindermatratzen", href: "/collections/kindermatratzen" },
          { title: "Tunnel für Hochbetten", href: "/collections/tunnel-fur-hochbetten" },
        ],
      },
      {
        title: "Badezimmer",
        href: "/collections/badezimmer",
        items: [
          { title: "Whirlpool Badewannen", href: "/collections/whirlpool-badewannen" },
          { title: "Dampfduschen", href: "/collections/dampfduschen" },
          { title: "Standarmaturen", href: "/collections/standarmaturen" },
          { title: "Einbau-Badewannen", href: "/collections/einbau-badewannen" },
          { title: "Freistehende Badewannen", href: "/collections/freistehende-badewannen" },
          { title: "Badmöbel", href: "/collections/badmobel" },
        ],
      },
      {
        title: "Garderobe & Flur",
        items: [
          { title: "Garderobenbänke", href: "/collections/garderobenbanke" },
          { title: "Garderobenschränke", href: "/collections/garderobenschranke" },
          { title: "Hänge- & Wandgarderoben", href: "/collections/hange-wandgarderoben" },
          { title: "Schuhschränke", href: "/collections/schuhschranke" },
        ],
      },
      {
        title: "Dekoration",
        href: "/collections/dekoration",
        items: [
          { title: "Dekoration", href: "/collections/dekoration" },
          { title: "Spiegel", href: "/collections/spiegel" },
        ],
      },
      { title: "NEU Adventskalender 2026", href: "/collections/neu-adventskalender-2026" },
    ],
  },
  {
    title: "Sport & Freizeit",
    href: "/collections/sport-freizeit",
    items: [
      {
        title: "Camping & Outdoor",
        href: "/collections/camping",
        items: [
          { title: "Campingstühle", href: "/collections/campingstuhle" },
          { title: "Campingtische", href: "/collections/campingtische" },
          { title: "Camping-Zubehör", href: "/collections/camping-zubehor" },
          { title: "Dachzelte", href: "/collections/dachzelte" },
          { title: "Feldbetten", href: "/collections/feldbetten" },
          { title: "Sitzsäcke" },
          { title: "Zelte", href: "/collections/zelte" },
        ],
      },
      {
        title: "Fahrrad",
        items: [
          { title: "Fahrradanhänger", href: "/collections/fahrradanhanger" },
          {
            title: "Ballistol Fahrradpflege | Bike Care",
            href: "/collections/ballistol-fahrradpflege-bike-care",
          },
        ],
      },
      {
        title: "Spiel & Hobby",
        items: [
          { title: "Elektronische Dartscheiben", href: "/collections/elektronische-dartscheiben" },
          { title: "Spieltische", href: "/collections/spieltische" },
          { title: "Staffeleien", href: "/collections/staffeleien" },
          { title: "Trampoline & Zubehör", href: "/collections/trampoline-zubehor" },
        ],
      },
      {
        title: "Fitness & Kraftsport",
        items: [
          {
            title: "Laufbänder für Ausdauer und Fitness",
            href: "/collections/elektrische-laufbander",
          },
          { title: "Rollentrainer", href: "/collections/rollentrainer" },
          { title: "Ergometer & Heimtrainer", href: "/collections/ergometer-heimtrainer" },
          { title: "Krafttraining", href: "/collections/krafttraining" },
          { title: "Steppbretter & Mini Stepper", href: "/collections/steppbretter-mini-stepper" },
          { title: "Boxsäcke", href: "/collections/boxsacke" },
          { title: "Hanteln", href: "/collections/hanteln" },
        ],
      },
    ],
  },
  {
    title: "Tierbedarf",
    href: "/collections/tierbedarf",
    items: [
      {
        title: "Hundezubehör",
        href: "/collections/hundezubehor",
        items: [
          { title: "Hundeboxen", href: "/collections/hundeboxen" },
          { title: "Hundesport", href: "/collections/hundesport" },
          { title: "Hundewagen & Anhänger", href: "/collections/hundewagen-anhanger" },
          { title: "Hundewannen & Pools", href: "/collections/hundewannen-pools" },
          { title: "Näpfe & Futterstationen", href: "/collections/napfe-futterstationen" },
          { title: "Tierbetten", href: "/collections/tierbetten" },
          { title: "Tierpflegetische", href: "/collections/tierpflegetische" },
          { title: "Tierföhne", href: "/collections/tierfohne" },
          { title: "Absperrgitter & Welpenauslauf", href: "/collections/welpenauslauf" },
          { title: "Freilaufgehege", href: "/collections/freilaufgehege" },
        ],
      },
      {
        title: "Katzenzubehör",
        href: "/collections/katzenzubehor",
        items: [
          { title: "Katzenhäuser", href: "/collections/katzenhauser" },
          { title: "Kratzbäume", href: "/collections/kratzbaume" },
          { title: "Näpfe & Futterstationen", href: "/collections/napfe-futterstationen" },
          { title: "Tierbetten", href: "/collections/tierbetten" },
          { title: "Tierpflegetische", href: "/collections/tierpflegetische" },
          { title: "Tierföhne", href: "/collections/tierfohne" },
        ],
      },
      {
        title: "Kleintierzubehör",
        items: [
          { title: "Absperrgitter & Welpenauslauf", href: "/collections/welpenauslauf" },
          { title: "Freilaufgehege", href: "/collections/freilaufgehege" },
          { title: "Hasenställe", href: "/collections/hasenstall" },
        ],
      },
      {
        title: "Vogelzubehör",
        items: [{ title: "Hühnerställe", href: "/collections/huhnerstalle" }],
      },
    ],
  },
  {
    title: "Wellnessprodukte & Kosmetikartikel",
    href: "/collections/wellnessprodukte",
    items: [
      {
        title: "Körperpflege",
        href: "/collections/korperpflege",
        items: [
          { title: "Badekugeln", href: "/collections/badekugeln" },
          { title: "Body Lotion", href: "/collections/body-lotion" },
          { title: "Fusspflege", href: "/collections/fusspflege" },
          { title: "Gesichtscreme & Pflege", href: "/collections/gesichtscreme" },
          { title: "Hand- & Nagelpflege", href: "/collections/hand-nagelpflege" },
          { title: "Handcreme", href: "/collections/handcreme" },
          { title: "Körpercreme", href: "/collections/korpercreme" },
          { title: "Körperpeeling", href: "/collections/korperpeeling" },
          { title: "Lippenpflege", href: "/collections/lippenpflege" },
          { title: "Wax Bars", href: "/collections/wax-bars" },
        ],
      },
      {
        title: "Bad & Dusche",
        href: "/collections/bad-dusche",
        items: [
          { title: "Bad & Dusche", href: "/collections/bad-dusche" },
          { title: "Duschgel", href: "/collections/duschgel" },
          { title: "Seifen & Flüssigseifen", href: "/collections/seife" },
        ],
      },
      {
        title: "Bartpflege & Rasur",
        href: "/collections/bartpflege-rasur",
        items: [{ title: "Bartpflege & Rasur", href: "/collections/bartpflege-rasur" }],
      },
      {
        title: "Raumduft",
        href: "/collections/raumduft",
        items: [
          { title: "Auto-Duft", href: "/collections/auto-duft" },
          { title: "Duft-Kerzen", href: "/collections/duft-kerzen" },
          { title: "Duft-Sachets", href: "/collections/duft-sachets" },
          { title: "Duft-Sprays", href: "/collections/duft-sprays" },
          { title: "Duft-Öl-Essenzen", href: "/collections/duft-ol-essenzen" },
          { title: "Duft-Reiniger", href: "/collections/duft-reiniger" },
          { title: "Reed-Diffuser Öle", href: "/collections/reed-diffuser-ole" },
          { title: "Reed-Diffuser Zubehör", href: "/collections/reed-diffuser-zubehor" },
        ],
      },
      {
        title: "Displays & Sets",
        items: [{ title: "Displays", href: "/collections/displays" }],
      },
      {
        title: "Massage & Saunaöle",
        items: [
          { title: "Massage- & Heilöl", href: "/collections/massage-heilol" },
          { title: "Saunaöl", href: "/collections/saunaol" },
        ],
      },
    ],
  },
  {
    title: "Baumarkt & Heimwerken",
    href: "/collections/baumarkt-heimwerken",
    items: [
      {
        title: "Schweisszubehör",
        href: "/collections/schweisszubehor",
        items: [
          { title: "Schweisserhandschuhe", href: "/collections/schweisserhandschuhe" },
          { title: "Schweisshelme", href: "/collections/schweisshelme" },
        ],
      },
      {
        title: "Ballistol",
        href: "/collections/ballistol",
        items: [
          {
            title: "Ballistol Animal | Tierpflege & Mückenschutz",
            href: "/collections/ballistol-tierpflegeprodukte",
          },
          {
            title: "Ballistol Fahrradpflege | Bike Care",
            href: "/collections/ballistol-fahrradpflege-bike-care",
          },
          {
            title: "Ballistol Hausmittel | Neo Ballistol",
            href: "/collections/ballistol-hausmittel-neo-ballistol",
          },
          {
            title: "Ballistol Händedesinfektion",
            href: "/collections/ballistol-handedesinfektion",
          },
          {
            title: "Ballistol Mückenschutz | Stichfrei",
            href: "/collections/ballistol-muckenschutz-stichfrei",
          },
          { title: "Ballistol Universalöl", href: "/collections/ballistol-universalol" },
          {
            title: "Ballistol Waffenpflege | GunEx",
            href: "/collections/ballistol-waffenpflege-gunex",
          },
          { title: "Ballistol Werkstattzubehör", href: "/collections/ballistol-werkstattzubehor" },
        ],
      },
    ],
  },
  {
    title: "Baby & Kind",
    href: "/collections/baby-kind",
    items: [
      {
        title: "Kindermöbel",
        href: "/collections/kindermobel",
        items: [
          { title: "Kinderbetten", href: "/collections/kinderbetten" },
          { title: "Kindermatratzen", href: "/collections/kindermatratzen" },
          { title: "Tunnel für Hochbetten", href: "/collections/tunnel-fur-hochbetten" },
        ],
      },
      {
        title: "Kinderfahrzeuge",
        href: "/collections/kinderfahrzeuge",
        items: [
          { title: "Dreiräder", href: "/collections/dreirader" },
          { title: "Elektrofahrzeuge", href: "/collections/elektrofahrzeuge" },
          { title: "Go Karts & Pedalfahrzeuge", href: "/collections/go-karts-pedalfahrzeuge" },
          { title: "Tretroller", href: "/collections/tretroller" },
          { title: "Laufräder und Rutscher", href: "/collections/laufrader-und-rutscher" },
          { title: "Fahrradanhänger", href: "/collections/fahrradanhanger" },
        ],
      },
      {
        title: "Outdoor Spielzeug",
        href: "/collections/outdoor-spielzeug",
        items: [
          { title: "Spielhaus & Spielturm", href: "/collections/spielhaus-spielturm" },
          { title: "Sandkasten", href: "/collections/sandkasten" },
          { title: "Schaukeln", href: "/collections/schaukeln" },
          { title: "Outdoor Spielgeräte", href: "/collections/outdoor-spielgerate" },
          { title: "Hüpfburgen", href: "/collections/hupfburgen" },
        ],
      },
      {
        title: "Indoor Spielzeug",
        href: "/collections/indoor-spielzeug",
        items: [{ title: "Indoor Spielgeräte", href: "/collections/indoor-spielgerate" }],
      },
    ],
  },
  {
    title: "Saunen & Infrarotkabinen",
    href: "/collections/saunen-infrarotkabinen",
    items: [
      {
        title: "Infrarotkabinen",
        href: "/collections/infrarotkabinen",
        items: [{ title: "Infrarotkabinen", href: "/collections/infrarotkabinen" }],
      },
      {
        title: "Saunen",
        href: "/collections/230v-saunen",
        items: [
          { title: "Aussen- & Fasssaunen", href: "/collections/aussen-fasssaunen" },
          { title: "Innensaunen", href: "/collections/innensaunen" },
          { title: "230V-Sauna", href: "/collections/230v-saunen" },
        ],
      },
      {
        title: "Sauna-Zubehör",
        href: "/collections/sauna-zubehor",
        items: [
          { title: "Saunaöl", href: "/collections/saunaol" },
          { title: "Sauna-Zubehör", href: "/collections/sauna-zubehor" },
        ],
      },
    ],
  },
];

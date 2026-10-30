import { shopFile } from "./site";
import type { ContentLink, ImageLink } from "./types";

export type Slide = ImageLink & {
  subheading: string;
  buttonLabel: string;
};

export type Highlight = {
  title: string;
  /** Path in /public or a Shopify file URL. */
  icon: string;
};

export type CategoryList = {
  title?: string;
  items: ImageLink[];
  cta: ContentLink;
};

export type FeaturedCollection = {
  title: string;
  collectionHandle: string;
  promo: { title: string; image: string; buttonLabel: string };
};

/** Homepage sections, in the order they are rendered. */
export const home = {
  slides: [
    {
      title: "Saunen & Infrarotkabinen",
      subheading: "Für Innen und Aussen - für warme Stunden in der kalten Jahreszeit",
      buttonLabel: "Jetzt ansehen",
      href: "/collections/saunen-infrarotkabinen",
      image: shopFile("DSC_2514-2_S.webp"),
    },
    {
      title: "Whirlpools",
      subheading: "Geniessen Sie wohlige Stunden in unseren Whirpools & Whirlpool-Badewannen",
      buttonLabel: "Jetzt ansehen",
      href: "/collections/whirlpools",
      image: shopFile("2602-Whirlpool-Atlantic-XL-02_1_e31bb94d-9d59-4772-8f10-51fa1d6f7e86.jpg"),
    },
    {
      title: "Massagesessel",
      subheading: "Gönnen Sie sich eine perfekte Massage zu Hause - jederzeit",
      buttonLabel: "Jetzt ansehen",
      href: "/collections/massagesessel",
      image: shopFile(
        "20321-Home-Deluxe-Massagesessel-DUNES-Schwarz-Ambiente01_8cc35127-74d1-458c-9f69-12664a3720af.jpg",
      ),
    },
    {
      title: "Hochwertige Gartenmöbel",
      subheading: "Garten & Terrasse einrichten mit Weitsicht - überdauert Dekaden",
      buttonLabel: "Jetzt stöbern",
      href: "/collections/gartenmobel",
      image: shopFile("Gartenmoebel_Floki.png"),
    },
  ] satisfies Slide[],

  highlights: [
    { title: "Kostenloser Versand", icon: "/icons/delivery.svg" },
    { title: "Sichere Zahlungsmethode", icon: "/icons/cell-phone.svg" },
    { title: "Schneller Kundensupport", icon: "/icons/chat-alternate.svg" },
    {
      title: "Schweizer Unternehmen",
      icon: shopFile("Schweiz_Icon_5b3fb2aa-dc5f-4fd4-b1a0-d36fbcd1d2ea.png"),
    },
  ] satisfies Highlight[],

  promoMosaic: [
    {
      title: "Massagesessel",
      href: "/collections/massagesessel",
      image: shopFile("11630-Home-Deluxe-Massagesessel-Sueno-Schwarz-Ambiente-Model01_1.jpg"),
    },
    {
      title: "Saunen- und Infrarotkabinen",
      href: "/collections/saunen-infrarotkabinen",
      image: shopFile("Sauna_8_AdobeStock_166155473_S.jpg"),
    },
  ] satisfies ImageLink[],

  categoryLists: [
    {
      title: "Unsere Kategorien",
      cta: { title: "Jetzt Entdecken", href: "/collections/mobel" },
      items: [
        {
          title: "Saunen- und Infrarotkabinen",
          href: "/collections/saunen-infrarotkabinen",
          image: shopFile("49253-Home-Deluxe-Sauna-Shadow-L-45-grad-01_1.jpg"),
        },
        {
          title: "Garten- & Loungemöbel",
          href: "/collections/gartenmobel",
          image: shopFile("94170087-1800x1800-80-_1.jpg"),
        },
        {
          title: "Massagesessel",
          href: "/collections/massagesessel",
          image: shopFile("55544-home-deluxe-massagesessel-elvora-schwarz-ambiente-01.jpg"),
        },
        {
          title: "Whirlpools & Badewannen mit Whirlpoolfunktion",
          href: "/collections/whirlpools",
          image: shopFile(
            "2602-Whirlpool-Atlantic-XL-02_1_46b8902c-0b8f-40bf-9403-fef85eccb7c8.jpg",
          ),
        },
        {
          title: "Möbel",
          href: "/collections/mobel",
          image: shopFile("09-313-665-1007-4.jpg"),
        },
      ],
    },
    {
      cta: { title: "Jetzt Entdecken", href: "/collections/wellnessprodukte" },
      items: [
        {
          title: "Strandkörbe",
          href: "/collections/strandkorbe",
          image: shopFile(
            "321649026p_devries_pure_comfort_xl_pe_griseum_des_490_1280x1280_441c8935-335b-4d2a-b5ee-204cfa8d06f1.jpg",
          ),
        },
        {
          title: "Wellnessprodukte",
          href: "/collections/wellnessprodukte",
          image: shopFile("245346_2.jpg"),
        },
        {
          title: "Duschkabinen & Badewannen",
          href: "/collections/duschkabinen-badewannen",
          image: shopFile("1068-home-deluxe-dampfdusche-diamond-ambiente-03.jpg"),
        },
        {
          title: "Kinderbetten",
          href: "/collections/kinderbetten",
          image: shopFile(
            "1887-2_5184e4d36b0d5de8_1920x1920_4ce528c4-dd4e-4e79-9476-f0790304acae.jpg",
          ),
        },
        {
          title: "Pavillons",
          href: "/collections/pavillions",
          image: shopFile("3JR90f1828c20a1cd_jpg.jpg"),
        },
      ],
    },
  ] satisfies CategoryList[],

  blog: {
    title: "Neuigkeiten & Infos von Floki24.ch",
    handle: "news",
    articleCount: 3,
  },

  featuredCollections: [
    {
      title: "Angebote",
      collectionHandle: "angebote",
      promo: {
        title: "Neueste Angebote",
        buttonLabel: "Jetzt Entdecken",
        image: shopFile("94170087-1800x1800-80_268ede10-232a-4bec-b6cc-b5aca7c2990a.jpg"),
      },
    },
    {
      title: "Neue Artikel",
      collectionHandle: "neue-artikel",
      promo: {
        title: "Neue Artikel",
        buttonLabel: "Jetzt Entdecken",
        image: shopFile("2203-1800x1800-80-_6.jpg"),
      },
    },
  ] satisfies FeaturedCollection[],

  promoGrid: [
    {
      title: "Sauna & Infrarotkabine",
      href: "/collections/saunen-infrarotkabinen",
      image: shopFile(
        "21972-Home-Deluxe-OutdoorSauna-CUBE-L-Ambiente-01_3191dee8-57b1-42af-af3b-5bfea08d6198.jpg",
      ),
    },
    {
      title: "Whirlpools",
      href: "/collections/whirlpools",
      image: shopFile("2602-Whirlpool-Atlantic-XL-02_1.jpg"),
    },
    {
      title: "Garten- & Loungemöbel",
      href: "/collections/gartenmobel",
      image: shopFile("40100090-1-1800x1800-80-_3.jpg"),
    },
    {
      title: "Camping",
      href: "/collections/camping",
      image: shopFile("BamDach-ZEltdach-Dachzelt-scaled-_5.jpg"),
    },
  ] satisfies ImageLink[],
};

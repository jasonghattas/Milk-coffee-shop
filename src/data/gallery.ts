/**
 * Photos. Every image here is a real photo of Milk supplied by the owner.
 * To add one: put the file in /public/photos and add an entry below.
 * `width` and `height` are the file's pixel size (they prevent layout jumps).
 */

export type Photo = { src: string; alt: string; caption: string; width: number; height: number };

export const photos = {
  storefront: {
    src: "/photos/storefront-sign.webp",
    alt: "The backlit Milk sign glowing yellow above the shop's wooden awning at night",
    caption: "The sign, after dark",
    width: 893,
    height: 505,
  },
  lounge: {
    src: "/photos/lounge.webp",
    alt: "An armchair and a woven stool beside the blue-framed patterned window",
    caption: "The corner by the window",
    width: 640,
    height: 782,
  },
  icedLatte: {
    src: "/photos/iced-latte.webp",
    alt: "An iced latte in a Milk cup on a wooden table, with daisies painted on the paving",
    caption: "Iced latte on the terrace",
    width: 645,
    height: 600,
  },
  terrace: {
    src: "/photos/terrace.webp",
    alt: "Yellow chairs around an outdoor table in dappled sunlight, daisies painted on the ground",
    caption: "Outside, on the daisies",
    width: 635,
    height: 500,
  },
  sando: {
    src: "/photos/sando.webp",
    alt: "A sando on seeded sourdough, cut in half and wrapped in Milk paper",
    caption: "A sando, cut in half",
    width: 645,
    height: 410,
  },
  interior: {
    src: "/photos/interior.webp",
    alt: "Inside Milk: oak tables, coloured mirrors on the wall and the coffee counter",
    caption: "Inside, by the counter",
    width: 765,
    height: 410,
  },
} satisfies Record<string, Photo>;

export const gallery: Photo[] = [
  photos.storefront,
  photos.icedLatte,
  photos.lounge,
  photos.sando,
  photos.terrace,
  photos.interior,
];

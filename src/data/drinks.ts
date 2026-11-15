/**
 * Drinks menu.
 *
 * IMPORTANT: every drink below is a PROPOSED item. None of them has been
 * confirmed by the owner yet, so the Coffee tab carries a short note saying
 * the list is being finalised, and shows no prices.
 *
 * To publish the real list:
 *   1. Remove the drinks Milk does not serve, add the ones it does.
 *   2. Fill in `price` (a number, in US dollars) for each drink.
 *   3. Set `drinksConfirmed` to true: the note disappears.
 */

export const drinksConfirmed = false;

/** Colour of the drink in its little cup illustration. */
export type Tone =
  | "espresso" | "americano" | "latte" | "cappuccino" | "mocha" | "caramel" | "vanilla"
  | "coldbrew" | "chocolate" | "matcha" | "tea" | "juice" | "cream";

export type Drink = {
  name: string;
  /** Price in US dollars, or null while it is not confirmed (nothing is shown). */
  price: number | null;
  description?: string;
  tone: Tone;
  /** Served over ice: drawn in the clear cup. */
  iced?: boolean;
  /** Optional real photo; replaces the illustration (same 4:3 frame). */
  image?: string;
};
export type DrinkGroup = { id: string; name: string; items: Drink[] };

export const drinksMenu: DrinkGroup[] = [
  {
    id: "espresso",
    name: "Espresso-based coffee",
    items: [
      { name: "Espresso", price: null, tone: "espresso" },
      { name: "Double espresso", price: null, tone: "espresso" },
      { name: "Americano", price: null, tone: "americano" },
      { name: "Cappuccino", price: null, tone: "cappuccino" },
      { name: "Café latte", price: null, tone: "latte" },
      { name: "Flat white", price: null, tone: "latte" },
      { name: "Cortado", price: null, tone: "mocha" },
      { name: "Macchiato", price: null, tone: "cappuccino" },
      { name: "Mocha", price: null, tone: "mocha" },
    ],
  },
  {
    id: "signature",
    name: "Signature and iced coffee",
    items: [
      { name: "Spanish latte", price: null, tone: "vanilla" },
      { name: "Iced Spanish latte", price: null, tone: "vanilla", iced: true },
      { name: "Iced latte", price: null, tone: "latte", iced: true },
      { name: "Iced americano", price: null, tone: "americano", iced: true },
      { name: "Iced mocha", price: null, tone: "mocha", iced: true },
      { name: "Caramel latte", price: null, tone: "caramel" },
      { name: "Vanilla latte", price: null, tone: "vanilla" },
      { name: "Cold brew", price: null, tone: "coldbrew", iced: true },
      { name: "Affogato", price: null, tone: "cream" },
    ],
  },
  {
    id: "other",
    name: "Other drinks",
    items: [
      { name: "Hot chocolate", price: null, tone: "chocolate" },
      { name: "Matcha latte", price: null, tone: "matcha" },
      { name: "Iced matcha latte", price: null, tone: "matcha", iced: true },
      { name: "Tea", price: null, tone: "tea" },
      { name: "Fresh juices", price: null, tone: "juice", iced: true },
    ],
  },
];

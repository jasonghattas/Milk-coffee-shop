/**
 * Food menu, copied word for word from the printed Milk menu.
 * To change it: edit, add or remove entries below. Prices are in US dollars.
 */

export type MenuItem = {
  name: string;
  price: number;
  description?: string;
  /** Short label shown on the card: the bread for sandos, the dressing for salads. */
  tag?: string;
  /**
   * Optional small label beside the name. Use it sparingly and only when it is
   * true: "signature" for a house creation, "bestseller" for a proven favourite.
   */
  label?: "signature" | "bestseller";
  /**
   * Optional photo of the dish, e.g. "/photos/menu/caprese.webp" (put the file
   * in /public/photos/menu). Cards crop every photo to the same 4:3 frame.
   */
  image?: string;
};
export type MenuCategory = {
  id: string;
  /** Label on the menu tab. */
  name: string;
  /** One line shown beside the list. */
  intro: string;
  items: MenuItem[];
};

export const currency = "$";

export const foodMenu: MenuCategory[] = [
  {
    id: "food",
    name: "Food",
    intro: "Sandos on ciabatta or sourdough, built to order and wrapped in our paper.",
    items: [
      {
        name: "Grilled halloumi",
        tag: "ciabatta",
        price: 9,
        description: "in ciabatta bread with tomato jam, arugula, walnuts and pesto sauce",
      },
      {
        name: "Shredded chicken",
        tag: "sourdough",
        price: 10,
        description:
          "in sourdough bread with avocado, arugula, walnuts, dill pickles and a homemade chicken mix",
      },
      {
        name: "Caprese",
        tag: "ciabatta",
        price: 8,
        description:
          "in ciabatta bread with cherry tomato confit, mozzarella, arugula, and pesto sauce with basil cream sauce",
      },
      {
        name: "Grilled chicken avocado",
        tag: "sourdough",
        price: 10,
        description:
          "in sourdough bread with iceberg lettuce, sweet corn, avocados, roasted peppers and soy sauce",
      },
      {
        name: "Trio",
        tag: "ciabatta",
        price: 9,
        description:
          "in ciabatta bread with mortadella, salami, pepperoni, tomato, basil, fresh mozzarella, pesto and sweet mayo",
      },
      {
        name: "Turkey",
        tag: "ciabatta",
        price: 9,
        description:
          "in ciabatta bread with roasted bell peppers, red onion, garlic mayonnaise, pesto sauce, arugula, and parmesan cheese chips",
      },
      {
        name: "Brossoli",
        tag: "sourdough",
        price: 12,
        description:
          "in sourdough with arugula, bresaola, parmesan cheese, fresh mozzarella, walnuts and a yuzu olive oil sauce",
      },
      {
        name: "Tuna",
        tag: "sourdough",
        price: 9,
        description:
          "in sourdough with avocado, celery, sweet corn, red onion, wasabi, apple cider vinegar and dijon mustard",
      },
      {
        name: "Smoked salmon",
        tag: "sourdough",
        price: 14,
        description: "in sourdough with cream cheese, cucumber, red onions, capers, dill and chives",
      },
    ],
  },
  {
    id: "salades",
    name: "Salades",
    intro: "Big bowls, each with its own dressing.",
    items: [
      {
        name: "Caesar",
        tag: "caesar dressing",
        price: 10,
        description:
          "with romaine lettuce, croutons, grilled chicken breast, and parmesan cheese, served with homemade caesar dressing",
      },
      {
        name: "Mediterranean pasta",
        tag: "greek dressing",
        price: 10,
        description:
          "with pasta, avocado, pine nuts, feta cheese, sun-dried tomatoes, red onion, cucumber and basil, served in greek dressing",
      },
      {
        name: "Kale quinoa",
        tag: "balsamic vinaigrette",
        price: 10,
        description:
          "with a mix of red and white quinoa, kale, strawberries, dried cranberries, goat cheese, sunflower seeds, and almonds, served with homemade balsamic vinaigrette",
      },
      {
        name: "Milk's",
        // The salad that carries the shop's own name.
        label: "signature",
        tag: "gomma dressing",
        price: 10,
        description:
          "with mixed lettuce, rocket leaves, goat cheese, green apple, dried figs, walnuts, chia seeds, and sunflower seeds, served with gomma dressing and croutons",
      },
      {
        name: "Avocado halloumi",
        tag: "lemon vinaigrette",
        price: 12,
        description:
          "with mixed lettuce, avocado, walnuts, sunflower seeds, chia seeds, and grilled halloumi cheese, served with lemon vinaigrette dressing",
      },
      {
        name: "Salmon mango",
        tag: "lemon vinaigrette",
        price: 16,
        description:
          "with mixed lettuce, rocket leaves, smoked salmon, mango, capers, red onion, and chia seeds, served with lemon vinaigrette dressing",
      },
      {
        name: "Roasted beetroot",
        tag: "balsamic vinaigrette",
        price: 11,
        description:
          "with mixed lettuce, roasted beetroot, arugula, feta cheese, walnuts and sunflower seeds, served with balsamic vinaigrette dressing",
      },
    ],
  },
];

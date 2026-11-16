import { DrinkGlyph } from "./DrinkGlyph";

/**
 * The seam between the dark opening and the page: Milk wordmarks and little
 * Milk cups, one after the other, drifting slowly sideways.
 */
export function PaperBand() {
  const run = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div className="paper-band overflow-hidden border-b border-ink/10 bg-milk py-2 text-ink md:py-2.5" aria-hidden>
      <div className="paper-band-track flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((i) =>
              i % 2 ? (
                <DrinkGlyph key={i} tone={i % 4 === 1 ? "espresso" : "latte"} iced={i % 4 === 3} className="mx-5 h-[60px] w-auto md:mx-8 md:h-[76px]" />
              ) : (
                <span key={i} className="wordmark mx-6 w-[84px] md:mx-9 md:w-[104px]" />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

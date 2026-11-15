import { Star } from "lucide-react";
import { Reveal } from "./Reveal";
import { rating } from "@/data/site";

/**
 * The Google rating, in the yellow of the shop sign.
 * Only the overall score and review count are shown; no individual reviews are quoted.
 */
export function Reviews() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="overflow-hidden bg-sign py-20 text-ink md:py-28">
      <div className="shell grid items-end gap-8 md:grid-cols-12 md:gap-10">
        <Reveal className="md:col-span-7">
          <h2 id="reviews-title" className="sr-only">
            Rated {rating.score} out of {rating.outOf} on Google
          </h2>
          <p
            aria-hidden
            className="font-display text-[clamp(8rem,26vw,18rem)] leading-[0.78] tracking-[-0.045em]"
            style={{ fontVariationSettings: '"SOFT" 100, "WONK" 0' }}
          >
            {rating.score.toFixed(1)}
          </p>
        </Reveal>
        <Reveal delay={0.12} className="md:col-span-5 md:pb-4">
          <div className="flex gap-1" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} size={22} className="fill-ink" strokeWidth={0} />
            ))}
          </div>
          <p className="mt-5 max-w-[22rem] font-display text-3xl lowercase leading-tight md:text-4xl">
            out of {rating.outOf} on Google, from {rating.count} reviews
          </p>
          <a href={rating.listingUrl} target="_blank" rel="noreferrer" className="btn btn-ink mt-8">
            See Milk on Google
          </a>
        </Reveal>
      </div>
    </section>
  );
}

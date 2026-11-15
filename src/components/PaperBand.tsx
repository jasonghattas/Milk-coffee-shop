/**
 * The seam between the dark opening and the page: a strip of Milk's wrapping
 * paper, wordmarks printed right way up and upside down, drifting slowly.
 */
export function PaperBand() {
  const run = Array.from({ length: 10 }, (_, i) => i);
  return (
    <div className="paper-band overflow-hidden border-b border-ink/10 bg-milk py-5 text-ink md:py-6" aria-hidden>
      <div className="paper-band-track flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {run.map((i) => (
              <span
                key={i}
                className={`wordmark mx-6 w-[84px] md:mx-9 md:w-[104px] ${i % 2 ? "rotate-180 opacity-70" : ""}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

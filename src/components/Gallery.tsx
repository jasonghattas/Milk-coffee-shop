import { Photo } from "./Photo";
import { Reveal } from "./Reveal";
import { gallery } from "@/data/gallery";

// Layout of the six tiles on wide screens: an uneven grid rather than a strip of equal boxes.
const spans = [
  "md:col-span-7 md:row-span-2",
  "md:col-span-5 md:row-span-3",
  "md:col-span-3 md:row-span-3",
  "md:col-span-4 md:row-span-2",
  "md:col-span-5 md:row-span-2",
  "md:col-span-4 md:row-span-1",
];

export function Gallery() {
  return (
    <section id="gallery" className="bg-milk py-24 md:py-32">
      <div className="shell">
        <Reveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2.4rem,5.4vw,4.25rem)] lowercase">A look around</h2>
          <p className="max-w-[24rem] text-ink/70">Coffee, sandos and the corners people settle into, photographed at Milk.</p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:auto-rows-[132px] md:grid-cols-12 md:gap-4">
          {gallery.map((photo, index) => (
            <li
              key={photo.src}
              className={`${index === 0 || index === gallery.length - 1 ? "col-span-2" : ""} ${spans[index % spans.length]}`}
            >
              <Reveal kind="unmask" delay={(index % 3) * 0.08} className="h-full">
                <figure className="group relative h-full">
                  <Photo
                    photo={photo}
                    className="aspect-[4/3] h-full md:aspect-auto"
                    imgClassName="transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover:scale-[1.05]"
                  />
                  <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 rounded-b-[var(--radius-media)] bg-gradient-to-t from-ink/75 to-transparent px-4 pb-3 pt-12 text-sm text-milk transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100">
                    {photo.caption}
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

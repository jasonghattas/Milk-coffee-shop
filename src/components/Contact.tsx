import { MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { hours, links, map, site } from "@/data/site";
import { groupHours } from "@/lib/hours";
import { Reveal } from "./Reveal";

export function Contact() {
  const rows = groupHours(hours);
  const anyPending = rows.some((row) => row.pending);

  return (
    <section id="contact" className="bg-ink py-24 text-milk md:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <h2 className="text-[clamp(2.4rem,5.4vw,4.25rem)] lowercase">Find us</h2>

          <address className="mt-9 space-y-5 text-lg not-italic">
            <p className="flex items-start gap-3">
              <MapPin size={20} className="mt-1 shrink-0 text-sign" aria-hidden />
              <span>
                {site.name}
                <br />
                <span className="text-milk/70">{site.address}</span>
              </span>
            </p>
            <p className="flex items-center gap-3">
              <Phone size={20} className="shrink-0 text-sign" aria-hidden />
              <a href={links.phone} className="underline-link">
                {site.phoneDisplay}
              </a>
            </p>
          </address>

          <div className="mt-9 flex flex-wrap gap-3">
            <a href={links.whatsapp} target="_blank" rel="noreferrer" className="btn btn-sign">
              <MessageCircle size={18} aria-hidden /> Message us on WhatsApp
            </a>
            <a href={map.directionsUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
              <Navigation size={18} aria-hidden /> Get directions
            </a>
          </div>

          <div className="mt-14">
            <h3 className="text-2xl lowercase">Opening hours</h3>
            <dl className="mt-5 border-t border-milk/15">
              {rows.map((row) => (
                <div key={row.days} className="flex items-baseline justify-between gap-6 border-b border-milk/15 py-3.5">
                  <dt>{row.days}</dt>
                  <dd className={`text-right tabular-nums ${row.pending ? "text-milk/50" : ""}`}>{row.time}</dd>
                </div>
              ))}
            </dl>
            {anyPending && (
              <p className="mt-4 text-sm text-milk/55">
                Not sure we are open? Call or message us before you set out.
              </p>
            )}
          </div>
        </Reveal>

        <Reveal kind="unmask" className="lg:col-span-7">
          <div className="h-[380px] overflow-hidden rounded-[var(--radius-media)] bg-milk/5 lg:h-full lg:min-h-[520px]">
            <iframe
              title="Map showing Milk Concept Store in Hlaliyeh, Saida"
              src={map.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0 grayscale-[35%] contrast-[1.05]"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

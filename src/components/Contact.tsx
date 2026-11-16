import { ArrowUpRight, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { hours, links, map, site } from "@/data/site";
import { groupHours } from "@/lib/hours";
import { Reveal } from "./Reveal";

/** Where Milk is and how to reach it. Details come from src/data/site.ts. */
export function Contact() {
  const rows = groupHours(hours);
  const anyPending = rows.some((row) => row.pending);

  const actions = [
    { icon: Phone, label: "Call us", value: site.phoneDisplay, href: links.phone, external: false },
    { icon: MessageCircle, label: "WhatsApp", value: "Send us a message", href: links.whatsapp, external: true },
    { icon: Navigation, label: "Directions", value: "Open in Google Maps", href: map.directionsUrl, external: true },
  ];

  return (
    <section id="contact" className="bg-ink py-24 text-milk md:py-32">
      <div className="shell">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="text-[clamp(2.4rem,5.4vw,4.25rem)] lowercase">Find us</h2>
          <address className="flex items-start gap-3 text-lg not-italic md:pb-2">
            <MapPin size={20} className="mt-1 shrink-0 text-sign" aria-hidden />
            <span>
              {site.name}
              <br />
              <span className="text-milk/65">{site.address}</span>
            </span>
          </address>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-10">
          <Reveal kind="unmask" className="lg:order-2 lg:col-span-7">
            <div className="relative h-[360px] overflow-hidden rounded-[var(--radius-media)] bg-milk/5 ring-1 ring-milk/10 lg:h-full lg:min-h-[540px]">
              <iframe
                title="Map showing Milk Concept Store in Hlaliyeh, Saida"
                src={map.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0 grayscale-[30%] contrast-[1.05]"
                allowFullScreen
              />
              <a
                href={map.directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sign absolute bottom-4 left-4 min-h-[44px] px-5 text-[0.95rem] shadow-[0_10px_30px_-10px_rgba(18,17,16,0.6)]"
              >
                <Navigation size={16} aria-hidden /> Get directions
              </a>
            </div>
          </Reveal>

          <Reveal className="lg:order-1 lg:col-span-5">
            <ul className="border-t border-milk/15">
              {actions.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label} className="border-b border-milk/15">
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="group flex items-center gap-4 py-5 transition-colors duration-300 hover:text-sign"
                  >
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-milk/20 transition-colors duration-300 group-hover:border-sign group-hover:bg-sign group-hover:text-ink">
                      <Icon size={18} aria-hidden />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm text-milk/55">{label}</span>
                      <span className="block font-display text-[1.45rem] leading-tight">{value}</span>
                    </span>
                    <ArrowUpRight
                      size={20}
                      aria-hidden
                      className="text-milk/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sign"
                    />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-12">
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
                <p className="mt-4 text-sm text-milk/55">Not sure we are open? Call or message us before you set out.</p>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

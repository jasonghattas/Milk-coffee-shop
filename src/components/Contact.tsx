"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ArrowUpRight, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { useExperience } from "./Experience";
import { SceneBoundary } from "./Hero";
import { hours, links, map, site } from "@/data/site";
import { groupHours, openStatus } from "@/lib/hours";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/motion";

const BeansCanvas = dynamic(() => import("./visit/BeansCanvas"), { ssr: false });

/** Buttons that lean toward the pointer before it even arrives. */
function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const move = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== "mouse" || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const x = event.clientX - (box.left + box.width / 2);
    const y = event.clientY - (box.top + box.height / 2);
    ref.current.style.transform = `translate(${x * 0.28}px, ${y * 0.38}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className="inline-block p-3 transition-transform duration-500 ease-[var(--ease-out-soft)]"
    >
      {children}
    </span>
  );
}

/** Where Milk is and how to reach it. Details come from src/data/site.ts. */
export function Contact() {
  const { mode } = useExperience();
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0, inside: false });
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [lowPower, setLowPower] = useState(false);
  const [still, setStill] = useState(false);
  const [failed, setFailed] = useState(false);
  const [status, setStatus] = useState<ReturnType<typeof openStatus> | null>(null);

  const rows = groupHours(hours);
  const anyPending = rows.some((row) => row.pending);

  // Live "open now" line, on Saida's clock; refreshed every minute.
  useEffect(() => {
    const update = () => setStatus(openStatus(hours));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  // Load the 3D scene shortly before it is needed; draw it only while it is on screen.
  useEffect(() => {
    setLowPower(window.matchMedia("(max-width: 767px)").matches || (navigator.hardwareConcurrency ?? 8) <= 4);
    setStill(reducedMotion());
    const node = stage.current;
    if (!node) return;
    const soon = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: "900px 0px" });
    const visible = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    soon.observe(node);
    visible.observe(node);
    return () => {
      soon.disconnect();
      visible.disconnect();
    };
  }, []);

  // Words arrive; the bean field reads how far the section has scrolled.
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stage.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          scroll.current = self.progress;
        },
      });
      if (reducedMotion()) return;
      gsap.from("[data-visit-line]", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.1,
        ease: "power4.out",
        scrollTrigger: { trigger: stage.current, start: "top 60%", once: true },
      });
      gsap.from("[data-visit-fade]", {
        opacity: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.1,
        delay: 0.35,
        ease: "power3.out",
        scrollTrigger: { trigger: stage.current, start: "top 60%", once: true },
      });
      gsap.from("[data-tile]", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-tiles]", start: "top 88%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const track = (event: PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((event.clientX - box.left) / box.width) * 2 - 1,
      y: -(((event.clientY - box.top) / box.height) * 2 - 1),
      inside: true,
    };
  };

  const actions = [
    { icon: Phone, label: "Call us", value: site.phoneDisplay, href: links.phone, external: false },
    { icon: MessageCircle, label: "WhatsApp", value: "Send us a message", href: links.whatsapp, external: true },
    { icon: Navigation, label: "Directions", value: "Open in Google Maps", href: map.directionsUrl, external: true },
  ];

  const with3D = near && mode !== "fallback" && mode !== "pending" && !failed;

  return (
    <section ref={root} id="contact" className="relative bg-ink text-milk">
      {/* The invitation, over a field of floating beans */}
      <div
        ref={stage}
        onPointerMove={track}
        onPointerLeave={() => {
          pointer.current = { ...pointer.current, inside: false };
        }}
        className="relative isolate flex min-h-[100svh] items-center overflow-hidden py-28"
      >
        <div aria-hidden className="absolute inset-0 -z-20">
          {with3D && (
            <SceneBoundary onError={() => setFailed(true)}>
              <BeansCanvas active={inView} lowPower={lowPower} still={still} scroll={scroll} pointer={pointer} />
            </SceneBoundary>
          )}
        </div>
        {/* soft dark pool in the middle so the words always read, and the sign's glow from below */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_45%_at_50%_50%,rgba(18,17,16,0.82),rgba(18,17,16,0.25)_70%,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(246,215,67,0.13),transparent_70%)]"
        />

        <div className="shell relative text-center">
          <p data-visit-fade className="inline-flex items-center gap-2.5 rounded-full border border-milk/15 bg-ink/60 px-4 py-2 text-sm text-milk/85">
            <span
              aria-hidden
              className={`relative grid h-2.5 w-2.5 place-items-center rounded-full ${
                status?.open === true ? "bg-[#7ee08a]" : status?.open === false ? "bg-[#f08a6c]" : "bg-sign"
              }`}
            >
              {status?.open === true && <span className="absolute inset-0 animate-ping rounded-full bg-[#7ee08a]/70" />}
            </span>
            <span aria-live="polite">{status?.label ?? "Hlaliyeh, Saida"}</span>
          </p>

          <h2 className="mt-8 text-[clamp(3.3rem,11.5vw,10.5rem)] lowercase leading-[0.88] tracking-[-0.045em]">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-visit-line className="block">come by</span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <span data-visit-line className="block">
                for a <span className="italic text-sign [font-variation-settings:'SOFT'_100,'WONK'_1]">coffee</span>.
              </span>
            </span>
          </h2>

          <p data-visit-fade className="mx-auto mt-6 max-w-[30rem] text-lg text-milk/70">
            <MapPin size={18} aria-hidden className="mr-2 inline-block -translate-y-[2px] text-sign" />
            {site.name}, {site.address}
          </p>

          <div data-visit-fade className="mt-8 flex flex-wrap items-center justify-center gap-1">
            <Magnetic>
              <a href={map.directionsUrl} target="_blank" rel="noreferrer" className="btn btn-sign min-h-[56px] px-7 text-[1.05rem]">
                <Navigation size={18} aria-hidden /> Get directions
              </a>
            </Magnetic>
            <Magnetic>
              <a href={links.whatsapp} target="_blank" rel="noreferrer" className="btn btn-ghost min-h-[56px] px-7 text-[1.05rem]">
                <MessageCircle size={18} aria-hidden /> WhatsApp us
              </a>
            </Magnetic>
          </div>
        </div>
      </div>

      {/* The practical part */}
      <div className="shell pb-24 md:pb-32">
        <ul data-tiles className="grid gap-3 sm:grid-cols-3 md:gap-4">
          {actions.map(({ icon: Icon, label, value, href, external }) => (
            <li key={label} data-tile>
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group relative isolate flex h-full min-h-[190px] flex-col justify-between overflow-hidden rounded-[20px] p-6 ring-1 ring-milk/12 transition-colors duration-500 hover:text-ink md:min-h-[230px] md:p-8"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-sign transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-y-100"
                />
                <span className="flex items-start justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-milk/20 transition-colors duration-500 group-hover:border-ink/25">
                    <Icon size={20} aria-hidden />
                  </span>
                  <ArrowUpRight
                    size={26}
                    aria-hidden
                    className="text-milk/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-ink"
                  />
                </span>
                <span>
                  <span className="block text-sm text-milk/55 transition-colors duration-500 group-hover:text-ink/60">{label}</span>
                  <span className="mt-1 block font-display text-[1.6rem] leading-tight md:text-[1.85rem]">{value}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid gap-10 md:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h3 className="text-[2.2rem] lowercase md:text-[2.6rem]">opening hours</h3>
            <dl className="mt-6 border-t border-milk/15">
              {rows.map((row) => {
                const isToday = status ? row.dayList.includes(status.day) : false;
                return (
                  <div key={row.days} className="flex items-baseline justify-between gap-6 border-b border-milk/15 py-4">
                    <dt className="flex items-center gap-2.5">
                      {row.days}
                      {isToday && (
                        <span className="rounded-full bg-sign px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.14em] text-ink">today</span>
                      )}
                    </dt>
                    <dd className={`text-right tabular-nums ${row.pending ? "text-milk/50" : ""}`}>{row.time}</dd>
                  </div>
                );
              })}
            </dl>
            {anyPending && (
              <p className="mt-4 text-sm text-milk/55">Not sure we are open? Call or message us before you set out.</p>
            )}
          </div>

          <div className="lg:col-span-7">
            <div className="relative h-[360px] overflow-hidden rounded-[20px] bg-milk/5 ring-1 ring-milk/10 lg:h-full lg:min-h-[420px]">
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
          </div>
        </div>
      </div>
    </section>
  );
}

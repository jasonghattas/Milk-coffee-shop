import { ExperienceProvider } from "@/components/Experience";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Menu } from "@/components/Menu";
import { Tapes } from "@/components/Tapes";
import { ScrollSetup } from "@/components/ScrollSetup";
import { MotionRoot } from "@/components/Reveal";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <ExperienceProvider>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-sign focus:px-4 focus:py-2 focus:text-ink"
      >
        Skip to content
      </a>
      <ScrollSetup />
      <LoadingScreen />
      <Navbar />
      <main>
        <Hero />
        <MotionRoot>
          <Tapes />
          <About />
          <Menu />
          <Gallery />
          <Contact />
        </MotionRoot>
      </main>
      <Footer />
    </ExperienceProvider>
  );
}

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Coffee, UtensilsCrossed, Sparkles } from "lucide-react";
import { Header } from "@/components/catalog/Header";
import { HeroLeft } from "@/components/catalog/HeroLeft";
import { OurStory } from "@/components/catalog/OurStory";
import { Timeline } from "@/components/catalog/Timeline";
import { RadialTimeline } from "@/components/catalog/RadialTimeline";
import { StoresCards } from "@/components/catalog/StoresCards";
import { Footer } from "@/components/catalog/Footer";
import { CateringPromo1 } from "@/components/catalog/CateringPromo1";
import { CateringPromo2 } from "@/components/catalog/CateringPromo2";
import { AboutUs } from "@/components/catalog/AboutUs";
import { Promotion } from "@/components/catalog/Promotion";
import { Promotion1 } from "@/components/catalog/Promotion1";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory selection:bg-terra selection:text-white">
      <Header activePage="home" heroIsDark revealDelay={1.8} />

      <main className="flex-1">
        <HeroLeft />
        <Promotion />
        <Promotion1 />
        {/* Layer 3 — rises from below and covers the pinned Promotion1 image.
            Negative margin (desktop/tablet) makes it overlap the sticky block
            while it is still pinned; solid bg + higher z actually cover it. */}
        <div className="relative z-10 bg-white md:-mt-[100vh]">
          <StoresCards />
        </div>
        <OurStory />
        <div className="block lg:hidden">
          <Timeline />
        </div>
        <div className="hidden lg:block">
          <RadialTimeline />
        </div>
        <CateringPromo1 />
        <CateringPromo2 />
    
      </main>

      <Footer />
    </div>
  );
}

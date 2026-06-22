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
import { CateringPromo } from "@/components/catalog/CateringPromo";
import { AboutUs } from "@/components/catalog/AboutUs";
import { Promotion } from "@/components/catalog/Promotion";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory selection:bg-terra selection:text-white">
      <Header activePage="home" heroIsDark />

      <main className="flex-1">
        <HeroLeft />
        <Promotion />
        <StoresCards />
        <OurStory />
        <div className="block lg:hidden">
          <Timeline />
        </div>
        <div className="hidden lg:block">
          <RadialTimeline />
        </div>
        <CateringPromo />
    
      </main>

      <Footer />
    </div>
  );
}

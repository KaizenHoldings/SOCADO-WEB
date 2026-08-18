import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Coffee, UtensilsCrossed, Sparkles } from "lucide-react";
import { Header } from "@/components/catalog/Header";
import { HeroLeft } from "@/components/catalog/HeroLeft";
import { MenuCategories } from "@/components/catalog/MenuCategories";
import { StoresCards } from "@/components/catalog/StoresCards";
import { Footer } from "@/components/catalog/Footer";
import { CateringPromo1 } from "@/components/catalog/CateringPromo1";
import { CateringPromo2 } from "@/components/catalog/CateringPromo2";
import { AboutUs } from "@/components/catalog/AboutUs";
// import { Promotion } from "@/components/catalog/Promotion"; // temporarily hidden
import { LoyaltyCard } from "@/components/catalog/LoyaltyCard";
import { SocadoClub } from "@/components/catalog/SocadoClub";
import { HomeMenuSectionsService } from "@/lib/services/home-menu-sections.service";

export default async function Home() {
  // Fetch menu categories from CMS; falls back to static data if empty or unavailable.
  const menuCategories = await HomeMenuSectionsService.getAll();

  return (
    <div className="flex min-h-screen flex-col bg-ivory selection:bg-terra selection:text-white">
      <Header activePage="home" heroIsDark revealDelay={1.8} />

      <main className="flex-1">
        <HeroLeft />
        {/* <Promotion /> — temporarily hidden, not deleted */}
        <LoyaltyCard />
        <SocadoClub />
        <MenuCategories categories={menuCategories} />
        <StoresCards />
        {/* <CateringPromo1 /> */}
        <CateringPromo2 />

      </main>

      <Footer />
    </div>
  );
}

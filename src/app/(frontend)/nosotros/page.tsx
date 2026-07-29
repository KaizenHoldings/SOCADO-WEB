import { Header } from "@/components/catalog/Header";
import { HeroNosotros } from "@/components/catalog/HeroNosotros";
import { OurStory } from "@/components/catalog/OurStory";
import { RadialTimeline } from "@/components/catalog/RadialTimeline";
import { Footer } from "@/components/catalog/Footer";

export default function Nosotros() {
  return (
    <div className="flex min-h-screen flex-col bg-ivory selection:bg-terra selection:text-white">
      <Header activePage="nosotros" heroIsDark={true} revealDelay={0} />

      <main className="flex-1">
        <HeroNosotros />
        <OurStory />
        <RadialTimeline />
      </main>

      <Footer />
    </div>
  );
}

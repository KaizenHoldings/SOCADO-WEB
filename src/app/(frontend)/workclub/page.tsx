import type { Metadata } from "next";
import { WorkclubPassesService } from "@/lib/services/workclub-passes.service";
import { Header } from "@/components/catalog/Header";
import { Footer } from "@/components/catalog/Footer";
import { Hero } from "./_components/Hero";
import { Descripcion } from "./_components/Descripcion";
import { PasoAPaso } from "./_components/PasoAPaso";
import { Paquetes } from "./_components/Paquetes";
import { Faq } from "./_components/Faq";
import { Reglas } from "./_components/Reglas";
import { Cierre } from "./_components/Cierre";

export const metadata: Metadata = {
  title: "workclub | socado café",
  description:
    "socado workclub: el espacio de cowork de socado café. puestos flexibles, escritorios fijos y salas de reuniones, con el mejor café al lado.",
};

/**
 * ISR: the packages section is read from Payload at build time and refreshed
 * every five minutes. An edit in the admin does not wait for that window —
 * the collections revalidate this route on every change.
 */
export const revalidate = 300;

export default async function WorkclubPage() {
  // Server side, so the section is already in the HTML; the component stays a
  // client one for the tabs and the animations.
  const { groups } = await WorkclubPassesService.get();

  return (
    <div className="flex min-h-screen flex-col bg-white selection:bg-wc-terracota selection:text-white">
      {/* The hero is dark, so the transparent header keeps its light variant. */}
      <Header activePage="workclub" heroIsDark revealDelay={0} />

      <main className="flex-1">
        <Hero />

        {/*
          Everything after the hero is one stack of sheets that scrolls over it.
          The wrapper owns the stacking level: the hero stays pinned at z-0
          underneath, and these sections keep their natural paint order above it.

          Every section here must carry an OPAQUE background. The hero is never
          unmounted, only covered, so a translucent background (`bg-…/25`) shows
          the pinned photograph and its copy straight through the section.
        */}
        <div className="relative z-10">
          <Descripcion />
          <PasoAPaso />
          <Paquetes groups={groups} />
          <Faq />
          <Reglas />
          <Cierre />
        </div>
      </main>

      {/*
        El footer del sitio, sin tema propio: junto al navbar es la única
        excepción a "solo paleta workclub" dentro de esta ruta.
      */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo de Catering — Socado Café",
  description:
    "Explora nuestro catálogo de catering artesanal: grab-and-go, panadería de autor y desayunos premium para eventos corporativos.",
};

export default function CateringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

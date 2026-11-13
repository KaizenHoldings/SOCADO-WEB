import type { Metadata } from "next";
import { Header } from "@/components/catalog/Header";
import { FormularioCatering } from "./_components/FormularioCatering";

/**
 * Solicitud de catering.
 *
 * El formulario sigue siendo el de JotForm, pero deja de sacar al visitante
 * del sitio: ocupa la página completa bajo el navbar de Socado, sin marco, sin
 * tarjeta y sin títulos propios, de modo que no se lea como un recuadro
 * incrustado sino como la página misma.
 *
 * Sin footer a propósito: obligaría a hacer scroll de página además del del
 * formulario, y dos barras de scroll son justo lo que delata un embebido.
 *
 * Ruta aparte a propósito. `/catering` mantiene su redirección al formulario
 * externo (ver `next.config.ts`) y la vista original del catálogo sigue
 * intacta detrás de ella; esta página no toca ni una ni otra.
 */

export const metadata: Metadata = {
  title: "Solicita tu catering | Socado Café",
  description:
    "Cuéntanos qué necesitas para tu reunión, celebración o evento corporativo y te preparamos una propuesta de catering Socado.",
};

/**
 * Alto del navbar en reposo (padding 2×28px + logo de 48px).
 *
 * Aquí no se usa el token `--header-h`, que vale 80px: ese es el alto del
 * navbar compacto, y en esta página la ventana nunca hace scroll, así que el
 * navbar se queda siempre en su tamaño grande.
 */
const HEADER_H = "104px";

export default function SolicitudCateringPage() {
  return (
    /* Alto exacto de pantalla y sin scroll propio: el único que se mueve es el
       formulario. */
    <div className="flex h-dvh flex-col overflow-hidden bg-ivory">
      {/*
        Sin `activePage`: esa prop en "catering" saca el icono del carrito, que
        pertenece al catálogo oculto y aquí no tendría su drawer montado. El
        enlace del navbar se marca igual, porque el header resalta "catering"
        cuando ve en pantalla una sección con ese id.
      */}
      <Header revealDelay={0} />

      {/* Un div, no un <main>: el layout de (frontend) ya envuelve la página
          en uno, y anidar dos landmarks sería HTML inválido. */}
      <div
        id="catering"
        className="flex-1 overflow-hidden"
        style={{ paddingTop: HEADER_H }}
      >
        <FormularioCatering />
      </div>
    </div>
  );
}

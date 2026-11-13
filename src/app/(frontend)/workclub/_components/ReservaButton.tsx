import { ArrowUpRight } from "lucide-react";
import { RESERVA_URL, isExternalUrl } from "../data";

/**
 * The landing's booking CTA.
 *
 * Every "reserva ahora" on the page points at the same destination, so the link
 * target, the new-tab decision and the focus ring live here instead of being
 * repeated in each section.
 */

/**
 * Appends the package id the booking system can preselect.
 *
 * Only applied to a real external URL: while `RESERVA_URL` is still the `#`
 * placeholder, a query string would produce a nonsense href.
 */
function withPaquete(url: string, paquete?: string): string {
  if (!paquete || !isExternalUrl(url)) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}paquete=${encodeURIComponent(paquete)}`;
}

interface ReservaButtonProps {
  children: React.ReactNode;
  /** Defaults to the booking system; pass another destination to override. */
  href?: string;
  /** Package id forwarded to the booking system as `?paquete=…`. */
  paquete?: string;
  /**
   * `solid` — wc-verde fill, for the main CTA on a light surface.
   * `onDark` — white fill with wc-verde text, for use over a photograph.
   * `outline` — outlined in wc-verde, secondary CTA on a light surface.
   * `outlineSoft` — outlined in terracotta, for the pass cards.
   */
  variant?: "solid" | "onDark" | "outline" | "outlineSoft";
  /** Stretches the button to the full width of its container. */
  block?: boolean;
  className?: string;
  /** Hides the trailing arrow when the label already carries one. */
  hideArrow?: boolean;
}

export function ReservaButton({
  children,
  href = RESERVA_URL,
  paquete,
  variant = "solid",
  block = false,
  className,
  hideArrow = false,
}: ReservaButtonProps) {
  const destination = withPaquete(href, paquete);
  const external = isExternalUrl(destination);

  const variantClasses = {
    solid:
      "bg-wc-verde text-white hover:bg-wc-verde-medio focus-visible:outline-wc-verde",
    onDark:
      "bg-white text-wc-verde hover:bg-wc-verde-claro focus-visible:outline-white",
    outline:
      "border border-wc-verde text-wc-verde hover:bg-wc-verde hover:text-white focus-visible:outline-wc-verde",
    outlineSoft:
      "border border-wc-terracota-claro text-wc-verde hover:bg-wc-verde hover:text-white focus-visible:outline-wc-verde",
  }[variant];

  return (
    <a
      href={destination}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 font-raleway text-[15px] font-light lowercase transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 ${variantClasses} ${
        block ? "w-full" : ""
      } ${className ?? ""}`}
    >
      {children}
      {!hideArrow && (
        <ArrowUpRight
          className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      )}
    </a>
  );
}

export default ReservaButton;

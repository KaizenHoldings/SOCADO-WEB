/**
 * Socado Workclub — editable content for the /workclub landing.
 *
 * Every string, price and image shown on the landing lives here so the page can
 * be updated without touching components. Items still waiting for real data are
 * marked with `TODO`.
 */
import type { MediaConfig } from "@/components/media/ImageOrVideo";


/* ------------------------------------------------------------------ *
 * External destinations
 * ------------------------------------------------------------------ */

/**
 * Booking system and visit link.
 *
 * Both literals live in `src/lib/constants/links.ts`, alongside the catering
 * form, because the site header also needs the booking URL for its CTA inside
 * /workclub and must not import from a route folder. Change the URL there; the
 * landing reads it through these re-exports.
 */
export {
  WORKCLUB_RESERVA_URL as RESERVA_URL,
  WORKCLUB_VISITA_URL as VISITA_URL,
  isExternalUrl,
} from "@/lib/constants/links";

/* ------------------------------------------------------------------ *
 * Hero media
 * ------------------------------------------------------------------ */

/**
 * Shape of the hero medium.
 *
 * Defined by `ImageOrVideo`, the component that renders it here and in the
 * promo block of the home page; the name stays so this file reads as before.
 */
export type HeroMedia = MediaConfig;

/**
 * Current hero medium: the workclub video, with the render as its poster.
 *
 * Swapping the medium is an edit of this object only — `Hero.tsx` handles both
 * shapes, and falls back to the poster under reduced motion or data saver.
 *
 * The file weighs ~14 MB, above the ~8 MB budget for a hero. To compress it:
 *   ffmpeg -i in.mp4 -vf scale=1920:-2 -c:v libx264 -crf 26 -preset slow -an  *     -movflags +faststart out.mp4
 * TODO: compress and, if possible, add a .webm sibling (listed first as a
 * <source> by Hero.tsx when `webmSrc` is set).
 */
export const heroMedia: HeroMedia = {
  type: "video",
  src: "/videos/workclub/hero-workclub.mp4",
  poster: "/images/cowork/workclub-hero.webp",
  alt: "espacio de socado workclub",
};

export const hero = {
  eyebrow: "",
  title: "workclub",
  tagline: "trabaja donde todo conecta.",
  primaryCta: "reserva ahora",
  secondaryCta: "conoce los paquetes",
} as const;

/* ------------------------------------------------------------------ *
 * Description
 * ------------------------------------------------------------------ */

/**
 * Caption phrase. `highlight` is rendered in the workclub accent, so it must be
 * a literal fragment of `text`.
 */
export const caption = {
  text: "tu próximo lugar de trabajo también es socado.",
  highlight: "socado",
} as const;

export const descriptionParagraphs: string[] = [
  "socado workclub existe para elevar tu día a día de trabajo, con un entorno y un equipo que te inspiran a crecer, conectar y avanzar con foco, efectividad y tranquilidad.",
];

/**
 * Fragments of `descriptionParagraphs` set in semibold: the promise and what it
 * delivers, lifted out of the sentence that carries them.
 *
 * Each has to be a literal fragment of one of the paragraphs, the same contract
 * as `caption.highlight` — the copy stays one authored sentence, with no markup
 * in it, and a fragment that stops matching is simply not emphasised.
 */
export const descriptionEmphasis: string[] = [
  "elevar tu día a día de trabajo",
  "foco, efectividad y tranquilidad",
];

/** Heading of the list that follows the description. */
export const somosTitle = "somos";

export const somosItems: string[] = [
  "un espacio donde cada detalle está cuidado para que el trabajo fluya",
  "sillas donde se puede pensar",
  "salas donde cada reunión se siente importante",
  "conexión a la altura",
  "un equipo atento a lo que haga falta",
];

/** Quick figures under the description. TODO: confirm real numbers. */
export const quickFacts: { value: string; label: string }[] = [
  { value: "40", label: "puestos de trabajo" },
  { value: "3", label: "salas de reuniones" },
  { value: "13 h", label: "abierto al día" },
];

/* ------------------------------------------------------------------ *
 * How to book
 * ------------------------------------------------------------------ */

export interface Step {
  /** Two-digit index, rendered in Outfit. */
  index: string;
  title: string;
  description: string;
}

export const steps: Step[] = [
  {
    index: "01",
    title: "elige",
    description: "en la web el espacio o servicio, con disponibilidad real.",
  },
  {
    index: "02",
    title: "aparta",
    description: "tu selección queda reservada por 15 minutos.",
  },
  {
    index: "03",
    title: "paga",
    description:
      "paga por pago móvil, transferencia, zelle o venmo y sube el comprobante.",
  },
  {
    index: "04",
    title: "confirma",
    description: "validamos tu pago y confirmamos la reserva.",
  },
  {
    index: "05",
    title: "entra",
    description: "usa tu acceso habilitado o solicita apoyo al host.",
  },
];

/* ------------------------------------------------------------------ *
 * Passes
 * ------------------------------------------------------------------ *
 *
 * Los tipos de pass, los planes, los precios y las features ya no viven aquí:
 * se administran en Payload (colecciones `pass-types` y `plans`, y el global
 * `workclub-settings`) y los lee `src/lib/services/workclub-passes.service.ts`,
 * que también guarda el contenido de respaldo por si el CMS no responde.
 *
 * Los registros por defecto se crean solos con `src/seed/workclub.ts`.
 */

/* ------------------------------------------------------------------ *
 * FAQ
 * ------------------------------------------------------------------ */

export interface FaqItem {
  question: string;
  answer: string;
}

/** TODO: respuestas definitivas, validadas por operaciones. */
export const faq: FaqItem[] = [
  {
    question: "¿necesito reservar con anticipación?",
    answer:
      "para el área abierta puedes llegar y ocupar un puesto libre, pero reservar asegura tu lugar. las salas de reuniones y las oficinas siempre requieren reserva previa.",
  },
  {
    question: "¿qué incluye cada paquete?",
    answer:
      "todos incluyen internet de alta velocidad, acceso a zonas comunes y café de la casa. el detalle de cada uno está en su tarjeta, al abrirla.",
  },
  {
    question: "¿cuál es el horario del workclub?",
    answer:
      "de lunes a viernes de 8:00 a 18:00, y los sábados de 8:00 a 20:00 para los paquetes con acceso extendido.",
  },
  {
    question: "¿puedo ir a conocer el espacio antes de reservar?",
    answer:
      "sí. agenda una visita y te mostramos las áreas, las salas y cómo funciona el día a día, sin compromiso.",
  },
  {
    question: "¿el café está incluido?",
    answer:
      "el café de la casa está incluido en todos los paquetes. el resto de la carta de socado tiene precio preferencial para miembros.",
  },
  {
    question: "¿puedo invitar a alguien a una reunión?",
    answer:
      "sí. tus invitados se registran en recepción y te acompañan en la sala que hayas reservado.",
  },
  {
    question: "¿cómo cancelo o cambio mi reserva?",
    answer:
      "desde el correo de confirmación puedes cambiar o cancelar tu reserva hasta 24 h antes sin costo.",
  },
  {
    question: "¿qué métodos de pago aceptan?",
    answer:
      "aceptamos los mismos medios de pago disponibles en nuestras tiendas. consulta en recepción las opciones vigentes.",
  },
];

/* ------------------------------------------------------------------ *
 * House rules
 * ------------------------------------------------------------------ */

export interface Regla {
  index: string;
  title: string;
  description: string;
}

/** TODO: confirmar la política de mascotas y visitas con operaciones. */
export const reglas: Regla[] = [
  {
    index: "01",
    title: "respeta el silencio",
    description:
      "zonas tranquilas para concentrarte; las llamadas, en phone booth o sala.",
  },
  {
    index: "02",
    title: "usa audífonos",
    description: "para música, videos y videollamadas.",
  },
  {
    index: "03",
    title: "cuida tu puesto",
    description: "déjalo limpio y ordenado al terminar.",
  },
  {
    index: "04",
    title: "reserva las salas",
    description: "y libéralas a tiempo para el siguiente.",
  },
  {
    index: "05",
    title: "comparte el espacio",
    description: "no reserves puestos con objetos si no estás.",
  },
  {
    index: "06",
    title: "cuida a la comunidad",
    description: "trato amable con todos.",
  },
  {
    index: "07",
    title: "mascotas y visitas",
    description: "según la política del espacio; consulta en recepción.",
  },
  {
    index: "08",
    title: "disfruta el café",
    description: "con moderación y llevando la taza a la barra.",
  },
];

/* ------------------------------------------------------------------ *
 * Closing block
 * ------------------------------------------------------------------ */

export const cierre = {
  title: "¿listo para trabajar?",
  description:
    "reserva tu lugar en socado workclub",
  cta: "reserva ahora",
} as const;

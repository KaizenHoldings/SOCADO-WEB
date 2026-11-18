/**
 * Enlaces externos del sitio.
 */

/**
 * Formulario de catering en JotForm.
 *
 * Sustituye temporalmente al catálogo de catering como destino de todos los
 * enlaces. La vista original sigue intacta en `src/app/(frontend)/catering`;
 * solo se le corta el acceso mediante la redirección de `next.config.ts`.
 *
 * Si cambia la URL del formulario, se cambia aquí y en esa redirección (el
 * config no importa de `src` para no acoplarse al build de la app).
 */
export const CATERING_FORM_URL = "https://form.jotform.com/260974966814069";

/**
 * Página del sitio que muestra ese mismo formulario embebido.
 *
 * Es el destino de los enlaces "catering" del navbar, el footer y la promo de
 * la portada: el visitante rellena el formulario sin salir de Socado. La URL
 * de arriba sigue siendo la fuente del embed y la salida de emergencia si el
 * iframe no carga.
 *
 * `/catering` no se toca: conserva su redirección al formulario externo.
 */
export const CATERING_SOLICITUD_PATH = "/catering/solicitud";

/**
 * Sistema de reservas de Socado Workclub.
 *
 * Vive aquí, y no sólo en `src/app/(frontend)/workclub/data.ts`, porque el
 * header lo necesita para su CTA dentro de `/workclub` y no debe depender de
 * una carpeta de ruta. `data.ts` lo reexporta como `RESERVA_URL`.
 *
 */
export const WORKCLUB_RESERVA_URL = "https://workclub.socadocafe.com/";

/**
 * Si el sistema de coworking sabe preseleccionar un paquete con `?paquete=<slug>`.
 *
 * En `false` todos los botones llevan a la portada del sistema, limpia. El
 * código para añadir el parámetro sigue en `ReservaButton`, listo: poner esto
 * en `true` lo activa de golpe en toda la landing, y el slug que viaja es el
 * del plan (`day-pass`, `spot-member`, …).
 *
 * Está apagado porque nadie ha confirmado que esa web lea el parámetro, y uno
 * que no reconoce puede acabar en un 404. Confírmalo antes de encenderlo.
 */
export const WORKCLUB_RESERVA_ACCEPTS_PAQUETE = false;

/**
 * Agendar una visita al espacio antes de reservar.
 *
 * TODO: reemplazar por el enlace real (WhatsApp o el sistema de reservas con
 * el parámetro de visita).
 */
export const WORKCLUB_VISITA_URL = "#";

/**
 * Indica si un destino debe abrirse en una pestaña nueva. Evita que los
 * componentes asuman a dónde apuntan estas constantes mientras son
 * provisionales.
 */
export function isExternalUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

import { CATERING_FORM_URL } from "@/lib/constants/links";

/**
 * Formulario de catering de JotForm, ocupando la página entera.
 *
 * El iframe mide exactamente lo que queda de pantalla bajo el navbar, así que
 * el único scroll que ve el visitante es el del formulario y no se nota el
 * borde del embebido. Por eso tampoco hace falta el script de JotForm que
 * ajusta el alto: sin él no hay dependencia de su CDN, ni un salto de tamaño
 * al cargar, ni riesgo de que el formulario quede recortado si falla.
 *
 * El contenedor con scroll propio es por iOS, donde un iframe tiende a
 * estirarse hasta el alto de su contenido en lugar de desplazarse por dentro;
 * cuando eso pasa, el que se desplaza es este div.
 */
export function FormularioCatering() {
  return (
    <div className="h-full w-full overflow-auto [-webkit-overflow-scrolling:touch]">
      <iframe
        title="Formulario de catering de Socado Café"
        src={CATERING_FORM_URL}
        allow="geolocation; microphone; camera; fullscreen; payment"
        className="block h-full min-h-full w-full border-0"
      />
    </div>
  );
}

export default FormularioCatering;

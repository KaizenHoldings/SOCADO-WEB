import React from "react";

export function Footer() {
  return (
    <footer id="contacto" className="bg-azul-socado py-10 text-center text-ivory">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
        <div className="mb-4 h-12 w-12 rounded-full border-2 border-terra flex items-center justify-center">
          <span className="font-raleway font-bold text-xl text-terra">S</span>
        </div>
        <p className="font-raleway text-lg font-semibold">Socado Café</p>
        <p className="mt-2 text-sm text-verde-century">Social. Coffee. Connection.</p>
        <div className="mt-6 text-xs text-gris-metropolis">
          &copy; {new Date().getFullYear()} Socado Café. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

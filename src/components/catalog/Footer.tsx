import React from "react";
import Image from "next/image";

export function Footer() {
  return (
    <footer id="contacto" className="bg-white dark:bg-[#042430] border-t border-black/5 dark:border-white/5 py-16 text-center text-[#063547] dark:text-[#f2eae6]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col items-center">
        <div className="mb-6">
          <Image
            src="/icons/logo_oscuro.svg"
            alt="Socado Café Logo"
            width={150}
            height={100}
            className="w-auto h-16 dark:hidden"
          />
          <Image
            src="/icons/logo_white.svg"
            alt="Socado Café Logo"
            width={150}
            height={100}
            className="w-auto h-16 hidden dark:block"
          />
        </div>
        <p className="mt-2 text-sm text-[#5c8ea0] dark:text-[#b2b5a9] font-medium tracking-wide uppercase">Social. Coffee. Connection.</p>
        <div className="mt-8 text-xs text-[#6e7c7c] tracking-wider">
          &copy; {new Date().getFullYear()} Socado Café. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}

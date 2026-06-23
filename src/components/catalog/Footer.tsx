import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Tiendas", href: "/#tiendas" },
  { label: "Nosotros", href: "/#nosotros" },
  { label: "Catering", href: "/catering" },
  { label: "Contacto", href: "/#contacto" },
];

const STORES = [
  { label: "Las Mercedes", href: "https://lasmercedes.socadocafe.com" },
  { label: "La Trinidad", href: "https://latrinidad.socadocafe.com" },
  { label: "El Rosal", href: "https://elrosal.socadocafe.com" },
];

export function Footer() {
  return (
    <footer id="contacto" className="bg-white border-t-4 border-[#063547]">
      {/* Cuerpo principal */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">

          {/* Col 1 — Marca */}
          <div className="lg:col-span-1 flex flex-col items-center gap-3">
            <Image
              src="/icons/logo_oscuro.svg"
              alt="Socado Café"
              width={120}
              height={80}
              className="w-auto h-12"
            />
            <p className="font-raleway text-xs uppercase tracking-[0.2em] text-[#063547]/50 text-center">
              Social. Café. Conectado.
            </p>
          </div>

          {/* Col 2 — Navegación */}
          <div className="flex flex-col gap-4">
            <h4 className="font-raleway font-bold text-xs uppercase tracking-[0.2em] text-[#063547]">
              Navegación
            </h4>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-outfit text-sm text-[#6e7c7c] hover:text-[#063547] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Tiendas */}
          <div className="flex flex-col gap-4">
            <h4 className="font-raleway font-bold text-xs uppercase tracking-[0.2em] text-[#063547]">
              Nuestras Tiendas
            </h4>
            <ul className="flex flex-col gap-3">
              {STORES.map((store) => (
                <li key={store.href}>
                  <a
                    href={store.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-outfit text-sm text-[#6e7c7c] hover:text-[#b45b38] transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    {store.label}
                    <svg
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-px"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contacto */}
          <div className="flex flex-col gap-4">
            <h4 className="font-raleway font-bold text-xs uppercase tracking-[0.2em] text-[#063547]">
              Contacto
            </h4>
            <div className="flex flex-col gap-3 font-outfit text-sm text-[#6e7c7c]">
              <a
                href="mailto:hola@socadocafe.com"
                className="hover:text-[#063547] transition-colors duration-200"
              >
                hola@socadocafe.com
              </a>
              <a
                href="https://instagram.com/socadocafe"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#063547] transition-colors duration-200"
              >
                @socadocafe
              </a>
            </div>

            {/* Catering CTA */}
            <div className="mt-4 pt-4 border-t border-black/5">
              <p className="font-outfit text-xs text-[#063547]/40 mb-3">
                ¿Tienes un evento?
              </p>
              <Link
                href="/catering"
                className="inline-block font-outfit text-xs font-bold uppercase tracking-widest text-white bg-[#063547] hover:bg-[#063547]/80 px-5 py-2.5 transition-colors duration-200"
              >
                Ver Catering
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-t border-[#063547]/10">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-outfit text-xs text-[#063547]/40">
            &copy; {new Date().getFullYear()} Socado Café. Todos los derechos reservados.
          </p>
          
        </div>
      </div>
    </footer>
  );
}

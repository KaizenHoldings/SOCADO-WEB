import Image from "next/image";
import Link from "next/link";
import { AtSign, Mail } from "lucide-react";

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
    <footer id="contacto" className="bg-azul-socado text-ivory">
      <div className="section-shell py-12 lg:py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-8">
          {/* Left — logo + social/contact */}
          <div className="flex flex-col items-start gap-6">
            <Link href="/" className="inline-block transition-opacity hover:opacity-80">
              <Image
                src="/icons/logo_white.svg"
                alt="Socado Café"
                width={150}
                height={100}
                className="h-12 w-auto"
              />
            </Link>
            <div className="flex flex-col gap-2.5 font-outfit text-sm text-ivory/70">
              <a
                href="mailto:hola@socadocafe.com"
                className="inline-flex items-center gap-2.5 transition-colors duration-200 hover:text-ivory"
              >
                <Mail className="h-4 w-4 shrink-0" />
                hola@socadocafe.com
              </a>
              <a
                href="https://instagram.com/socadocafe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 transition-colors duration-200 hover:text-ivory"
              >
                <AtSign className="h-4 w-4 shrink-0" />
                @socadocafe
              </a>
            </div>
          </div>

          {/* Right — navigation + stores */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12 md:ml-auto">
            <div className="flex flex-col gap-3">
              <h4 className="font-raleway text-[11px] font-bold uppercase tracking-[0.25em] text-ivory/50">
                Navegación
              </h4>
              <ul className="flex flex-col gap-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-raleway text-sm text-ivory/85 transition-colors duration-200 hover:text-celeste-socado"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-raleway text-[11px] font-bold uppercase tracking-[0.25em] text-ivory/50">
                Nuestras Tiendas
              </h4>
              <ul className="flex flex-col gap-2.5">
                {STORES.map((store) => (
                  <li key={store.href}>
                    <a
                      href={store.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-raleway text-sm text-ivory/85 transition-colors duration-200 hover:text-terra"
                    >
                      {store.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — micro legal row */}
      <div className="border-t border-ivory/10">
        <div className="section-shell py-5">
          <p className="font-outfit text-[11px] uppercase tracking-[0.2em] text-ivory/40">
            &copy; {new Date().getFullYear()} Socado Café. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

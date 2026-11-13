"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowUpRight, Menu, X } from "lucide-react";
import { motion } from "motion/react";
import { useCartStore } from "@/lib/store/cart.store";
import { EcommerceModal } from "@/components/catalog/EcommerceModal";
import { PideAhoraSticker } from "@/components/catalog/PideAhoraSticker";
import { useUIStore } from "@/lib/store/ui.store";
import {
  CATERING_SOLICITUD_PATH,
  WORKCLUB_RESERVA_URL,
  isExternalUrl,
} from "@/lib/constants/links";

interface HeaderProps {
  activePage?: "home" | "catering" | "nosotros" | "workclub";
  /** Si el fondo debajo del header transparente es oscuro, los textos se muestran en claro */
  heroIsDark?: boolean;
  /** Segundos de espera antes de revelar el navbar (para que aparezca tras la intro del hero) */
  revealDelay?: number;
}

export function Header({
  activePage = "home",
  heroIsDark = false,
  revealDelay = 0,
}: HeaderProps) {
  const { items, toggleDrawer } = useCartStore();
  const cartCount = items.length;
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>(
    activePage === "home" ? "inicio" : activePage
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [isEcommerceModalOpen, setIsEcommerceModalOpen] = useState(false);
  const prevCartCountRef = useRef(cartCount);

  useEffect(() => {
    if (cartCount > prevCartCountRef.current) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 300);
      prevCartCountRef.current = cartCount;
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);

      if (activePage === "home") {
        const sections = ["tiendas", "catering"];
        let current = "inicio";

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            // Usamos un offset de la mitad de la pantalla para que cambie cuando la sección llegue al medio
            if (rect.top <= window.innerHeight / 2) {
              current = section;
            }
          }
        }
        setActiveSection(current);
      }
    };

    onScroll(); // Initial check
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activePage]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Clases de fondo del header
  const bgClass = scrolled
    ? "bg-[#f2eae6]/95 backdrop-blur-md dark:bg-[#042430]/95 shadow-sm"
    : "bg-transparent";

  const isDarkText = scrolled || !heroIsDark;

  // Colores unificados
  const textColor = isDarkText
    ? "text-[#063547] dark:text-[#f2eae6]"
    : "text-white";

  const navLinkBase = "transition-opacity hover:opacity-60";
  const navLinkInactive = `${textColor} font-normal opacity-90`;
  const navLinkActive = `${textColor} font-semibold`;

  /** Mobile menu entries: one place for the shared link classes. */
  const mobileLinkClass = (section: string) =>
    `transition-colors hover:text-[#b45b38] ${
      activeSection === section ? "text-[#b45b38]" : ""
    }`;

  /** Booking system: opened in a new tab only when it is an external URL. */
  const reservaLinkProps = isExternalUrl(WORKCLUB_RESERVA_URL)
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  /**
   * Set by the catering view while its category bar is docked. The header
   * slides out of the way to hand that stack the top of the viewport.
   */
  const isCategoryNavDocked = useUIStore((state) => state.isCategoryNavDocked);

  /**
   * The entry reveal is a delayed spring; every later move is the quick
   * hide/show. Without this flag the header would sit out `revealDelay`
   * again each time it returned.
   */
  const [hasRevealed, setHasRevealed] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: "-100%", opacity: 0 }}
        animate={{ y: isCategoryNavDocked ? "-100%" : "0%", opacity: 1 }}
        onAnimationComplete={() => setHasRevealed(true)}
        transition={
          hasRevealed
            ? { duration: 0.3, ease: "easeInOut" }
            : {
                type: "spring",
                stiffness: 300,
                damping: 22,
                delay: revealDelay,
                opacity: { duration: 0.4, delay: revealDelay },
              }
        }
        className={`fixed top-0 left-0 z-50 w-full ${bgClass}`}
        style={{ transition: "background-color 500ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 500ms cubic-bezier(0.34, 1.56, 0.64, 1), backdrop-filter 500ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12 ${scrolled ? "py-[14px]" : "py-7"}`}
          style={{ transition: "padding 500ms cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        >
          {/* Izquierda: Logo y Navegación alineada */}
          <div className="flex items-center gap-10 lg:gap-14">
            {/* Logo */}
            <Link href="/" className="group flex items-center transition-opacity hover:opacity-80">
              <Image
                src={isDarkText ? "/icons/logo_oscuro.svg" : "/icons/logo_white.svg"}
                alt="Socado Café Logo"
                width={100}
                height={84}
                className="w-auto h-12"
                priority
              />
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex gap-6 lg:gap-8 text-[14px] tracking-wide">
              <a
                href="/#inicio"
                className={`${navLinkBase} ${activeSection === "inicio" ? navLinkActive : navLinkInactive}`}
              >
                inicio
              </a>
              <a href="/#tiendas" className={`${navLinkBase} ${activeSection === "tiendas" ? navLinkActive : navLinkInactive}`}>
                tiendas
              </a>
              
              {/*
                Mismo estilo que el resto de enlaces. Fuera de /workclub, cada
                2s la palabra se tambalea y un reflejo dorado la recorre; en la
                propia ruta queda quieta. Todo el efecto vive en styles.css.
              */}
              <Link
                href="/workclub"
                className={`${navLinkBase} ${activeSection === "workclub" ? navLinkActive : navLinkInactive}`}
              >
                <span
                  className={
                    activeSection === "workclub" ? undefined : "wc-nav-attention"
                  }
                >
                  workclub
                  {/* Copia sobre la que viaja el reflejo; el texto de arriba
                      se pinta como cualquier otro enlace. */}
                  {activeSection !== "workclub" && (
                    <span className="wc-nav-shine" aria-hidden="true">
                      workclub
                    </span>
                  )}
                </span>
              </Link>

              {/* El formulario vive embebido en el sitio, no en JotForm. */}
              <Link
                href={CATERING_SOLICITUD_PATH}
                className={`${navLinkBase} ${activeSection === "catering" ? navLinkActive : navLinkInactive}`}
              >
                catering
              </Link>

              <Link href="/nosotros" className={`${navLinkBase} ${activeSection === "nosotros" ? navLinkActive : navLinkInactive}`}>
                nosotros
              </Link>

            </nav>
          </div>

          {/* Derecha: Acciones */}
          <div className="flex items-center gap-6">
            {activePage === "catering" && (
              <button
                onClick={toggleDrawer}
                className={`relative p-2 transition-all duration-300 hover:opacity-60 ${textColor} ${isBouncing ? "scale-125 text-[#b45b38]" : "scale-100"}`}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#b45b38] text-[9px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
            )}
            {activePage === "home" && (
              <button
                onClick={() => setIsEcommerceModalOpen(true)}
                className={`group hidden md:flex items-center gap-1.5 text-[14px] font-semibold tracking-wide transition-opacity hover:opacity-60 ${textColor}`}
              >
                pide ahora
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            )}
            {/* Inside /workclub the corner CTA becomes the booking entry point. */}
            {activePage === "workclub" && (
              <a
                href={WORKCLUB_RESERVA_URL}
                {...reservaLinkProps}
                className={`group hidden md:flex items-center gap-1.5 text-[14px] font-semibold tracking-wide transition-opacity hover:opacity-60 ${textColor}`}
              >
                reserva ahora
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}

            {/* Menu Hamburguesa (Móvil) */}
            <button
              className={`md:hidden p-2 transition-opacity hover:opacity-60 ${textColor}`}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.header>

      <EcommerceModal
        isOpen={isEcommerceModalOpen}
        onClose={() => setIsEcommerceModalOpen(false)}
      />

      {/*
        The floating sticker only exists on the home page, so it is already
        absent inside /workclub and does not compete with "reserva ahora".
        TODO: if a floating booking sticker is wanted for workclub, it needs its
        own artwork — this one is the "pide aquí" coffee bag and cannot be
        recoloured into the cowork palette.
      */}
      {activePage === "home" && (
        <PideAhoraSticker
          onClick={() => setIsEcommerceModalOpen(true)}
          revealDelay={revealDelay}
        />
      )}

      {/* Menú Móvil Pantalla Completa */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-0 z-[100] flex flex-col bg-[#f2eae6]/98 backdrop-blur-xl dark:bg-[#042430]/98 transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          {/* Logo en menú móvil (siempre oscuro/claro según tema del sistema, independiente del scroll) */}
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
            <Image
              src="/icons/logo_oscuro.svg"
              alt="Socado Café Logo"
              width={100}
              height={84}
              className="w-auto h-12 dark:hidden"
            />
            <Image
              src="/icons/logo_white.svg"
              alt="Socado Café Logo"
              width={100}
              height={84}
              className="w-auto h-12 hidden dark:block"
            />
          </Link>
          <button
            className="p-2 text-[#063547] transition-opacity hover:opacity-60 dark:text-[#f2eae6]"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-10 text-2xl font-semibold tracking-wide text-[#063547] dark:text-[#f2eae6]">
          <a
            href="/#inicio"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileLinkClass("inicio")}
          >
            inicio
          </a>
          <a
            href="/#tiendas"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileLinkClass("tiendas")}
          >
            tiendas
          </a>
          <Link
            href="/workclub"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileLinkClass("workclub")}
          >
            <span
              className={
                activeSection === "workclub" ? undefined : "wc-nav-attention"
              }
            >
              workclub
              {activeSection !== "workclub" && (
                <span className="wc-nav-shine" aria-hidden="true">
                  workclub
                </span>
              )}
            </span>
          </Link>
          <Link
            href={CATERING_SOLICITUD_PATH}
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileLinkClass("catering")}
          >
            catering
          </Link>
          <Link
            href="/nosotros"
            onClick={() => setIsMobileMenuOpen(false)}
            className={mobileLinkClass("nosotros")}
          >
            nosotros
          </Link>

          {activePage === "home" && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsEcommerceModalOpen(true);
              }}
              className="mt-6 flex items-center gap-2 rounded-full border-2 border-[#063547] px-8 py-3 text-lg font-bold transition-all hover:bg-[#063547] hover:text-white dark:border-[#f2eae6] dark:hover:bg-[#f2eae6] dark:hover:text-[#042430]"
            >
              pide ahora <ArrowUpRight className="h-5 w-5" />
            </button>
          )}

          {activePage === "workclub" && (
            <a
              href={WORKCLUB_RESERVA_URL}
              {...reservaLinkProps}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-6 flex items-center gap-2 rounded-full border-2 border-[#063547] px-8 py-3 text-lg font-bold transition-all hover:bg-[#063547] hover:text-white dark:border-[#f2eae6] dark:hover:bg-[#f2eae6] dark:hover:text-[#042430]"
            >
              reserva ahora <ArrowUpRight className="h-5 w-5" />
            </a>
          )}
        </nav>
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, Star, Mail } from "lucide-react";

// ─── Promo 1: Tarjeta de Fidelidad ────────────────────────────────────────
function PromoFidelidad() {
  return (
    <div className="flex h-full min-h-[400px] lg:min-h-[500px]">
      <div className="w-[48%] flex flex-col justify-center px-8 lg:px-14 py-10">
        <p className="font-outfit text-white/50 text-[11px] uppercase tracking-[0.18em] mb-4">
          Tarjeta de Fidelidad
        </p>
        <h2
          className="font-raleway font-bold text-white leading-[1.0] mb-5"
          style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.5rem)" }}
        >
          <span className="block">Pide,</span>
          <span className="block">disfruta</span>
          <span className="block">y suma</span>
        </h2>
        <p className="font-outfit text-white/60 text-sm lg:text-base leading-snug">
          Adquiere tu tarjeta en tienda
        </p>
      </div>
      <div className="w-[52%] flex flex-col items-center justify-end pb-6 pr-4 gap-4">
        <div className="relative w-full flex-1 min-h-0">
          <Image
            src="/images/promotions/1.png"
            alt="Tarjeta de fidelidad Socado"
            fill
            className="object-contain object-bottom drop-shadow-2xl"
            sizes="(max-width: 1024px) 52vw, 30vw"
          />
        </div>
        <span className="font-outfit text-sm italic text-white/60 tracking-wide text-center">
          9 sellos* = un cafecito por la casa
        </span>
      </div>
    </div>
  );
}

// ─── Promo 2: Tu Recompensa ────────────────────────────────────────────────
function PromoRecompensa() {
  return (
    <div className="flex h-full min-h-[400px] lg:min-h-[500px]">
      <div className="w-[48%] flex flex-col justify-center px-8 lg:px-14 py-10">
        <p className="font-outfit text-white/50 text-[11px] uppercase tracking-[0.18em] mb-4">
          Tu Recompensa
        </p>
        <h2
          className="font-raleway font-bold text-white leading-[1.0] mb-5"
          style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.5rem)" }}
        >
          <span className="block">Completa</span>
          <span className="block">y recibe</span>
          <span className="block">tu regalo</span>
        </h2>
        <p className="font-outfit text-white/60 text-sm lg:text-base leading-snug">
          9 sellos completados, una bebida gratis
        </p>
      </div>
      <div className="w-[52%] flex flex-col items-center justify-end pb-6 pr-4 gap-4">
        <div className="relative w-full flex-1 min-h-0">
          <Image
            src="/images/promotions/2.png"
            alt="Tu recompensa Socado"
            fill
            className="object-contain object-bottom drop-shadow-2xl"
            sizes="(max-width: 1024px) 52vw, 30vw"
          />
        </div>
        <span className="font-outfit text-sm italic text-white/60 tracking-wide text-center">
          Café · Matcha · Infusión
        </span>
      </div>
    </div>
  );
}

// ─── Promo 3: Comunidad Socado ─────────────────────────────────────────────
function PromoComunidad() {
  return (
    <div className="flex h-full min-h-[400px] lg:min-h-[500px]">
      <div className="w-[48%] flex flex-col justify-center px-8 lg:px-14 py-10">
        <p className="font-outfit text-white/50 text-[11px] uppercase tracking-[0.18em] mb-4">
          Comunidad Socado
        </p>
        <h2
          className="font-raleway font-bold text-white leading-[1.0] mb-5"
          style={{ fontSize: "clamp(2.5rem, 4.5vw, 3.5rem)" }}
        >
          <span className="block">Únete</span>
          <span className="block">a nuestra</span>
          <span className="block">comunidad</span>
        </h2>
        <p className="font-outfit text-white/60 text-sm lg:text-base leading-snug">
          Beneficios exclusivos para miembros
        </p>
      </div>
      <div className="w-[52%] flex flex-col items-center justify-end pb-6 pr-4 gap-4">
        <div className="relative w-full flex-1 min-h-0">
          <Image
            src="/images/promotions/1.png"
            alt="Comunidad Socado"
            fill
            className="object-contain object-bottom drop-shadow-2xl"
            sizes="(max-width: 1024px) 52vw, 30vw"
          />
        </div>
        <span className="font-outfit text-sm italic text-white/60 tracking-wide text-center">
          Noticias · Ofertas · Sorpresas
        </span>
      </div>
    </div>
  );
}

// ─── Tarjetas del panel derecho ───────────────────────────────────────────
const cards = [
  {
    icon: Coffee,
    accentColor: "#b45b38",
    iconBg: "bg-[#b45b38]",
    title: "Pide tu Loyalty Card",
    description: "Órdenes mayores a REF.10 con café, matcha o infusión reciben un sello.",
  },
  {
    icon: Star,
    accentColor: "#5c8ea0",
    iconBg: "bg-[#5c8ea0]",
    title: "Tu recompensa te espera",
    description: "Al completar 9 sellos, te regalamos una bebida de barismo: café, matcha o infusión.",
  },
  {
    icon: Mail,
    accentColor: "#cf8a00",
    iconBg: "bg-[#cf8a00]",
    title: "Mantente cerca de Socado",
    description: "Déjanos tu correo y recibe beneficios exclusivos solo para miembros.",
  },
];

const promos = [PromoFidelidad, PromoRecompensa, PromoComunidad];

// ─── Componente principal ─────────────────────────────────────────────────
const INTERVAL_MS = 4000;

export function Promotion() {
  const [active, setActive] = useState(0);
  const isPausedRef = useRef(false);
  const ActivePromo = promos[active];

  useEffect(() => {
    const tick = setInterval(() => {
      if (!isPausedRef.current) {
        setActive((prev) => (prev + 1) % promos.length);
      }
    }, INTERVAL_MS);
    return () => clearInterval(tick);
  }, []);

  const handleManualSelect = (i: number) => {
    setActive(i);
    isPausedRef.current = true;
    setTimeout(() => { isPausedRef.current = false; }, INTERVAL_MS * 2);
  };

  return (
    <section
      id="promociones"
      className="w-full flex flex-col lg:flex-row min-h-[520px] lg:min-h-[600px] overflow-hidden"
    >
      {/* Panel izquierdo — entra desde la izquierda al hacer scroll */}
      <motion.div
        className="relative w-full lg:w-[58%] bg-[#5c8ea0] overflow-hidden min-h-[400px] lg:min-h-[560px]"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.38, ease: "easeInOut" }}
            className="h-full"
          >
            <ActivePromo />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Panel derecho — tarjetas entran escalonadas desde la derecha */}
      <div className="w-full lg:w-[42%] bg-white flex flex-col justify-center divide-y divide-black/[0.06]">
        {cards.map((card, i) => {
          const Icon = card.icon;
          const isActive = active === i;

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={() => handleManualSelect(i)}
              className={`group relative flex items-start gap-5 px-8 lg:px-12 py-8 lg:py-10 text-left transition-colors duration-300 w-full ${
                isActive ? "bg-[#f2eae6]" : "hover:bg-[#f2eae6]/50"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all duration-300 ${card.iconBg} ${
                  isActive ? "scale-110 shadow-md" : "opacity-60 group-hover:opacity-90"
                }`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h3
                  className={`font-raleway font-bold text-base lg:text-lg mb-1 leading-snug transition-colors duration-200 ${
                    isActive ? "text-[#063547]" : "text-[#063547]/60 group-hover:text-[#063547]"
                  }`}
                >
                  {card.title}
                </h3>
                <p
                  className={`font-outfit text-sm leading-relaxed transition-colors duration-200 ${
                    isActive ? "text-[#6e7c7c]" : "text-[#6e7c7c]/50 group-hover:text-[#6e7c7c]"
                  }`}
                >
                  {card.description}
                </p>
              </div>

              <div
                className="absolute right-0 top-6 bottom-6 w-[3px] rounded-full transition-all duration-300"
                style={{ backgroundColor: isActive ? card.accentColor : "transparent" }}
              />
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

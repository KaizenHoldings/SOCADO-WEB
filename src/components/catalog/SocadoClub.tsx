"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Script from "next/script";
import { motion, useReducedMotion } from "motion/react";
import { ButtonDark } from "@/components/catalog/ButtonDark";

// Inverted counterpart of LoyaltyCard: white text half on the left,
// illustration half (with the title stuck to the right) on the right.
export function SocadoClub() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const reduce = useReducedMotion();

  // Close modal on escape
  useEffect(() => {
    if (!isFormOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsFormOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFormOpen]);

  return (
    <>
      <section id="socado-club" className="relative bg-white">
        <div className="grid w-full grid-cols-1 lg:grid-cols-2">
          {/* Left square — description + CTA on pure white */}
          <div className="flex w-full items-center bg-white px-6 py-16 lg:aspect-square lg:px-12 lg:py-0 2xl:px-20">
            <div className="max-w-xl">
              <h2 className="font-raleway text-4xl font-normal leading-[1.05] tracking-tight text-[#063547] sm:text-5xl lg:text-6xl">
                mantente cerca
                <span className="block">de Socado</span>
              </h2>
              <p className="mt-5 font-outfit text-base text-[#6e7c7c] sm:text-lg">
                déjanos tu correo y recibe beneficios exclusivos.
              </p>
              <ButtonDark className="mt-8" type="button" onClick={() => setIsFormOpen(true)}>
                regístrate
              </ButtonDark>
            </div>
          </div>

          {/* Right square — illustration on white */}
          <div className="relative order-first flex aspect-square w-full items-center justify-center overflow-hidden bg-white p-10 lg:order-none lg:p-16 2xl:p-20">
            <motion.div
              className="h-full w-full"
              initial={reduce ? false : { opacity: 0, x: 48 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src="/images/socado-club-ilustracion.svg"
                alt="Ilustración del Socado Club"
                width={862}
                height={727}
                className="h-full w-full object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* JotForm Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 ${
          isFormOpen ? "visible" : "invisible pointer-events-none"
        }`}
      >
        <div
          aria-hidden="true"
          onClick={() => setIsFormOpen(false)}
          className={`absolute inset-0 bg-[#0a3547]/40 backdrop-blur-sm transition-opacity duration-500 ${
            isFormOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="dialog"
          aria-modal="true"
          className={`relative flex w-full max-h-[90vh] max-w-[800px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isFormOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-8 scale-[0.96] opacity-0"
          }`}
        >
          <button
            onClick={() => setIsFormOpen(false)}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-[#0a3547] shadow-sm transition-transform hover:rotate-90 hover:bg-gray-200"
            aria-label="Cerrar"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <div className="flex-1 min-h-0 overflow-y-auto bg-white p-4 pt-16 sm:p-8 sm:pt-16">
            <iframe
              id="JotFormIFrame-261095276983671"
              title="Socado Club."
              onLoad={() => window.parent.scrollTo(0,0)}
              allow="geolocation; microphone; camera; fullscreen; payment"
              src="https://form.jotform.com/261095276983671"
              frameBorder="0"
              style={{ minWidth: "100%", maxWidth: "100%", height: "539px", border: "none" }}
              scrolling="no"
            />
            <Script 
              src="https://cdn.jotfor.ms/s/umd/latest/for-form-embed-handler.js" 
              onLoad={() => {
                if (typeof window !== "undefined" && (window as any).jotformEmbedHandler) {
                  (window as any).jotformEmbedHandler("iframe[id='JotFormIFrame-261095276983671']", "https://form.jotform.com/");
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

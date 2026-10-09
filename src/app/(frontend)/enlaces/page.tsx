"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { Footer } from "@/components/catalog/Footer";

const ZONAS_MERCEDES = [
  {
    title: "Baruta",
    zones: [
      "Alto Prado", "Bello Monte", "Caurimare", "Cerro Verde", "Chuao",
      "Chulavista", "Colinas de Bello Monte", "Colinas de Tamanaco",
      "Colinas de Valle Arriba", "Concresa", "Cumbres de Curumo", "El Cafetal",
      "El Peñón", "La Alameda", "La Carlota", "La Mesetas de Santa Rosa de Limas",
      "Lomas de Prados del Este", "Lomas de San Román", "Lomas del Mirador",
      "Los Campitos", "Manzanares", "Prados del Este", "San Luis", "San Román",
      "Santa Ana El Cafetal", "Santa Fe", "Santa Inés", "Santa Marta",
      "Santa Paula", "Santa Rosa de Lima", "Santa Sofia",
      "Terrazas del Club Hípico", "Urb. Santa Clara", "Valle Arriba", "Vizcaya"
    ]
  },
  {
    title: "Las Mercedes",
    zones: ["Las Mercedes", "Lomas de las Mercedes", "Los Naranjos de las Mercedes"]
  },
  {
    title: "Chacao",
    zones: [
      "Altamira", "Bello Campo", "Campo Alegre", "Chacaito", "Chacao",
      "Country Club", "El Bosque", "El Dorado", "El Rosal", "La Carlota",
      "La Castellana", "La Floresta", "Los Palos Grandes", "San Marino"
    ]
  },
  {
    title: "Libertador",
    zones: [
      "Alta Florida", "El Bosque", "El Recreo", "La Florida", "Las Palmas",
      "Los Cedros", "Los Chaguaramos", "Plaza Venezuela", "Sabana Grande",
      "San Bernardino", "Santa Mónica"
    ]
  },
  {
    title: "Sucre",
    zones: [
      "Boleita Norte", "Boleita Sur", "California Norte", "California Sur",
      "Colinas de la California", "Colinas de los Ruices", "El Marqués",
      "La Urbina", "Lomas de los ruices", "Los Chorros", "Los Cortijos",
      "Los Dos Caminos", "Los Ruices", "Macaracuay", "Sebucán", "Santa Cecilia",
      "Santa Eduvigis", "Terrazas del Ávila"
    ]
  }
];

const ZONAS_TRINIDAD = [
  {
    title: "Baruta",
    zones: [
      "El Peñón", "El Placer", "Escampadero", "La Tahona", "La Trinidad",
      "Lomas de La Trinidad", "Los Samanes", "Piedra Azul"
    ]
  },
  {
    title: "El Hatillo",
    zones: [
      "Alto Hatillo", "Hacienda el Encantado", "La Boyera", "La Lagunita",
      "La Tahona", "Los Naranjos"
    ]
  }
];

// El Rosal has the same zones as Las Mercedes just ordered differently.
const ZONAS_ROSAL = [
  ZONAS_MERCEDES[2], // Chacao
  ZONAS_MERCEDES[1], // Las Mercedes
  ZONAS_MERCEDES[0], // Baruta
  ZONAS_MERCEDES[3], // Libertador
  ZONAS_MERCEDES[4], // Sucre
];

function AccordionItem({ title, zones, isOpen, onToggle }: { title: string, zones: string[], isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="border border-[#0a3547]/10 rounded-lg mb-3 overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left font-raleway font-bold text-[#0a3547] bg-[#f2eae6]/50 hover:bg-[#f2eae6] transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-4 text-sm font-outfit text-[#37738d] leading-relaxed">
          {zones.map((zone, i) => (
            <div key={i} className="mb-1">{zone}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0a3547]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-[#0a3547]/10">
          <h2 className="text-xl font-raleway font-bold text-[#0a3547] text-center flex-1">{title}</h2>
          <button
            onClick={onClose}
            className="absolute right-4 p-2 text-[#37738d] hover:bg-[#f2eae6] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto font-outfit">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function EnlacesPage() {
  const [activeModal, setActiveModal] = useState<"menu" | "atc_tienda" | "atc_delivery" | "zonas_mercedes" | "zonas_trinidad" | "zonas_rosal" | null>(null);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);

  const openModal = (id: typeof activeModal) => {
    setActiveModal(id);
    setOpenAccordion(0); // reset accordion state when opening a new modal
  };

  const MainButton = ({ title, onClick, href }: { title: string, onClick?: () => void, href?: string }) => {
    const className = "block w-full py-4 px-8 bg-azul-socado text-ivory font-bold text-base text-center rounded-full hover:bg-azul-socado/90 hover:shadow-xl hover:shadow-azul-socado/20 active:scale-95 transition-all cursor-pointer";
    if (href) {
      return <a href={href} className={className} target={href.startsWith("http") ? "_blank" : "_self"} rel="noopener noreferrer">{title}</a>;
    }
    return <button onClick={onClick} className={className}>{title}</button>;
  };

  const StoreButton = ({ title, href, onZonasClick }: { title: string, href: string, onZonasClick?: () => void }) => (
    <div className="mb-6 flex flex-col items-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-[320px] py-4 px-8 bg-azul-socado text-ivory font-bold text-base text-center rounded-full hover:bg-azul-socado/90 hover:shadow-xl hover:shadow-azul-socado/20 active:scale-95 transition-all mb-2"
      >
        {title}
      </a>
      {onZonasClick && (
        <button
          onClick={onZonasClick}
          className="text-sm text-[#37738d] underline hover:text-[#0a3547] font-outfit"
        >
          Ver zonas
        </button>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col selection:bg-terra selection:text-white relative">
      <div className="fixed inset-0 overflow-hidden -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover blur-[8px] scale-110"
        >
          <source src="/videos/people.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <main className="relative min-h-[100dvh] flex flex-col items-center justify-center py-12 px-4 w-full">
        <div className="bg-white rounded-[10px] shadow-2xl p-10 w-full max-w-[420px] flex flex-col items-center">
          <Link href="/" className="mb-10 transition-opacity hover:opacity-80">
            <Image
              src="/icons/logo_oscuro.svg"
              alt="Socado Café"
              width={220}
              height={73}
              className="w-52 h-auto"
              priority
            />
          </Link>

          <div className="w-full flex flex-col gap-4">
            <MainButton title="Menú" onClick={() => openModal("menu")} />
            <MainButton title="Delivery / Pickup" onClick={() => openModal("menu")} />
            <MainButton title="Atención al cliente - Tienda" onClick={() => openModal("atc_tienda")} />
            <MainButton title="Atención al cliente - Delivery" onClick={() => openModal("atc_delivery")} />
           
          </div>
        </div>
      </main>

      <div className="relative z-10 mt-auto">
        <Footer />
      </div>

      {/* MODALS */}

      {/* Menú / Tienda Modal */}
      <Modal isOpen={activeModal === "menu"} onClose={() => setActiveModal(null)} title="Selecciona una tienda">
        <div className="flex flex-col items-center mt-4">
          <StoreButton title="Las Mercedes" href="https://lasmercedes.socadocafe.com" onZonasClick={() => openModal("zonas_mercedes")} />
          <StoreButton title="La Trinidad" href="https://latrinidad.socadocafe.com" onZonasClick={() => openModal("zonas_trinidad")} />
          <StoreButton title="El Rosal" href="https://elrosal.socadocafe.com" onZonasClick={() => openModal("zonas_rosal")} />
        </div>
      </Modal>

      {/* ATC Tienda Modal */}
      <Modal isOpen={activeModal === "atc_tienda"} onClose={() => setActiveModal(null)} title="Selecciona una tienda">
        <div className="flex flex-col items-center mt-4">
          <StoreButton title="Las Mercedes" href="https://wa.me/584124366499" />
          <StoreButton title="La Trinidad" href="https://wa.me/584242688181" />
          <StoreButton title="El Rosal" href="https://wa.me/584142835008" />
        </div>
      </Modal>

      {/* ATC Delivery Modal */}
      <Modal isOpen={activeModal === "atc_delivery"} onClose={() => setActiveModal(null)} title="Selecciona una tienda">
        <div className="flex flex-col items-center mt-4">
          <StoreButton title="Las Mercedes" href="https://wa.me/584124366499" />
          <StoreButton title="La Trinidad" href="https://wa.me/584242688181" />
          <StoreButton title="El Rosal" href="https://wa.me/584142835008" />
        </div>
      </Modal>

      {/* Zonas Las Mercedes */}
      <Modal isOpen={activeModal === "zonas_mercedes"} onClose={() => openModal("menu")} title="Zonas - Las Mercedes">
        <div className="mt-2">
          {ZONAS_MERCEDES.map((region, idx) => (
            <AccordionItem
              key={idx}
              title={region.title}
              zones={region.zones}
              isOpen={openAccordion === idx}
              onToggle={() => setOpenAccordion(openAccordion === idx ? null : idx)}
            />
          ))}
        </div>
      </Modal>

      {/* Zonas La Trinidad */}
      <Modal isOpen={activeModal === "zonas_trinidad"} onClose={() => openModal("menu")} title="Zonas - La Trinidad">
        <div className="mt-2">
          {ZONAS_TRINIDAD.map((region, idx) => (
            <AccordionItem
              key={idx}
              title={region.title}
              zones={region.zones}
              isOpen={openAccordion === idx}
              onToggle={() => setOpenAccordion(openAccordion === idx ? null : idx)}
            />
          ))}
        </div>
      </Modal>

      {/* Zonas El Rosal */}
      <Modal isOpen={activeModal === "zonas_rosal"} onClose={() => openModal("menu")} title="Zonas - El Rosal">
        <div className="mt-2">
          {ZONAS_ROSAL.map((region, idx) => (
            <AccordionItem
              key={idx}
              title={region.title}
              zones={region.zones}
              isOpen={openAccordion === idx}
              onToggle={() => setOpenAccordion(openAccordion === idx ? null : idx)}
            />
          ))}
        </div>
      </Modal>
    </div>
  );
}

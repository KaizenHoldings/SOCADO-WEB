"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X, ArrowUpRight, MapPin, Clock } from "lucide-react";
import { StoreData } from "./StoreCard";

const DEFAULT_STORES: StoreData[] = [
  {
    id: "las-mercedes",
    title: "Las Mercedes",
    subtitle: "UBICACIÓN",
    location: "Av. Veracruz, Torre Aba, Las Mercedes.",
    schedule: "Lunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://lasmercedes.socadocafe.com",
    images: ["/images/socadolasMercedes.jpg", "/images/socadoTrinidad.jpg"],
    order: 1,
  },
  {
    id: "la-trinidad",
    title: "La Trinidad",
    subtitle: "UBICACIÓN",
    location: "Calle Altagracia, Edificio Caracas Campus, La Trinidad.",
    schedule: "Lunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://latrinidad.socadocafe.com",
    images: ["/images/socadoTrinidad.jpg", "/images/socadoRosal.jpg"],
    order: 2,
  },
  {
    id: "el-rosal",
    title: "El Rosal",
    subtitle: "UBICACIÓN",
    location: "Av. Tamanaco, El Rosal.",
    schedule: "Lunes a viernes de 7 a.m. a 9 p.m.\nSábados, domingos y feriados de 8 a.m. a 8 p.m.",
    link: "https://elrosal.socadocafe.com",
    images: ["/images/socadoRosal.jpg", "/images/socadolasMercedes.jpg"],
    order: 3,
  },
];

interface EcommerceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EcommerceModal({ isOpen, onClose }: EcommerceModalProps) {
  const [stores, setStores] = useState<StoreData[]>(DEFAULT_STORES);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/stores?limit=100")
      .then((r) => r.json())
      .then((data) => {
        if (data?.docs?.length > 0) {
          const mapped: StoreData[] = data.docs.map((doc: any) => ({
            id: doc.storeId || doc.id,
            title: doc.title,
            subtitle: doc.subtitle || "UBICACIÓN",
            location: doc.location,
            schedule: doc.schedule,
            link: doc.link,
            images: Array.isArray(doc.images)
              ? doc.images.map((imgObj: any) =>
                  typeof imgObj.image === "string" ? imgObj.image : imgObj.image?.url || ""
                )
              : [],
            order: typeof doc.order === "number" ? doc.order : undefined,
          }));
          setStores(mapped);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const sorted = [...stores].sort((a, b) => {
    const oa = typeof a.order === "number" ? a.order : Infinity;
    const ob = typeof b.order === "number" ? b.order : Infinity;
    return oa - ob;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] bg-[#063547]/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-10 pointer-events-none"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white pointer-events-auto flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header azul */}
              <div className="flex items-center justify-between px-8 py-6 bg-[#063547]">
                <div>
                  <p className="font-outfit text-[10px] uppercase tracking-[0.25em] text-white/50 mb-1">
                    Socado Café
                  </p>
                  <h2 className="font-raleway text-2xl font-bold text-white">
                    Elige tu tienda
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cards */}
              <div className="overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3">
                  {sorted.map((store, i) => (
                    <StoreModalCard key={store.id} store={store} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StoreModalCard({ store, index }: { store: StoreData; index: number }) {
  const coverImage = store.images?.[0] || "/images/placeholder.jpg";

  return (
    <motion.a
      href={store.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      className="group relative flex flex-col overflow-hidden border-r border-b border-black/5 last:border-r-0 cursor-pointer"
    >
      {/* Imagen */}
      <div className="relative w-full h-52 overflow-hidden bg-[#063547]/10">
        <Image
          src={coverImage}
          alt={store.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#063547]/70 via-transparent to-transparent" />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 px-6 py-5 bg-white border-t-2 border-[#063547] group-hover:bg-[#063547] transition-colors duration-300">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-raleway font-bold text-lg text-[#063547] group-hover:text-white transition-colors duration-300">
            {store.title}
          </h3>
          <div className="w-7 h-7 rounded-full border border-[#063547] group-hover:border-white group-hover:bg-white/10 flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5">
            <ArrowUpRight className="w-3.5 h-3.5 text-[#063547] group-hover:text-white transition-colors duration-300" />
          </div>
        </div>

        <div className="flex items-start gap-2 text-[13px] text-[#6e7c7c] group-hover:text-white/70 transition-colors duration-300 font-outfit mb-2">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#5c8ea0] group-hover:text-white/50 transition-colors duration-300" />
          <span className="leading-snug">{store.location}</span>
        </div>

        <div className="flex items-start gap-2 text-[13px] text-[#6e7c7c] group-hover:text-white/70 transition-colors duration-300 font-outfit">
          <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#5c8ea0] group-hover:text-white/50 transition-colors duration-300" />
          <span className="leading-snug whitespace-pre-line">{store.schedule}</span>
        </div>
      </div>
    </motion.a>
  );
}

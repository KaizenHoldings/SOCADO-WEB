import React from "react";
import Image from "next/image";

interface ViewModeToggleProps {
  viewMode: "libre" | "box";
  onChange: (mode: "libre" | "box") => void;
  selectedBoxName?: string;
}

export function ViewModeToggle({ viewMode, onChange, selectedBoxName }: ViewModeToggleProps) {
  return (
    <div className="relative w-full h-24 md:h-28 overflow-hidden bg-white flex">
      {/* Left side: Individuales (Image Background) */}
      <div 
        onClick={() => onChange("box")}
        className={`relative w-1/2 h-full flex flex-col justify-center items-start pl-6 md:pl-10 z-10 transition-all duration-300 cursor-pointer ${
          viewMode === 'box' ? 'opacity-100' : 'opacity-60 hover:opacity-90'
        }`}
      >
        <Image
          src="/images/individuales.png"
          fill
          className="object-cover"
          alt="Individuales"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-left pr-2">
        <h3 className="font-outfit text-xl sm:text-2xl md:text-4xl font-light text-white lowercase tracking-wide flex items-center gap-2">
          individuales
        </h3>
        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mt-1">
          <p className="font-outfit text-white/90 text-[10px] sm:text-xs lowercase tracking-widest leading-tight">
            Boxes por persona
          </p>
          {selectedBoxName && (
            <span className="font-outfit text-white text-[9px] md:text-xs lowercase font-bold tracking-widest bg-black/10 px-1.5 md:px-2 py-0.5 rounded-sm w-fit truncate max-w-full">
              Armando: {selectedBoxName}
            </span>
          )}
        </div>
        {/* Active Indicator */}
        {viewMode === 'box' && (
          <div className="absolute -bottom-6 md:-bottom-4 left-0 h-1.5 w-16 md:w-32 bg-[#063547] rounded-full" />
        )}
        </div>
      </div>

      {/* Right side: Para compartir (Image Background) */}
      <div 
        onClick={() => onChange("libre")}
        className={`absolute right-0 top-0 w-1/2 h-full flex flex-col justify-center items-end md:items-start md:pl-10 pr-4 md:pr-10 z-0 transition-all duration-300 cursor-pointer ${
          viewMode === 'libre' ? 'opacity-100' : 'opacity-60 hover:opacity-90'
        }`}
      >
        <Image
          src="/images/servicio.jpg"
          fill
          className="object-cover"
          alt="Para compartir"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-right md:text-left flex flex-col pl-2">
          <h3 className="font-outfit text-xl sm:text-2xl md:text-4xl font-light text-white lowercase tracking-wide">
            para compartir
          </h3>
          <p className="font-outfit text-white/90 text-[10px] sm:text-xs mt-1 lowercase tracking-widest leading-tight">
            Bandejas y opciones grupales
          </p>
          {/* Active Indicator */}
          {viewMode === 'libre' && (
            <div className="absolute -bottom-6 md:-bottom-4 right-0 md:left-0 h-1.5 w-32 bg-[#063547] rounded-full" />
          )}
        </div>
      </div>
    </div>
  );
}

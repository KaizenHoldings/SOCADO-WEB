import React from "react";
import { Package, ListFilter } from "lucide-react";

interface ViewModeToggleProps {
  viewMode: "libre" | "box";
  onChange: (mode: "libre" | "box") => void;
}

export function ViewModeToggle({ viewMode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex-shrink-0">
      <button
        onClick={() => onChange(viewMode === "libre" ? "box" : "libre")}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#063547] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#063547]/90 hover:shadow-lg lg:w-auto"
      >
        {viewMode === "libre" ? (
          <>
            <Package className="h-4 w-4" /> Box individual
          </>
        ) : (
          <>
            <ListFilter className="h-4 w-4" /> Para compartir
          </>
        )}
      </button>
    </div>
  );
}

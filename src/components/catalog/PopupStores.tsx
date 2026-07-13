"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

/**
 * PopupStores — premium store-info modal adapted from the PopupStores prototype.
 * Left column: store name + info sections + animated amenity icon rail.
 * Right column: tall inset store photo. Raleway text, Outfit for digits.
 *
 * Amenities are plain booleans so an admin panel can toggle them per store later.
 */
export interface StoreAmenities {
  kidsCorner: boolean;
  parking: boolean;
  petFriendly: boolean;
  freeWifi: boolean;
}

export interface PopupStoreData {
  name: string;
  location?: string;
  schedule?: string;
  address?: string;
  image?: string;
  amenities?: StoreAmenities;
}

interface PopupStoresProps {
  store: PopupStoreData | null;
  open: boolean;
  onClose: () => void;
}

/* Amenity icons extracted from the brand SVG ("socado l iconos tiendas"),
   preserved in original vertical order. */
type IconShape = { d: string; transform?: string } | { cx: number; cy: number; r: number };

const AMENITY_ICONS: {
  key: keyof StoreAmenities;
  label: string;
  viewBox: string;
  shapes: IconShape[];
}[] = [
  {
    key: "kidsCorner",
    label: "Kids Corner",
    viewBox: "-24 -24 806 795",
    shapes: [
      {
        d: "M1869.1-1665.4H1742.9a100.36,100.36,0,0,0,35.5-76.6v-184.4A100.68,100.68,0,0,0,1677.8-2027H1493.4a100.68,100.68,0,0,0-100.6,100.6V-1742a100.36,100.36,0,0,0,35.5,76.6H1312.6A100.68,100.68,0,0,0,1212-1564.8v184.4a100.68,100.68,0,0,0,100.6,100.6H1497a100.87,100.87,0,0,0,93.9-64.5,100.66,100.66,0,0,0,93.9,64.5h184.4a100.68,100.68,0,0,0,100.6-100.6v-184.4a100.68,100.68,0,0,0-100.6-100.6h-0.1Zm-306.9,24h57.5a101,101,0,0,0-28.8,40.5,101,101,0,0,0-28.8-40.5h0.1ZM1416.9-1742v-184.4a76.67,76.67,0,0,1,76.6-76.6h184.4a76.67,76.67,0,0,1,76.6,76.6V-1742a76.67,76.67,0,0,1-76.6,76.6H1493.5A76.67,76.67,0,0,1,1416.9-1742Zm156.8,361.6a76.67,76.67,0,0,1-76.6,76.6H1312.7a76.67,76.67,0,0,1-76.6-76.6v-184.4a76.67,76.67,0,0,1,76.6-76.6h184.4a76.67,76.67,0,0,1,76.6,76.6v184.4Zm372,0a76.67,76.67,0,0,1-76.6,76.6H1684.7a76.67,76.67,0,0,1-76.6-76.6v-184.4a76.67,76.67,0,0,1,76.6-76.6h184.4a76.67,76.67,0,0,1,76.6,76.6v184.4Z",
        transform: "translate(-1212 2027)",
      },
      {
        d: "M1596.2-1758.5a80.68,80.68,0,0,0,80.6-80.6,80.62,80.62,0,0,0-80.6-80.6,80.62,80.62,0,0,0-80.6,80.6A80.62,80.62,0,0,0,1596.2-1758.5Zm0-137.1a56.57,56.57,0,0,1,56.5,56.5,56.63,56.63,0,0,1-56.5,56.5,56.63,56.63,0,0,1-56.5-56.5A56.63,56.63,0,0,1,1596.2-1895.6Z",
        transform: "translate(-1212 2027)",
      },
      {
        d: "M1506.9-1511l-63-9.2-28.2-57.1a12,12,0,0,0-10.8-6.7,12.11,12.11,0,0,0-10.8,6.7l-28.2,57.1-63,9.2a12,12,0,0,0-9.7,8.2,12.18,12.18,0,0,0,3,12.3l45.6,44.5-10.8,62.8a11.83,11.83,0,0,0,4.8,11.7,12.12,12.12,0,0,0,12.7.9l56.4-29.6,56.4,29.6a12.54,12.54,0,0,0,5.6,1.4,13.8,13.8,0,0,0,7.1-2.3,12.11,12.11,0,0,0,4.8-11.7L1468-1446l45.6-44.5a11.77,11.77,0,0,0,3-12.3A12.21,12.21,0,0,0,1506.9-1511Zm-60.2,52.1a12.29,12.29,0,0,0-3.5,10.6l7.7,45-40.4-21.3a12.29,12.29,0,0,0-11.2,0l-40.4,21.3,7.7-45a11.66,11.66,0,0,0-3.5-10.6l-32.7-31.9,45.2-6.6a11.86,11.86,0,0,0,9-6.6l20.2-41,20.2,41a12.27,12.27,0,0,0,9,6.6l45.2,6.6-32.7,31.9h0.2Z",
        transform: "translate(-1212 2027)",
      },
      {
        d: "M1787.2-1568.9a12.17,12.17,0,0,0-10.2-5.7,12,12,0,0,0-10.2,5.7l-95.4,153.6a12.1,12.1,0,0,0-.3,12.2,12,12,0,0,0,10.5,6.2h190.8a12,12,0,0,0,10.5-6.2,12.1,12.1,0,0,0-.3-12.2Zm-84,147.9,73.8-118.8,73.8,118.8H1703.2Z",
        transform: "translate(-1212 2027)",
      },
    ],
  },
  {
    key: "parking",
    label: "Parking",
    viewBox: "67 1129 624 624",
    shapes: [
      {
        d: "M1590.9-874.1c-158.8,0-288,129.2-288,288s129.2,288,288,288,288-129.2,288-288S1749.7-874.1,1590.9-874.1Zm0,557.5c-148.6,0-269.5-120.9-269.5-269.5s120.9-269.5,269.5-269.5,269.5,120.9,269.5,269.5-120.9,269.5-269.5,269.5h0Z",
        transform: "translate(-1212 2027)",
      },
      {
        d: "M1513.9-724.6a9.18,9.18,0,0,0-9.2,9.2v287.1a9.18,9.18,0,0,0,9.2,9.2,9.18,9.18,0,0,0,9.2-9.2V-715.4A9.18,9.18,0,0,0,1513.9-724.6Z",
        transform: "translate(-1212 2027)",
      },
      {
        d: "M1631.2-729.6h-68a9.18,9.18,0,0,0-9.2,9.2,9.18,9.18,0,0,0,9.2,9.2h68a62.16,62.16,0,0,1,62.1,62.1v1.7a62.16,62.16,0,0,1-62.1,62.1h-68a9.18,9.18,0,0,0-9.2,9.2,9.18,9.18,0,0,0,9.2,9.2h68a80.68,80.68,0,0,0,80.6-80.6v-1.7a80.68,80.68,0,0,0-80.6-80.6v0.2Z",
        transform: "translate(-1212 2027)",
      },
    ],
  },
  {
    key: "petFriendly",
    label: "Pet Friendly",
    viewBox: "66 2163 626 626",
    shapes: [
      {
        d: "M1590.9,737.5c-159.2,0-288.6-129.5-288.6-288.6s129.5-288.6,288.6-288.6,288.6,129.5,288.6,288.6S1750,737.5,1590.9,737.5Zm0-557.6c-148.3,0-269,120.7-269,269s120.7,269,269,269,269-120.7,269-269-120.7-269-269-269h0Z",
        transform: "translate(-1212 2027)",
      },
      {
        d: "M1765.8,335a6.33,6.33,0,0,0-6-4.4h-40.2c-0.8-7.7-3.6-20.6-13.2-30.6-7.3-7.6-17.1-12.1-29.1-13.2V256.9a6.44,6.44,0,0,0-2.1-4.7,6.14,6.14,0,0,0-5-1.5c-1.5.2-37.8,5.2-60.2,56.9a1.06,1.06,0,0,1-.2.5c-0.2.6-4.7,14.4-5.5,34.2a6.43,6.43,0,0,0,6.1,6.6,6.36,6.36,0,0,0,6.6-6.1,129.82,129.82,0,0,1,4.8-30.4c13.8-31.6,32.7-43,42.9-47V293a6.27,6.27,0,0,0,6.3,6.3c11.3,0,20.2,3.2,26.3,9.5,10.5,10.9,10,27.8,10,28a6.5,6.5,0,0,0,1.8,4.6,6.42,6.42,0,0,0,4.6,1.9h41.1c0.8,5.7,1.1,15.8-5.1,24-8.2,10.9-26.1,16.2-51.7,15.4a6.1,6.1,0,0,0-4.6,1.8,6.36,6.36,0,0,0-1.9,4.5v20L1608,371.9a6.41,6.41,0,0,0-8.4,3.2,6.27,6.27,0,0,0,3.2,8.3l88.6,39.4V618.9a5,5,0,0,1-5,5,4.74,4.74,0,0,1-4.9-4.2l-10.2-96.8a6.38,6.38,0,0,0-7-5.6,6.31,6.31,0,0,0-5.6,7l10.2,96.9a17.61,17.61,0,0,0,17.5,15.4c8.9,0,17.6-7.9,17.6-17.6V395.5c26.9-.2,45.6-7.1,55.8-20.6,13.1-17.5,6.3-38.9,6.1-39.8ZM1644.3,517.3a6.27,6.27,0,0,0-6.3,6.3V619a5,5,0,0,1-5,5,4.75,4.75,0,0,1-4.9-4.3l-12.4-96.8a6.28,6.28,0,0,0-6.3-5.5h-72a6.31,6.31,0,0,0-6.1,4.8c0,0.3-8.4,31.3-40.5,44.6a6.29,6.29,0,0,0-3.9,5.8v46.5a5,5,0,0,1-5,5h-6.1a5,5,0,0,1-4.9-4.2L1455,523.2v-80a6.76,6.76,0,0,0-1.3-3.9c-26.4-33.9-36.6-63.9-30.4-89.3a60,60,0,0,1,9.2-20.1c-8.4,39.1,20.5,81.4,20.9,81.9a6.31,6.31,0,0,0,5.2,2.7h140.6a6.3,6.3,0,1,0,0-12.6H1462c-7.7-12.5-36.9-65.1-.8-96.5a6.3,6.3,0,0,0,1.2-8.2,6.49,6.49,0,0,0-7.9-2.4c-1.4.6-34.5,16-43.4,52.1-7.1,28.9,3.4,62,31.4,98.5v79.4l16,97.2a17.53,17.53,0,0,0,17.4,14.8h6.1a17.63,17.63,0,0,0,17.6-17.6V576.8c1.7-.8,3.4-1.7,5-2.6l7.3,47.7a17.46,17.46,0,0,0,17.4,14.9h6a17.63,17.63,0,0,0,17.6-17.6V576.8a79.73,79.73,0,0,0,41.2-46.7h9.7l11.7,91.3a17.61,17.61,0,0,0,17.5,15.4c8.9,0,17.6-7.9,17.6-17.6V523.8a6.27,6.27,0,0,0-6.3-6.3v-0.2Zm-100.2,49.3a6.29,6.29,0,0,0-3.9,5.8v46.5a5,5,0,0,1-5,5h-6a5,5,0,0,1-4.9-4.2l-8.3-53.6a87.66,87.66,0,0,0,25.9-36.1h38.6a67.59,67.59,0,0,1-36.5,36.7Z",
        transform: "translate(-1212 2027)",
      },
    ],
  },
  {
    key: "freeWifi",
    label: "Free Wi-Fi",
    viewBox: "66 3280 626 625",
    shapes: [
      {
        d: "M1734.1,1530.3c-79.9-75.9-205.8-76.1-285.4-.7-4.7,4.4-11.1,4.8-15.8.7-4.3-3.7-5.6-11.4-.9-15.9a230.3,230.3,0,0,1,316.7-1.4c4.7,4.5,5.8,10.9,1.7,16-3.7,4.7-11.4,6-16.3,1.3h0Z",
        transform: "translate(-1212 2027)",
      },
      {
        d: "M1688.6,1581.5c-54-54.2-141.7-53.9-195.5.3-4.3,4.4-12.1,3.5-16-.8-4.8-5.4-3.1-12.1,1.4-16.5,62.3-61.4,163.1-61.3,225.2.4,4.3,4.3,5.6,11,1,16.1s-11.6,5.3-16.2.6Z",
        transform: "translate(-1212 2027)",
      },
      {
        d: "M1643,1630.2a74,74,0,0,0-104.4.2,11.28,11.28,0,1,1-15.7-16.2,96.48,96.48,0,0,1,136.4.4,11.32,11.32,0,0,1-16.3,15.7v-0.1Z",
        transform: "translate(-1212 2027)",
      },
      {
        d: "M1590.9,1854.1c-159.2,0-288.6-129.5-288.6-288.6s129.5-288.6,288.6-288.6,288.6,129.5,288.6,288.6S1750,1854.1,1590.9,1854.1Zm0-557.6c-148.3,0-269,120.7-269,269s120.7,269,269,269,269-120.7,269-269S1739.2,1296.5,1590.9,1296.5Z",
        transform: "translate(-1212 2027)",
      },
      { cx: 379, cy: 3688.5, r: 18.8 },
    ],
  },
];

const DEFAULT_AMENITIES: StoreAmenities = {
  kidsCorner: true,
  parking: true,
  petFriendly: true,
  freeWifi: true,
};

/** Wraps digit runs in Outfit so numbers always render in the numeric font. */
function NumText({ text }: { text: string }) {
  const parts = String(text).split(/(\d[\d.,:%–-]*)/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\d/.test(p) ? (
          <span key={i} className="font-outfit">
            {p}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

const RAIL_CYCLE_MS = 3000;

/** Vertical animated amenity icon rail. Spotlight cycles top-to-bottom while
    idle; real hover pauses the cycle and takes priority. */
function AmenityRail({ amenities }: { amenities: StoreAmenities }) {
  const icons = AMENITY_ICONS.filter((i) => amenities[i.key]);
  const [autoIndex, setAutoIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || icons.length <= 1) return;
    const t = setInterval(() => setAutoIndex((i) => (i + 1) % icons.length), RAIL_CYCLE_MS);
    return () => clearInterval(t);
  }, [paused, icons.length]);

  if (icons.length === 0) return null;

  return (
    <div className="rounded-2xl bg-white px-2.5 py-2.5 ring-1 ring-[#0a3547]/10 shadow-[0_8px_28px_rgba(10,53,71,0.08)]">
      <ul
        aria-label="Comodidades de la tienda"
        className="flex flex-col items-stretch gap-0.5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {icons.map((icon, i) => {
          const lit = !paused && i === autoIndex;
          return (
            <li
              key={icon.key}
              className="group relative flex items-center justify-center rounded-xl px-1.5 py-1"
              title={icon.label}
            >
              <span
                className="relative flex shrink-0 items-center justify-center"
                style={{ width: "min(44px, 6.5vh)", height: "min(44px, 6.5vh)" }}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-xl bg-[#f2eae6] transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 ${
                    lit ? "scale-100 opacity-100" : "scale-[0.55] opacity-0"
                  }`}
                />
                <svg
                  viewBox={icon.viewBox}
                  role="img"
                  aria-label={icon.label}
                  fill="currentColor"
                  className={`relative h-[62%] w-[62%] transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-[#37738d] group-hover:drop-shadow-[0_6px_12px_rgba(55,115,141,0.4)] ${
                    lit
                      ? "scale-110 text-[#37738d] drop-shadow-[0_6px_12px_rgba(55,115,141,0.4)]"
                      : "text-[#0a3547]"
                  }`}
                >
                  <title>{icon.label}</title>
                  {icon.shapes.map((s, k) =>
                    "d" in s ? (
                      <path key={k} d={s.d} transform={s.transform} />
                    ) : (
                      <circle key={k} cx={s.cx} cy={s.cy} r={s.r} />
                    ),
                  )}
                </svg>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function PopupStores({ store, open, onClose }: PopupStoresProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!store) return null;

  const sections = [
    { label: "ubicación", text: store.location },
    { label: "horario", text: store.schedule },
    { label: "dirección", text: store.address },
  ].filter((s): s is { label: string; text: string } => Boolean(s.text));

  return (
    <div
      className={`fixed inset-0 z-50 font-raleway ${
        open ? "visible" : "invisible [transition:visibility_0s_0.5s]"
      }`}
    >
      {/* overlay — click outside to close */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`absolute inset-0 bg-[#0a3547]/40 backdrop-blur-[2px] transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* panel */}
      <div
        className={`absolute inset-0 flex items-center justify-center p-4 sm:p-8 ${
          open ? "" : "pointer-events-none"
        }`}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={store.name}
          className={`relative flex max-h-[92vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_30px_80px_rgba(10,53,71,0.35)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:h-[560px] md:flex-row ${
            open ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.96] opacity-0"
          }`}
        >
          {/* close */}
          <button
            ref={closeBtnRef}
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="absolute right-1.5 top-1.5 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0a3547] outline-none transition-all duration-300 hover:rotate-90 hover:bg-[#f2eae6] focus-visible:ring-2 focus-visible:ring-[#37738d]"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {/* left column — content + amenity rail bottom-left */}
          <div className="order-2 flex min-h-0 flex-1 flex-col justify-between px-8 pb-6 pt-7 sm:px-12 sm:pt-10 md:order-1">
            <div>
              <h2 className="text-2xl font-medium tracking-wide text-[#37738d] sm:text-[28px]">
                {store.name}
              </h2>
              <div className="mt-6 flex flex-col gap-5">
                {sections.map((s, i) => (
                  <div key={i}>
                    <h3 className="text-[15px] font-bold lowercase tracking-wide text-[#0a3547]">
                      {s.label}
                    </h3>
                    <p className="mt-1 whitespace-pre-line text-[13px] leading-relaxed text-[#37738d]">
                      <NumText text={s.text} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 self-start">
              <AmenityRail amenities={store.amenities ?? DEFAULT_AMENITIES} />
            </div>
          </div>

          {/* right column — photo */}
          <div className="relative order-1 h-56 shrink-0 p-4 sm:h-64 md:order-2 md:h-auto md:w-[54%]">
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-[#f2eae6]">
              {store.image && (
                <Image
                  src={store.image}
                  alt={store.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 540px"
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopupStores;

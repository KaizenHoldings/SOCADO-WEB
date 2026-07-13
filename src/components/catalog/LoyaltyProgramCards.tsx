"use client";

import { useEffect, useState } from "react";
import styles from "./LoyaltyProgramCards.module.css";

export type LoyaltyProgramCardIcon = "stamp" | "gift" | "mail";

export interface LoyaltyProgramCardItem {
  icon: LoyaltyProgramCardIcon;
  title: string;
  description: string;
}

const DEFAULT_ITEMS: LoyaltyProgramCardItem[] = [
  {
    icon: "stamp",
    title: "Pide tu Loyalty Card",
    description:
      "Órdenes mayores a REF.10 con café, matcha o infusión, reciben un sello.",
  },
  {
    icon: "gift",
    title: "Tu recompensa te espera",
    description:
      "Al completar 9 sellos, te regalamos una bebida de barismo: café, matcha o infusión.",
  },
  {
    icon: "mail",
    title: "Mantente cerca de Socado",
    description: "Déjanos tu correo y recibe beneficios exclusivos.",
  },
];

function CardIcon({ icon }: { icon: LoyaltyProgramCardIcon }) {
  const common = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (icon === "gift") {
    return (
      <svg {...common} className={`h-full w-full ${styles.iconGift}`}>
        <path d="M20 12.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7.5" />
        <rect x="2.5" y="7.5" width="19" height="5" rx="1" />
        <path d="M12 7.5V21" />
        <path d="M12 7.5s-1.6-4-4.2-4-2.4 4 4.2 4" />
        <path d="M12 7.5s1.6-4 4.2-4 2.4 4-4.2 4" />
      </svg>
    );
  }

  if (icon === "mail") {
    return (
      <svg {...common} className={`h-full w-full ${styles.iconMail}`}>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="M3.5 7.5l8.5 5.8 8.5-5.8" />
      </svg>
    );
  }

  return (
    <svg {...common} className={`h-full w-full ${styles.iconStamp}`}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <circle cx="8.8" cy="12" r="2.2" />
      <path d="M13.5 10.2h4.2" />
      <path d="M13.5 13.8h3" />
    </svg>
  );
}

export interface LoyaltyProgramCardsProps {
  items?: LoyaltyProgramCardItem[];
  className?: string;
}

const AUTO_CYCLE_MS = 5000;

export function LoyaltyProgramCards({
  items = DEFAULT_ITEMS,
  className,
}: LoyaltyProgramCardsProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-activate cards top-to-bottom, looping. Pauses while the user hovers
  // the group so real hover always takes priority.
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((i) => (i + 1) % items.length), AUTO_CYCLE_MS);
    return () => clearInterval(t);
  }, [paused, items.length]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`mx-auto grid w-full max-w-[640px] auto-rows-fr gap-4 sm:gap-5 ${className ?? ""}`}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className={`${styles.card} ${
            !paused && i === active ? styles.cardActive : ""
          } relative flex h-full items-center gap-4 overflow-hidden rounded-2xl bg-white p-5 shadow-[0_2px_10px_rgba(10,53,71,0.06)] sm:gap-6 sm:rounded-[22px] sm:p-7`}
        >
          <div
            className={`${styles.chip} flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#37738d]/12 p-3 text-[#37738d] sm:h-[58px] sm:w-[58px] sm:p-4`}
          >
            <CardIcon icon={item.icon} />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="font-raleway text-[15.5px] font-bold tracking-tight text-[#0a3547] sm:text-[17.5px]">
              {item.title}
            </div>
            <p className="font-raleway text-[13.5px] leading-relaxed text-[#0a3547]/70 sm:text-[14.5px]">
              {item.description}
            </p>
          </div>
          <div
            className={`${styles.accent} absolute inset-x-5 bottom-0 h-[3px] rounded-t-[3px] bg-[#37738d] sm:inset-x-[34px]`}
          />
        </div>
      ))}
    </div>
  );
}

export default LoyaltyProgramCards;

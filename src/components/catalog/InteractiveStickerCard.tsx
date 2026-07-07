"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import styles from "./InteractiveStickerCard.module.css";

/**
 * Sticker cursor cycle. The reference's "sticker.png" maps to the
 * existing asset `sticker3.png` in /public/images.
 */
const STICKERS = [
  "/images/sticker1.png",
  "/images/sticker2.png",
  "/images/sticker3.png",
];

const MAX_STICKERS = 9;
/** Sticker size as a fraction of the card width. */
const STICKER_RATIO = 0.17;
/** Delay (ms) before the sticker cursor appears on hover. */
const CURSOR_DELAY = 650;
/** Maximum tilt (deg) based on horizontal pointer position inside the card. */
const MAX_TILT = 8;

type Placed = {
  id: number;
  src: string;
  xPct: number;
  yPct: number;
  rot: number;
};

interface InteractiveStickerCardProps {
  className?: string;
  /** Optional: fired after each sticker is placed, with the new total count. */
  onStickerPlaced?: (count: number) => void;
}

export function InteractiveStickerCard({
  className,
  onStickerPlaced,
}: InteractiveStickerCardProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const cursorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idRef = useRef(0);

  const [isMobile, setIsMobile] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [cursorReady, setCursorReady] = useState(false);
  const [cursorIndex, setCursorIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [placed, setPlaced] = useState<Placed[]>([]);

  const full = placed.length >= MAX_STICKERS;
  const showCursor = !isMobile && hovering && cursorReady && !full;

  // Detect coarse/hover-less pointers (mobile) — feature detection, not width.
  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Track card width so stickers/cursor stay proportional and responsive.
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setCardWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (cursorTimer.current) clearTimeout(cursorTimer.current);
    };
  }, []);

  const handleEnter = useCallback(() => {
    if (isMobile) return;
    setHovering(true);
    if (cursorTimer.current) clearTimeout(cursorTimer.current);
    cursorTimer.current = setTimeout(() => setCursorReady(true), CURSOR_DELAY);
  }, [isMobile]);

  const handleLeave = useCallback(() => {
    if (isMobile) return;
    setHovering(false);
    setCursorReady(false);
    if (cursorTimer.current) clearTimeout(cursorTimer.current);
  }, [isMobile]);

  const handleZoneMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (isMobile) return;
      const zone = zoneRef.current;
      if (!zone) return;
      const r = zone.getBoundingClientRect();
      setPointer({ x: e.clientX - r.left, y: e.clientY - r.top });

      // Tilt based on horizontal position within the card (left/right).
      const card = cardRef.current;
      if (card) {
        const cr = card.getBoundingClientRect();
        const frac = ((e.clientX - cr.left) / cr.width) * 2 - 1; // -1 .. 1
        setRotation(Math.max(-1, Math.min(1, frac)) * MAX_TILT);
      }
    },
    [isMobile],
  );

  const handleCardClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (isMobile || full) return;
      const card = cardRef.current;
      if (!card) return;
      const r = card.getBoundingClientRect();

      const halfW = (r.width * STICKER_RATIO) / 2;
      const halfH = (r.width * STICKER_RATIO) / 2; // stickers ~square

      const clampedX = Math.min(Math.max(e.clientX - r.left, halfW), r.width - halfW);
      const clampedY = Math.min(Math.max(e.clientY - r.top, halfH), r.height - halfH);

      const src = STICKERS[cursorIndex];
      idRef.current += 1;
      setPlaced((prev) => [
        ...prev,
        {
          id: idRef.current,
          src,
          xPct: (clampedX / r.width) * 100,
          yPct: (clampedY / r.height) * 100,
          rot: rotation,
        },
      ]);
      setCursorIndex((i) => (i + 1) % STICKERS.length);
      onStickerPlaced?.(idRef.current);
    },
    [isMobile, full, cursorIndex, rotation, onStickerPlaced],
  );

  const cursorSize = Math.max(cardWidth * STICKER_RATIO, 1);

  return (
    <div
      ref={zoneRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleZoneMove}
      className={`relative inline-flex items-center justify-center p-8 sm:p-12 ${className ?? ""}`}
      style={{ cursor: !isMobile && hovering && !full ? "none" : undefined }}
    >
      <div
        ref={cardRef}
        onClick={handleCardClick}
        className={`${styles.card} ${hovering && !isMobile ? styles.isHover : ""} ${
          isMobile ? styles.autoPulse : ""
        } w-[min(88vw,400px)] aspect-[350/235] ${!isMobile && !full ? "cursor-pointer" : ""}`}
        role="img"
        aria-label="Tarjeta interactiva Socado"
      >
        {/* Full-bleed card image */}
        <Image
          src="/images/card.png"
          alt=""
          fill
          sizes="(max-width: 640px) 88vw, 400px"
          className="object-cover"
          draggable={false}
        />

        {/* Placed stickers */}
        {placed.map((s) => (
          <img
            key={s.id}
            src={s.src}
            alt=""
            aria-hidden
            draggable={false}
            className="pointer-events-none absolute select-none"
            style={{
              left: `${s.xPct}%`,
              top: `${s.yPct}%`,
              width: `${STICKER_RATIO * 100}%`,
              height: "auto",
              transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
            }}
          />
        ))}
      </div>

      {/* Floating sticker "cursor" (desktop only) */}
      {showCursor && (
        <img
          src={STICKERS[cursorIndex]}
          alt=""
          aria-hidden
          draggable={false}
          className={`${styles.cursor} pointer-events-none absolute z-10 select-none drop-shadow-md`}
          style={{
            left: pointer.x,
            top: pointer.y,
            width: cursorSize,
            height: "auto",
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          }}
        />
      )}
    </div>
  );
}

export default InteractiveStickerCard;

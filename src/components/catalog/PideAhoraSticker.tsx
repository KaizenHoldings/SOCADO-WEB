"use client";

import { useState } from "react";
import Image from "next/image";

interface PideAhoraStickerProps {
  onClick: () => void;
}

export function PideAhoraSticker({ onClick }: PideAhoraStickerProps) {
  const [hoverState, setHoverState] = useState({ px: 0, py: 0, hover: false });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const px = (e.clientX - cx) / (rect.width / 2);
    const py = (e.clientY - cy) / (rect.height / 2);
    setHoverState({
      px: Math.max(-1, Math.min(1, px)),
      py: Math.max(-1, Math.min(1, py)),
      hover: true,
    });
  };

  const onLeave = () => setHoverState({ px: 0, py: 0, hover: false });

  const { px, py, hover } = hoverState;
  const strength = hover ? 1 : 0;
  const moveX = px * 12 * strength;
  const moveY = py * 12 * strength;
  const rotate = px * 6 * strength;
  const scale = hover ? 1.05 : 1;
  const mag = Math.min(1, (Math.abs(px) + Math.abs(py)) / 1.2);

  const idlePlay = hover ? "paused" : "running";
  const buttonTransform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg) scale(${scale})`;
  const shadowTransform = `translate(${moveX * 0.5}px, ${moveY * 0.3 + 4}px) scale(${1 + strength * 0.06})`;
  const holoPos = `${50 + px * 48}% ${50 + py * 48}%`;
  const holoOpacity = 0.22 + mag * 0.6 * strength;
  const sheenPos = `${100 - (px * 0.5 + 0.5) * 100}% ${100 - (py * 0.5 + 0.5) * 100}%`;
  const sheenOpacity = (0.12 + mag * 0.5) * strength;

  return (
    <>
      <style>{`
        @keyframes sticker-idle-float {
          0%, 86%, 100% { transform: translateY(0) rotate(-1.2deg); }
          43% { transform: translateY(-9px) rotate(1.2deg); }
          90% { transform: translateY(-3px) rotate(45deg); }
          94% { transform: translateY(-3px) rotate(-45deg); }
          97% { transform: translateY(-3px) rotate(45deg); }
        }
        @keyframes sticker-idle-shadow {
          0%, 86%, 100% { transform: scale(1); opacity: 0.55; }
          43% { transform: scale(0.88); opacity: 0.38; }
          90%, 97% { transform: scale(0.95); opacity: 0.45; }
        }
        @keyframes sticker-auto-sheen {
          0% { background-position: 120% 120%; opacity: 0; }
          15% { opacity: 0.85; }
          50% { background-position: -20% -20%; opacity: 0; }
          100% { background-position: -20% -20%; opacity: 0; }
        }
      `}</style>
      <div
        className="fixed bottom-6 right-6 z-[90] flex items-center justify-center pointer-events-none"
        style={{
          width: "230px",
          height: "368px",
          transformOrigin: "bottom right",
          transform: "scale(0.33)", // scales the ~368px height down to ~121px
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "0%", // Adjusted since wrapper is smaller now
            left: "22%",
            width: "150px",
            height: "28px",
            animation: "sticker-idle-shadow 7s ease-in-out infinite",
            animationPlayState: idlePlay,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "oklch(0.10 0.05 260 / 0.5)",
              filter: "blur(8px)",
              transform: shadowTransform,
            }}
          ></div>
        </div>

        <div
          style={{
            animation: "sticker-idle-float 7s ease-in-out infinite",
            animationPlayState: idlePlay,
            pointerEvents: "auto",
          }}
        >
          <button
            onClick={onClick}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
              position: "relative",
              border: "none",
              padding: 0,
              background: "transparent",
              cursor: "pointer",
              width: "230px",
              height: "368px",
              transform: buttonTransform,
              transition: "transform 60ms ease-out",
              filter:
                "drop-shadow(3px 0 0 white) drop-shadow(-3px 0 0 white) drop-shadow(0 3px 0 white) drop-shadow(0 -3px 0 white) drop-shadow(0 20px 20px oklch(0.10 0.06 260 / 0.55))",
            }}
            aria-label="pide ahora"
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                WebkitMask: "url(/images/bolsa_sticker.svg) center/contain no-repeat",
                mask: "url(/images/bolsa_sticker.svg) center/contain no-repeat",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(160deg, oklch(0.66 0.16 246), oklch(0.52 0.20 251) 55%, oklch(0.44 0.18 255))",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "repeating-linear-gradient(115deg, hsla(0,90%,65%,0.6) 0%, hsla(45,95%,60%,0.6) 6%, hsla(140,90%,55%,0.6) 13%, hsla(195,95%,60%,0.6) 20%, hsla(255,90%,65%,0.6) 27%, hsla(320,90%,65%,0.6) 34%)",
                  backgroundSize: "220% 220%",
                  backgroundPosition: holoPos,
                  mixBlendMode: "screen",
                  opacity: holoOpacity,
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(115deg, transparent 40%, oklch(0.99 0.02 250 / 0.9) 50%, transparent 60%)",
                  backgroundSize: "300% 300%",
                  backgroundPosition: sheenPos,
                  mixBlendMode: "screen",
                  opacity: sheenOpacity,
                }}
              ></div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(115deg, transparent 42%, oklch(0.98 0.02 250 / 0.75) 50%, transparent 58%)",
                  backgroundSize: "300% 300%",
                  mixBlendMode: "screen",
                  opacity: 0,
                  animation: "sticker-auto-sheen 5s ease-in-out infinite",
                }}
              ></div>
            </div>
            <Image
              src="/images/bolsa_sticker.svg"
              alt="bolsa sticker Socado"
              fill
              style={{ objectFit: "contain", pointerEvents: "none", opacity: 0.9 }}
            />
          </button>
        </div>
      </div>
    </>
  );
}

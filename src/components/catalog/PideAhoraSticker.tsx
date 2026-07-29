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
  const scale = hover ? 0.99 : 1;
  const mag = Math.min(1, (Math.abs(px) + Math.abs(py)) / 1.2);
  const shOp = 0.45;
  const shBlur = 16;
  
  // Hardcoded values from sticker_final.html defaults
  const floatDuration = "4.5s";
  const swingDuration = "5.5s";
  const swingAmount = 1;

  const idlePlay = hover ? "paused" : "running";
  const swingPlay = hover ? "paused" : "running";
  
  const buttonTransform = `translate(${moveX * 0.4}px, ${moveY * 0.4}px) rotateX(${py * 16 * strength}deg) rotateY(${-px * 16 * strength}deg) scale(${scale}) translateZ(${strength * -12}px)`;
  const buttonFilter = `drop-shadow(${-moveX * 1.2}px ${16 - strength * 10 - moveY}px ${Math.max(0, shBlur - strength * 10)}px oklch(0.10 0.06 260 / ${Math.max(0, shOp - strength * 0.15)}))`;
  const shadowTransform = `translate(${moveX * 0.5}px, ${moveY * 0.3 + 4}px) scale(${1 - strength * 0.06})`;
  const holoPos = `${50 + px * 48}% ${50 + py * 48}%`;
  const holoOpacity = 0.15 + mag * 0.45 * strength;
  const sheenPos = `${100 - (px * 0.5 + 0.5) * 100}% ${100 - (py * 0.5 + 0.5) * 100}%`;
  const sheenOpacity = (0.12 + mag * 0.5) * strength;

  return (
    <>
      <style>{`
        @keyframes sticker-idle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3.5%); }
        }
        @keyframes sticker-idle-shadow {
          0%, 100% { transform: scale(1); opacity: 0.45; }
          50% { transform: scale(0.9); opacity: 0.3; }
        }
        @keyframes sticker-idle-swing {
          0%, 100% { transform: rotate(calc(var(--sw, 1) * -1.5deg)); }
          15% { transform: rotate(calc(var(--sw, 1) * 1.8deg)); }
          30% { transform: rotate(calc(var(--sw, 1) * -1.2deg)); }
          45% { transform: rotate(calc(var(--sw, 1) * 0.8deg)); }
          60% { transform: rotate(calc(var(--sw, 1) * -0.4deg)); }
          80% { transform: rotate(calc(var(--sw, 1) * -1deg)); }
          96% { transform: rotate(calc(var(--sw, 1) * 0.4deg)); }
        }
        @keyframes sticker-auto-sheen {
          0% { background-position: 120% 120%; opacity: 0; }
          15% { opacity: 0.85; }
          50% { background-position: -20% -20%; opacity: 0; }
          100% { background-position: -20% -20%; opacity: 0; }
        }
      `}</style>
      
      {/* Container simulating the stage */}
      <div
        className="fixed bottom-6 right-6 z-[90] flex items-center justify-center pointer-events-none"
        style={{
          width: "200px", // bounded container for the bottom corner
          height: "250px",
          transformOrigin: "bottom right",
          transform: "scale(0.35)", // make it smaller to match previous sticker size
        }}
      >
        <div style={{ position: "relative", width: "380px", height: "420px", display: "flex", alignItems: "center", justifyContent: "center", perspective: "800px" }}>
          
          {/* Shadow */}
          <div style={{ position: "absolute", bottom: "6%", left: "20%", width: "200px", height: "30px", animation: "sticker-idle-shadow 4.5s ease-in-out infinite", animationPlayState: idlePlay }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "oklch(0.10 0.05 260)", opacity: 0, filter: "blur(9px)", transform: shadowTransform }}></div>
          </div>
          
          {/* Swing wrapper */}
          <div style={{ transformOrigin: "50% 8%", "--sw": swingAmount } as React.CSSProperties & { "--sw": number }} className="swing-wrapper">
            <style>{`
              .swing-wrapper {
                animation: sticker-idle-swing linear infinite;
                animation-duration: ${swingDuration};
                animation-timing-function: ease-in-out;
                animation-play-state: ${swingPlay};
              }
            `}</style>
            
            {/* Float wrapper */}
            <div style={{ animation: "sticker-idle-float ease-in-out infinite", animationDuration: floatDuration, animationPlayState: idlePlay }}>
              
              <button
                onClick={onClick}
                onMouseMove={onMove}
                onMouseLeave={onLeave}
                className="pointer-events-auto"
                style={{
                  position: "relative", border: "none", padding: 0, background: "transparent", cursor: "pointer", width: "300px", height: "328px",
                  transform: buttonTransform, transformStyle: "preserve-3d", transition: "transform 140ms cubic-bezier(0.2, 0.8, 0.3, 1)", filter: buttonFilter
                }}
              >
                <Image
                  src="/images/sticker_final.svg"
                  alt="bolsa de café Socado - pide aquí"
                  fill
                  style={{ objectFit: "contain", pointerEvents: "none" }}
                  priority
                />
                
                {/* Holographic effects with mask */}
                <div style={{
                  position: "absolute", inset: 0,
                  WebkitMask: `url("/images/sticker_final_mask.png") center/contain no-repeat`,
                  mask: `url("/images/sticker_final_mask.png") center/contain no-repeat`
                }}>
                  <div style={{
                    position: "absolute", inset: 0,
                    backgroundImage: "repeating-linear-gradient(115deg, hsla(200,60%,70%,0.45) 0%, hsla(220,50%,75%,0.45) 8%, hsla(180,45%,72%,0.45) 17%, hsla(240,40%,75%,0.45) 26%, hsla(200,60%,70%,0.45) 34%)",
                    backgroundSize: "220% 220%",
                    backgroundPosition: holoPos, mixBlendMode: "screen", opacity: holoOpacity
                  }}></div>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(115deg, transparent 40%, oklch(0.99 0.02 250 / 0.9) 50%, transparent 60%)",
                    backgroundSize: "300% 300%",
                    backgroundPosition: sheenPos, mixBlendMode: "screen", opacity: sheenOpacity
                  }}></div>
                  <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(115deg, transparent 42%, oklch(0.98 0.02 250 / 0.75) 50%, transparent 58%)",
                    backgroundSize: "300% 300%", mixBlendMode: "screen", opacity: 0,
                    animation: "sticker-auto-sheen 5s ease-in-out infinite"
                  }}></div>
                </div>
              </button>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

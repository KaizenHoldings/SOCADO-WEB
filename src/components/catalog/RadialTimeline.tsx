"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, MotionValue } from "framer-motion";
import { timelineData } from "./Timeline";

export function RadialTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [radius, setRadius] = useState(300);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const mouseX = useMotionValue(Infinity);
  const mouseY = useMotionValue(Infinity);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    }
  };

  const handleMouseLeave = () => {
    mouseX.set(Infinity);
    mouseY.set(Infinity);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left - rect.width / 2;
      const clickY = e.clientY - rect.top - rect.height / 2;

      let closestIndex = -1;
      let minDistance = 150; // Max click range matches the visual proximity range

      timelineData.forEach((_, index) => {
        const angle = (index * (2 * Math.PI)) / timelineData.length - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        const dist = Math.sqrt(Math.pow(clickX - x, 2) + Math.pow(clickY - y, 2));
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = index;
        }
      });

      if (closestIndex !== -1) {
        setActiveIndex(closestIndex);
      }
    }
  };

  // Re-calculate radius on mount and window resize
  useEffect(() => {
    const updateRadius = () => {
      if (containerRef.current) {
        // We use slightly less than half of the minimum dimension to leave room for the labels
        const minDim = Math.min(containerRef.current.clientWidth, containerRef.current.clientHeight);
        setRadius((minDim / 2) * 0.75);
      }
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const totalPoints = timelineData.length;
  const [introPhase, setIntroPhase] = useState<"idle" | "drawing" | "erasing" | "finished">("idle");

  // Re-trigger the animation whenever the section comes into view
  useEffect(() => {
    if (isInView && introPhase === "idle") {
      setIntroPhase("drawing");
    } else if (!isInView && introPhase !== "idle") {
      setIntroPhase("idle");
      setActiveIndex(0);
    }
  }, [isInView, introPhase]);

  return (
    <section 
      ref={containerRef} 
      id="radial-timeline" 
      className="relative h-[100vh] min-h-[800px] w-full bg-black overflow-hidden flex items-center justify-center font-raleway cursor-crosshair md:cursor-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Background Video */}
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src="/videos/people.webm" type="video/webm" />
        </video>
        {/* Dark overlay requested by user */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <motion.div 
        className="absolute top-16 w-full text-center z-10 pointer-events-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
      </motion.div>

      {/* Main Circle Ring & Progress Arc */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <svg 
          width={radius * 2} 
          height={radius * 2} 
          viewBox={`0 0 ${radius * 2} ${radius * 2}`} 
          className="overflow-visible"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Faint background circle */}
          <circle 
            cx={radius} 
            cy={radius} 
            r={radius} 
            fill="none" 
            stroke="rgba(255,255,255,0.15)" 
            strokeWidth="1" 
          />
          {/* Active Progress Arc */}
          <motion.circle 
            cx={radius} 
            cy={radius} 
            r={radius} 
            fill="none" 
            stroke="#b45b38"
            strokeWidth="3" 
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 10px rgba(180,91,56,0.8))" }}
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: introPhase === "drawing" ? 1 : introPhase === "erasing" ? 0 : (activeIndex + 1) / totalPoints
            }}
            transition={{ 
              duration: introPhase === "drawing" ? 1.5 : introPhase === "erasing" ? 1 : 0.8,
              ease: "easeInOut" 
            }}
            onAnimationComplete={() => {
              if (introPhase === "drawing") {
                setIntroPhase("erasing");
              } else if (introPhase === "erasing") {
                setIntroPhase("finished");
              }
            }}
          />
        </svg>
      </motion.div>

      {/* Dots and Labels */}
      <AnimatePresence>
        {introPhase === "finished" && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.15 }
              }
            }}
          >
            {timelineData.map((item, index) => {
              const angle = (index * (2 * Math.PI)) / totalPoints - Math.PI / 2;
              const isActive = activeIndex === index;

              return (
                <ProximityDot 
                  key={index}
                  item={item}
                  angle={angle}
                  radius={radius}
                  isActive={isActive}
                  mouseX={mouseX}
                  mouseY={mouseY}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Central Content Area */}
      <motion.div 
        className="relative z-10 max-w-lg text-center px-6 pointer-events-none"
      >
        <AnimatePresence mode="wait">
          {introPhase !== "finished" ? (
            <motion.div
              key="intro"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center"
            >
              <h2 className="text-white text-4xl md:text-6xl font-bold uppercase tracking-widest leading-tight">
                Social<br/>Café<br/><span className="text-celeste-socado">Conectado</span>
              </h2>
            </motion.div>
          ) : (
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-terra text-xl font-bold font-outfit mb-2 tracking-widest">{timelineData[activeIndex].year}</h3>
              <h2 className="text-white text-3xl md:text-5xl font-bold uppercase tracking-wider mb-6 leading-tight">
                {timelineData[activeIndex].title}
              </h2>
              <p className="text-white/80 font-outfit text-base leading-relaxed mb-8">
                {timelineData[activeIndex].description}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function ProximityDot({
  item,
  angle,
  radius,
  isActive,
  mouseX,
  mouseY
}: {
  item: typeof timelineData[0];
  angle: number;
  radius: number;
  isActive: boolean;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  // Calculate distance from mouse to this dot's fixed position
  const distance = useTransform(() => {
    const mx = mouseX.get();
    const my = mouseY.get();
    if (mx === Infinity) return 500; // Far away if mouse is outside
    return Math.sqrt(Math.pow(mx - x, 2) + Math.pow(my - y, 2));
  });

  // Map distance (0 to 150px) to opacity (1 to 0.4) and scale (1.25 to 1)
  const dotOpacity = useTransform(distance, [0, 150], [1, 0.4], { clamp: true });
  const dotScale = useTransform(distance, [0, 150], [1.25, 1], { clamp: true });
  const labelOpacity = useTransform(distance, [0, 120], [1, 0], { clamp: true });

  return (
    <motion.div
      variants={{
        hidden: { x: 0, y: 0, opacity: 0, scale: 0 },
        visible: { x, y, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50, damping: 15 } }
      }}
      className="absolute z-20 flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="relative flex items-center justify-center w-12 h-12">
        {isActive ? (
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute flex items-center justify-center w-9 h-9 rounded-full border-[1.5px] border-[#5c8ea0]"
          >
            <div className="w-3 h-3 rounded-full bg-terra shadow-[0_0_12px_rgba(180,91,56,0.8)]" />
          </motion.div>
        ) : (
          <motion.div 
            className="absolute w-3 h-3 rounded-full bg-white" 
            style={{ opacity: dotOpacity, scale: dotScale }}
          />
        )}
      </div>
      
      {/* Label near the point */}
      <motion.div 
        className={`absolute whitespace-nowrap ${
          isActive ? "text-terra font-bold scale-110" : "text-white font-medium"
        }`}
        style={{
          transform: `translate(${Math.cos(angle) * 40}px, ${Math.sin(angle) * 40}px)`,
          opacity: isActive ? 1 : labelOpacity,
        }}
      >
        {item.year}
      </motion.div>
    </motion.div>
  );
}

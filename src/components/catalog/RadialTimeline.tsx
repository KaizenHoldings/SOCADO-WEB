"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { timelineData } from "./Timeline";
import { ArrowRight } from "lucide-react";

export function RadialTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [radius, setRadius] = useState(300);
  const containerRef = useRef<HTMLDivElement>(null);

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

  return (
    <section ref={containerRef} id="radial-timeline" className="relative h-[100vh] min-h-[800px] w-full bg-black overflow-hidden flex items-center justify-center font-raleway">
      {/* Background Video */}
      <div className="absolute inset-0 h-full w-full pointer-events-none">
        <video autoPlay loop muted playsInline className="h-full w-full object-cover">
          <source src="/videos/inicioHero.mp4" type="video/webm" />
          <source src="/videos/inicioHero.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay requested by user */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="absolute top-16 w-full text-center z-10 pointer-events-none">
        <h2 className="text-ivory font-raleway text-3xl uppercase tracking-[0.2em] opacity-80">Nuestra Historia</h2>
      </div>

      {/* Main Circle Ring */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="absolute rounded-full border border-white/20 pointer-events-none"
        style={{ width: radius * 2, height: radius * 2 }}
      />

      {/* Dots and Labels */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 }
          }
        }}
      >
        {timelineData.map((item, index) => {
          // Calculate angle for this point (starting from top, so -PI/2)
          const angle = (index * (2 * Math.PI)) / totalPoints - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isActive = activeIndex === index;

          return (
            <motion.div
              key={index}
              variants={{
                hidden: { x: 0, y: 0, opacity: 0, scale: 0 },
                visible: { x, y, opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50, damping: 15 } }
              }}
              className="absolute z-20 flex flex-col items-center justify-center cursor-pointer group"
              onClick={() => setActiveIndex(index)}
            >
              {/* Outer interactive hit area */}
              <div className="p-4 rounded-full">
                <div 
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    isActive ? "bg-terra scale-150 shadow-[0_0_15px_rgba(180,91,56,0.8)]" : "bg-white/40 group-hover:bg-white group-hover:scale-125"
                  }`} 
                />
              </div>
              
              {/* Label near the point */}
              <div 
                className={`absolute transition-all duration-500 whitespace-nowrap ${
                  isActive ? "text-terra font-bold scale-110 opacity-100" : "text-white/60 font-medium opacity-0 group-hover:opacity-100"
                }`}
                style={{
                  // Position the text slightly further out from the center radially
                  transform: `translate(${Math.cos(angle) * 40}px, ${Math.sin(angle) * 40}px)`
                }}
              >
                {item.year}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Central Content Area */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-lg text-center px-6"
      >
        <AnimatePresence mode="wait">
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
            {/* Opcional: botón de ver más si el contenido fuera externo */}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

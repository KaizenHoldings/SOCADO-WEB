"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";

export const timelineData = [
  {
    year: "2018",
    title: "STARTED WITH AN IDEA",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop"
  },
  {
    year: "2019",
    title: "THE \"AHA!\" MOMENT",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&auto=format&fit=crop"
  },
  {
    year: "2020",
    title: "OUR FIRST LOCATION",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop"
  },
  {
    year: "2021",
    title: "CATERING SERVICE LAUNCH",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop"
  },
  {
    year: "2023",
    title: "SOCADO COMMUNITY GROWS",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=600&auto=format&fit=crop"
  }
];

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fillPercentage, setFillPercentage] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!containerRef.current) {
            ticking = false;
            return;
          }
          const container = containerRef.current;
          const containerRect = container.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          
          // Trigger un poco por debajo de la mitad de la pantalla para dar tiempo de lectura
          const startTrigger = windowHeight / 2 + 50; 
          
          const items = container.querySelectorAll('.timeline-item');
          const circles = container.querySelectorAll('.timeline-circle');
          
          let activeIndex = -1;
          
          items.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            if (rect.top < startTrigger) {
              activeIndex = index;
            }
          });
          
          if (activeIndex >= 0 && circles[activeIndex]) {
            const activeCircle = circles[activeIndex];
            const circleRect = activeCircle.getBoundingClientRect();
            
            // Distancia desde el tope del contenedor hasta el centro del círculo activo
            let fillHeightPixels = (circleRect.top - containerRect.top) + (circleRect.height / 2);

            if (activeIndex === items.length - 1) {
              const scrollPastCenter = startTrigger - (circleRect.top + circleRect.height / 2);
              if (scrollPastCenter > 0) {
                // Multiplicamos para que la línea se dibuje más rápido hacia el final
                fillHeightPixels += scrollPastCenter * 2;
              }
              // Asegurar que se complete al 100% si el contenedor ya está terminando de pasar
              if (containerRect.bottom <= startTrigger + 100) {
                fillHeightPixels = containerRect.height;
              }
            }
            
            let percentage = (fillHeightPixels / containerRect.height) * 100;
            
            percentage = Math.max(0, Math.min(100, percentage));
            setFillPercentage(percentage);
          } else {
            setFillPercentage(0);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="historia" className="relative bg-ivory py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-12 relative z-10">
        <div className="text-center mb-4">
          <h2 className="font-raleway text-4xl md:text-5xl font-bold tracking-tight text-azul-socado uppercase">
            Timeline
          </h2>
        </div>

        {/* Paper Plane Trail Before Timeline */}
        <div className="relative w-full h-[80px] md:h-[100px] pointer-events-none z-0 hidden md:block opacity-60">
          <svg viewBox="0 0 1000 160" className="w-full h-full text-terra" preserveAspectRatio="xMidYMid meet">
            <defs>
              <mask id="dash-mask-timeline">
                <motion.path
                  d="M 50 110 C 200 140, 360 140, 400 80 C 440 20, 360 20, 400 80 C 440 140, 750 140, 930 70"
                  stroke="white"
                  strokeWidth="10"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.9, ease: "easeInOut" }}
                />
              </mask>
            </defs>
            <path
              d="M 50 110 C 200 140, 360 140, 400 80 C 440 20, 360 20, 400 80 C 440 140, 750 140, 930 70"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray="10 10"
              strokeLinecap="round"
              fill="none"
              mask="url(#dash-mask-timeline)"
            />
            {/* Plane Icon at the end */}
            <motion.g
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ delay: 0.95, duration: 0.1 }}
              transform="translate(905, 45) rotate(0, 10, 10) scale(2.5)"
            >
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m1.5 9l16-6.535L14.7 17zm16-6.5l-11 10m0 0v5l3-3" />
            </motion.g>
          </svg>
        </div>

        <div className="relative w-full py-10" ref={containerRef}>
          {/* Central dashed line (background) */}
          <div className="absolute left-[40px] md:left-1/2 top-0 bottom-0 w-[2px] border-l-[3px] border-dashed border-gris-metropolis/40 -translate-x-1/2" />
          
          {/* Active solid line (foreground) */}
          <div 
            className="absolute left-[40px] md:left-1/2 top-0 w-[3px] bg-terra -translate-x-1/2 origin-top transition-all duration-500 ease-out z-0"
            style={{ height: `${fillPercentage}%` }}
          />

          {timelineData.map((item, index) => {
            const isLeftText = index % 2 !== 0;
            return (
              <div 
                key={index} 
                className="timeline-item relative flex flex-col md:flex-row items-center justify-between w-full mb-20 md:mb-32 group"
              >
                {/* Center dot */}
                <div className="timeline-circle absolute left-[40px] md:left-1/2 top-0 md:top-1/2 w-6 h-6 rounded-full border-4 border-amarillo-tostado bg-ivory -translate-x-1/2 md:-translate-y-1/2 z-10 mt-6 md:mt-0 shadow-md transition-transform duration-300 group-hover:scale-125 group-hover:border-terra" />

                {/* TEXT SECTION */}
                <div className={`w-full md:w-[45%] pl-[90px] md:pl-0 mt-2 md:mt-0 ${
                  isLeftText 
                    ? 'md:order-1 md:text-right md:pr-16' 
                    : 'md:order-2 md:text-left md:pl-16'
                }`}>
                  <TimelineText item={item} />
                </div>

                {/* IMAGE SECTION */}
                <div className={`w-full md:w-[45%] pl-[90px] md:pl-0 mt-8 md:mt-0 ${
                  isLeftText 
                    ? 'md:order-2 md:flex md:justify-start md:pl-16' 
                    : 'md:order-1 md:flex md:justify-end md:pr-16'
                }`}>
                  <TimelineImage item={item} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineText({ item }: { item: typeof timelineData[0] }) {
  const textRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 80%", "center 90%"]
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(-50% 50% -50% 50%)", "inset(-50% -20% -50% -20%)"]
  );

  return (
    <motion.div 
      ref={textRef} 
      style={{ clipPath }}
      className="transition-all duration-500 hover:-translate-y-2"
    >
      <h3 className="font-outfit italic font-bold text-2xl md:text-3xl text-terra mb-2">
        {item.year}
      </h3>
      <h2 className="font-raleway text-2xl md:text-3xl font-bold text-azul-socado uppercase tracking-wider mb-5 leading-tight">
        {item.title}
      </h2>
      <p className="font-outfit text-gris-metropolis text-base md:text-lg leading-relaxed">
        {item.description}
      </p>
    </motion.div>
  );
}

function TimelineImage({ item }: { item: typeof timelineData[0] }) {
  const imageRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start 95%", "center 75%"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

  return (
    <div ref={imageRef} className="relative w-[220px] h-[220px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] rounded-full overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-105 border-8 border-white/50">
      
      {/* Blurred Background Image */}
      <div className="absolute inset-0 h-full w-full">
        <Image 
          src={item.image} 
          alt={`${item.title} blur`} 
          fill
          className="object-cover blur-md scale-125"
          sizes="(max-width: 768px) 220px, (max-width: 1024px) 320px, 380px"
        />
      </div>

      {/* Foreground Animated Image */}
      <motion.div style={{ opacity, scale }} className="absolute inset-0 h-full w-full z-10">
        <Image 
          src={item.image} 
          alt={item.title} 
          fill
          className="object-cover"
          sizes="(max-width: 768px) 220px, (max-width: 1024px) 320px, 380px"
        />
      </motion.div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export function HowItWorksCatering() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isHoveredManually, setIsHoveredManually] = useState<boolean>(false);

  const steps = [
    {
      number: 1,
      title: "selecciona tipo de catering",
      description: "identifica el tipo de pedido ideal para tu evento. boxes individuales o para compartir."
    },
    {
      number: 2,
      title: "solicita un presupuesto",
      description: "rellena nuestro sencillo formulario de pedido personalizado o configura una box para indicarnos lo que necesitas."
    },
    {
      number: 3,
      title: "recibe un presupuesto",
      description: "envía una cotización y la información del evento y nuestro equipo te enviará un presupuesto detallado en función de tus necesidades específicas."
    },
    {
      number: 4,
      title: "disfruta de los productos",
      description: "disfruta de tu pedido sin preocupaciones."
    },
  ];

  // Auto-ciclo de pasos cada 3.5 segundos
  useEffect(() => {
    if (isHoveredManually) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isHoveredManually, steps.length]);

  return (
    <section className="flex flex-col justify-start w-full px-6 pt-20 pb-14 md:min-h-screen md:justify-center md:pt-32 md:pb-24 lg:py-32 lg:px-12 text-[#063547]">
      <div className="mx-auto max-w-[1400px] w-full">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="font-raleway text-4xl md:text-5xl font-light text-[#063547] dark:text-white">
            cómo funciona
          </h2>
        </div>
        
        {/*
          Mobile: all four steps sit side by side in one row, each taking an
          equal share of the width, so the whole section fits on one screen
          without scrolling. From `md` up the original spacing is restored.
        */}
        <div className="relative flex w-full flex-row items-start justify-between gap-2 md:gap-4">

          {steps.map((step, index) => {
            const isActive = activeStep === index;
            const isDimmed = !isActive;
            
            return (
              <div 
                key={index} 
                className={`relative z-10 flex flex-1 min-w-0 flex-col items-center text-center opacity-100 scale-100 transition-all duration-500 cursor-default md:w-full md:mx-auto ${
                  isDimmed
                    ? 'md:opacity-40 md:grayscale md:scale-95'
                    : 'md:opacity-100 md:scale-105'
                }`}
                onMouseEnter={() => {
                  setActiveStep(index);
                  setIsHoveredManually(true);
                }}
                onMouseLeave={() => setIsHoveredManually(false)}
              >
                {/* Círculo Numerado */}
                <div className={`w-10 h-10 text-base border-2 mb-2 md:w-20 md:h-20 md:text-4xl md:border-4 md:mb-6 rounded-full flex items-center justify-center font-black text-white border-white/20 transition-colors duration-500 ${isActive ? 'bg-[#b45b38]' : 'bg-[#5c8ea0]'}`}>
                  {step.number}
                </div>
                
                {/* Título y Descripción */}
                <h3 className={`font-raleway text-[10px] px-0 tracking-normal md:text-lg md:px-4 md:tracking-wider font-bold lowercase mb-1 md:mb-4 leading-tight md:min-h-[48px] flex items-center justify-center text-center transition-colors duration-500 ${isActive ? 'text-[#b45b38]' : 'text-[#063547] dark:text-[#f2eae6]'}`}>
                  {step.title}
                </h3>
                {/* Hidden on mobile to keep the carousel compact; unchanged from md up. */}
                <p className="hidden md:block text-sm font-medium text-[#5c8ea0] dark:text-[#b2b5a9] leading-relaxed max-w-[280px]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

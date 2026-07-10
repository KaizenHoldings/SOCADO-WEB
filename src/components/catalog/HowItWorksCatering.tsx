import React, { useState } from 'react';

export function HowItWorksCatering() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      number: 1,
      title: "Selecciona tipo de catering",
      description: "Identifica el tipo de pedido ideal para tu evento. Boxes individuales o para compartir."
    },
    {
      number: 2,
      title: "Solicita un presupuesto",
      description: "Rellena nuestro sencillo formulario de pedido personalizado o configura una Box para indicarnos lo que necesitas."
    },
    {
      number: 3,
      title: "Reciba un presupuesto",
      description: "Envíe una cotización y la información del evento y nuestro equipo le enviará un presupuesto detallado en función de sus necesidades específicas."
    },
    {
      number: 4,
      title: "Disfrute de los productos",
      description: "Disfruta de tu pedido sin preocupaciones."
    },
  ];

  return (
    <section className="w-full px-6 lg:px-12 text-azul-socado my-16 lg:my-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center mb-16">
          <h2 className="font-raleway text-4xl md:text-5xl font-bold uppercase tracking-wider text-[#063547] dark:text-white">
            Cómo Funciona
          </h2>
        </div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-4">
          {/* Línea conectora (solo visible en pantallas medianas o grandes) */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] border-t-2 border-dashed border-celeste-socado z-0"></div>

          {steps.map((step, index) => {
            const isDimmed = hoveredStep !== null && hoveredStep !== index;
            const isHovered = hoveredStep === index;
            
            return (
              <div 
                key={index} 
                className={`relative z-10 flex flex-col items-center text-center flex-1 transition-all duration-300 cursor-default ${isDimmed ? 'opacity-40 grayscale' : 'opacity-100'}`}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Círculo Numerado */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl font-black mb-6 text-white border-4 border-white/20 transition-colors duration-300 ${isHovered ? 'bg-[#b45b38]' : 'bg-celeste-socado'}`}>
                  {step.number}
                </div>
                
                {/* Título y Descripción */}
                <h3 className={`font-raleway text-lg font-bold uppercase tracking-wider mb-4 leading-tight min-h-[48px] flex items-center justify-center px-4 transition-colors duration-300 ${isHovered ? 'text-[#b45b38]' : 'text-azul-socado dark:text-ivory'}`}>
                  {step.title}
                </h3>
                <p className="text-sm font-medium text-celeste-socado dark:text-[#b2b5a9] leading-relaxed max-w-[280px]">
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

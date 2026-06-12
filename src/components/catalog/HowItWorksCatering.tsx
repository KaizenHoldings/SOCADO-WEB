import React from 'react';

export function HowItWorksCatering() {
  const steps = [
    {
      number: 1,
      title: "SOLICITA UN PRESUPUESTO",
      description: "Rellena nuestro sencillo formulario de pedido personalizado o configura una Box para indicarnos lo que necesitas."
    },
    
    {
      number: 2,
      title: "RECIBA UN PRESUPUESTO",
      description: "Envíe una cotización y la información del evento y nuestro equipo le enviará un presupuesto detallado en función de sus necesidades específicas."
    },
    {
      number: 3,
      title: "Disfrute de su evento",
      description: "Disfruta de tu pedido sin preocupaciones."
    },

  ];

  return (
    <section className="w-full  px-6 lg:px-12 text-azul-socado   mb-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="text-center mb-16">
          <h2 className="font-raleway text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
            Cómo Funciona
          </h2>
        </div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-start gap-12 md:gap-4">
          {/* Línea conectora (solo visible en pantallas medianas o grandes) */}
          <div className="hidden md:block absolute top-10 left-[10%] right-[10%] border-t-2 border-dashed border-celeste-socado z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center flex-1">
              {/* Círculo Numerado */}
              <div className="w-20 h-20 rounded-full bg-celeste-socado border-4 border-white/20 flex items-center justify-center text-4xl font-black mb-6 text-white bg-blend-overlay" >
                {step.number}
              </div>
              
              {/* Título y Descripción */}
              <h3 className="font-raleway text-lg font-bold uppercase tracking-wider mb-4 leading-tight min-h-[48px] flex items-center justify-center px-4">
                {step.title}
              </h3>
              <p className="text-sm font-medium text-celeste-socado leading-relaxed max-w-[280px]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

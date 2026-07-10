"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store/cart.store";
import { useRouter } from "next/navigation";
import { Header } from "@/components/catalog/Header";
import { Footer } from "@/components/catalog/Footer";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { calculateDiscounts } from "@/lib/utils/discount.utils";
import { LocationPicker } from "@/components/catalog/LocationPicker";
import { CartDrawer } from "@/components/catalog/CartDrawer";

export default function CateringCheckoutPage() {
  const { items, clearCart, discountRules, fetchDiscountRules, taxes, fetchTaxes } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    fetchDiscountRules();
    fetchTaxes();
  }, [fetchDiscountRules, fetchTaxes]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventDate: "",
    guests: "",
    description: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [eventLocation, setEventLocation] = useState({ address: '', lat: 10.4806, lng: -66.9036 });

  // Calcular fecha mínima (2 días después de hoy)
  const today = new Date();
  today.setDate(today.getDate() + 2);
  const minDate = today.toISOString().split("T")[0];

  const { totalOriginal, totalDiscount, totalTax, totalFinal, appliedRules, appliedTaxes } = calculateDiscounts(items, discountRules, taxes);

  // If cart is empty and not success, show empty state
  if (items.length === 0 && !isSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f2eae6] dark:bg-[#042430]">
        <Header activePage="catering" />
        <main className="flex flex-1 flex-col items-center justify-center pt-20 text-center">
          <h2 className="font-raleway text-3xl font-bold text-[#063547] dark:text-[#f2eae6]">Tu carrito está vacío</h2>
          <Link href="/catering" className="mt-6 rounded-full bg-[#b45b38] px-8 py-3 font-bold text-white transition-opacity hover:opacity-90">
            Volver al Catering
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.map(i => ({
            productId: i.product.id,
            name: i.product.name,
            codigo: i.product.codigo,
            quantity: i.quantity,
            price: i.product.price
          })),
          totalOriginal,
          totalDiscount,
          totalTax,
          total: totalFinal,
          eventLocation
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        clearCart();
      } else {
        setError(data.error || 'Ocurrió un error al enviar la cotización.');
      }
    } catch (err) {
      setError('Error de red. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f2eae6] dark:bg-[#042430]">
        <Header activePage="catering" />
        <main className="flex flex-1 flex-col items-center justify-center px-6 pt-20 text-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl dark:bg-[#063547]">
            <CheckCircle2 className="h-12 w-12 text-[#b45b38]" />
          </div>
          <h1 className="mt-8 font-raleway text-4xl font-bold text-[#063547] dark:text-[#f2eae6]">
            ¡Cotización Enviada!
          </h1>
          <p className="mt-4 max-w-lg text-[#6e7c7c] dark:text-[#b2b5a9]">
            Hemos recibido tu solicitud de catering. Nuestro equipo la revisará y se pondrá en contacto contigo pronto al correo <b>{formData.email}</b>.
          </p>
          <Link href="/catering" className="mt-8 rounded-full bg-[#063547] px-8 py-4 font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-[#063547]">
            Volver al Inicio
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-[#042430]">
      <Header activePage="catering" />
      <main className="flex-1 pt-24 pb-16">
        <section className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <Link href="/catering" className="inline-flex items-center gap-2 text-sm font-bold text-[#6e7c7c] hover:text-[#b45b38] dark:text-[#b2b5a9] transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver al menú
          </Link>
          
          <h1 className="mt-6 font-raleway text-4xl font-bold tracking-tight text-[#063547] md:text-5xl dark:text-[#f2eae6]">
            Completar Cotización
          </h1>

          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-12">
            
            {/* Formulario */}
            <div className="lg:col-span-7 xl:col-span-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#063547] dark:text-[#f2eae6]">Nombre Completo *</label>
                    <input required name="fullName" value={formData.fullName} onChange={handleChange} className="rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-[#063547] focus:border-[#b45b38] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-[#f2eae6]" placeholder="Tu nombre" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#063547] dark:text-[#f2eae6]">Correo Electrónico *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-[#063547] focus:border-[#b45b38] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-[#f2eae6]" placeholder="ejemplo@correo.com" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#063547] dark:text-[#f2eae6]">Teléfono *</label>
                    <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-[#063547] focus:border-[#b45b38] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-[#f2eae6]" placeholder="+58 414 123 4567" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-[#063547] dark:text-[#f2eae6]">Fecha del Evento *</label>
                    <p className="text-xs text-[#6e7c7c] dark:text-[#b2b5a9]">Requerimos al menos 2 días de antelación.</p>
                    <input required type="date" min={minDate} name="eventDate" value={formData.eventDate} onChange={handleChange} className="rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-[#063547] focus:border-[#b45b38] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-[#f2eae6]" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#063547] dark:text-[#f2eae6]">Número de Invitados *</label>
                  <input required type="number" min="1" name="guests" value={formData.guests} onChange={handleChange} className="rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-[#063547] focus:border-[#b45b38] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-[#f2eae6] sm:w-1/2" placeholder="Cantidad aproximada" />
                </div>

                <LocationPicker onLocationChange={setEventLocation} />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#063547] dark:text-[#f2eae6]">Descripción del Evento *</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="rounded-xl border border-black/10 bg-black/5 px-4 py-3 text-[#063547] focus:border-[#b45b38] focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-[#f2eae6]" placeholder="Cuéntanos un poco sobre tu evento..." />
                </div>

                {error && <p className="text-red-500 font-bold">{error}</p>}

                <button disabled={isSubmitting} type="submit" className="w-full rounded-full bg-[#b45b38] py-4 font-bold text-white transition-opacity hover:opacity-90 disabled:bg-[#b45b38]/50 sm:w-auto sm:px-12">
                  {isSubmitting ? "Enviando..." : "Solicitar Cotización"}
                </button>
              </form>
            </div>

            {/* Resumen del Carrito */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-28 rounded-3xl bg-[#f2eae6] p-6 sm:p-8 dark:bg-[#063547]">
                <h3 className="font-raleway text-2xl font-bold text-[#063547] dark:text-[#f2eae6]">Resumen</h3>
                <div className="mt-6 divide-y divide-black/5 dark:divide-white/5">
                  {items.map(item => (
                    <div key={item.product.id} className="flex gap-4 py-4">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image 
                          src={item.product.image} 
                          alt={item.product.name} 
                          fill 
                          className={item.product.image.includes('isotipo.png') ? 'object-contain p-4 opacity-30 dark:opacity-50' : 'object-cover'} 
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="font-bold text-[#063547] line-clamp-1 dark:text-[#f2eae6]">{item.product.name}</h4>
                        <p className="text-sm text-[#6e7c7c] dark:text-[#b2b5a9]">Cant: {item.quantity}</p>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-[#b45b38]">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-black/10 pt-6 dark:border-white/10">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-[#6e7c7c] dark:text-[#b2b5a9]">Subtotal</span>
                    <span className="font-bold text-[#063547] dark:text-[#f2eae6]">${totalOriginal.toFixed(2)}</span>
                  </div>

                  {appliedRules.length > 0 && appliedRules.map((rule, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm mb-2 text-[#b45b38]">
                      <span className="font-bold">{rule.ruleName} ({rule.percentage}%)</span>
                      <span className="font-bold">-${rule.discountAmount.toFixed(2)}</span>
                    </div>
                  ))}

                  {appliedTaxes && appliedTaxes.length > 0 && appliedTaxes.map((tax, idx) => (
                    <div key={`tax-${idx}`} className="flex items-center justify-between text-sm mb-2 text-[#6e7c7c] dark:text-[#b2b5a9]">
                      <span className="font-bold">{tax.taxName} ({tax.percentage}%)</span>
                      <span className="font-bold">+${tax.taxAmount.toFixed(2)}</span>
                    </div>
                  ))}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                    <span className="font-bold text-[#063547] dark:text-[#f2eae6]">Total Estimado</span>
                    <span className="font-raleway text-3xl font-bold text-[#b45b38]">${totalFinal.toFixed(2)}</span>
                  </div>
                  <p className="mt-2 text-xs text-[#6e7c7c] dark:text-[#b2b5a9]">
                    Este es un monto estimado. Un ejecutivo de ventas te contactará para confirmar detalles y darte el monto final.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

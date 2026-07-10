import { CartItem } from '@/lib/types/catalog';

export interface DiscountTier {
  minUnits: number;
  maxUnits?: number;
  percentage: number;
}

export interface DiscountRule {
  id: string;
  name: string;
  isActive: boolean;
  applyToAll: boolean;
  subcategories?: { id: string | number }[]; // Payload populates relationships
  tiers: DiscountTier[];
}

export interface Tax {
  id: string | number;
  name: string;
  value: number;
  isActive: boolean;
}

export interface DiscountResult {
  totalOriginal: number;
  totalDiscount: number;
  totalTax: number;
  totalFinal: number;
  appliedRules: { ruleName: string; discountAmount: number; percentage: number }[];
  appliedTaxes: { taxName: string; taxAmount: number; percentage: number }[];
}

export function getItemUnitPrice(item: CartItem): number {
  let basePrice = item.product.price;
  let totalAdjustments = 0;

  if (item.selectedVariation && item.product.variations) {
    const choice = item.product.variations.find(v => v.label === item.selectedVariation);
    if (choice) {
      if (typeof choice.price === 'number') {
        basePrice = choice.price;
      }
      if (typeof choice.priceAdjustment === 'number') {
        totalAdjustments += choice.priceAdjustment;
      }
    }
  }
  return basePrice + totalAdjustments;
}

export function calculateDiscounts(items: CartItem[], rules: DiscountRule[], taxes: Tax[] = []): DiscountResult {
  let totalOriginal = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  let appliedRules: { ruleName: string; discountAmount: number; percentage: number }[] = [];
  let appliedTaxes: { taxName: string; taxAmount: number; percentage: number }[] = [];

  // 1. Filtrar "Arma tu Box" (categoryId !== 'box')
  const freeSelectionItems = items.filter(item => item.product.categoryId !== 'box');
  const boxItems = items.filter(item => item.product.categoryId === 'box');

  // Sumar directamente los boxes (sin descuento)
  boxItems.forEach(item => {
    totalOriginal += getItemUnitPrice(item) * item.quantity;
  });

  if (freeSelectionItems.length === 0 || rules.length === 0) {
    // Si no hay productos de selección libre o no hay reglas, calculamos igual los impuestos
    freeSelectionItems.forEach(item => {
      totalOriginal += getItemUnitPrice(item) * item.quantity;
    });
    
    // Calcular impuestos sobre la base (totalOriginal - 0)
    taxes.filter(t => t.isActive).forEach(tax => {
      const taxAmount = totalOriginal * (tax.value / 100);
      totalTax += taxAmount;
      appliedTaxes.push({ taxName: tax.name, taxAmount, percentage: tax.value });
    });

    return {
      totalOriginal,
      totalDiscount,
      totalTax,
      totalFinal: totalOriginal + totalTax,
      appliedRules,
      appliedTaxes
    };
  }

  // 2. Agrupar selección libre por Subcategoría
  const itemsBySubcategory: Record<string, { items: CartItem[], totalQuantity: number, subtotal: number }> = {};

  freeSelectionItems.forEach(item => {
    const subcatId = String(item.product.subcategoryId);
    if (!itemsBySubcategory[subcatId]) {
      itemsBySubcategory[subcatId] = { items: [], totalQuantity: 0, subtotal: 0 };
    }
    itemsBySubcategory[subcatId].items.push(item);
    itemsBySubcategory[subcatId].totalQuantity += item.quantity;
    itemsBySubcategory[subcatId].subtotal += (getItemUnitPrice(item) * item.quantity);
  });

  // 3. Evaluar reglas
  // Iteramos sobre cada grupo (subcategoría) y buscamos si aplica alguna regla
  Object.keys(itemsBySubcategory).forEach(subcatId => {
    const group = itemsBySubcategory[subcatId];
    totalOriginal += group.subtotal;

    // Buscar una regla aplicable
    // Prioridad: applyToAll == false && subcategories includes subcatId > applyToAll == true
    let applicableRule = rules.find(r => r.isActive && !r.applyToAll && r.subcategories?.some(s => String(s.id) === subcatId));
    
    if (!applicableRule) {
      applicableRule = rules.find(r => r.isActive && r.applyToAll);
    }

    if (applicableRule) {
      // Buscar el tier que aplique a la cantidad total del grupo
      const qty = group.totalQuantity;
      
      // Ordenar tiers por minUnits descendente para agarrar el mayor nivel aplicable
      const sortedTiers = [...applicableRule.tiers].sort((a, b) => b.minUnits - a.minUnits);
      
      const matchingTier = sortedTiers.find(t => {
        if (qty < t.minUnits) return false;
        if (t.maxUnits && qty > t.maxUnits) return false;
        return true;
      });

      if (matchingTier) {
        const discountAmount = group.subtotal * (matchingTier.percentage / 100);
        totalDiscount += discountAmount;
        
        appliedRules.push({
          ruleName: applicableRule.name,
          discountAmount,
          percentage: matchingTier.percentage
        });
      }
    }
  });

  // 4. Calcular impuestos sobre la base imponible (totalOriginal - totalDiscount)
  const taxableBase = totalOriginal - totalDiscount;
  taxes.filter(t => t.isActive).forEach(tax => {
    const taxAmount = taxableBase * (tax.value / 100);
    totalTax += taxAmount;
    appliedTaxes.push({ taxName: tax.name, taxAmount, percentage: tax.value });
  });

  return {
    totalOriginal,
    totalDiscount,
    totalTax,
    totalFinal: taxableBase + totalTax,
    appliedRules,
    appliedTaxes
  };
}

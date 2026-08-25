import { Product } from '@/lib/types/catalog'

/**
 * Reglas de visibilidad de producto para el catálogo público.
 *
 * Vive en un solo lugar porque la grilla del catálogo y el armador de boxes
 * deben coincidir: si la condición se duplicara en ambos componentes, con el
 * tiempo una de las dos copias quedaría desactualizada.
 */

/**
 * Indica si un producto debe mostrarse en el catálogo público.
 *
 * La colección define tres estados: `active`, `inactive` y `draft`. Solo el
 * primero es visible.
 *
 * La comparación excluye explícitamente los estados ocultos en lugar de exigir
 * `status === 'active'`. El motivo es defensivo: el esquema se sincroniza con
 * `push: true`, de modo que un registro creado antes de que el campo existiera
 * puede tener el estado vacío. Con una condición positiva esos productos
 * desaparecerían del catálogo sin aviso; con esta, un estado ausente se trata
 * como visible y solo se oculta lo que fue marcado como oculto de forma
 * deliberada.
 */
export function isProductVisible(product: Product): boolean {
  return product.status !== 'inactive' && product.status !== 'draft'
}

/** Filtra una lista dejando únicamente los productos visibles al público. */
export function visibleProducts(products: Product[]): Product[] {
  return products.filter(isProductVisible)
}

/**
 * Interfaz que representa una categoría de productos
 * 
 * Las categorías se utilizan para organizar y filtrar productos
 * en el catálogo de la tienda (ej: Routers, Switches, Access Points, etc.)
 * 
 * @example
 * ```typescript
 * const categoria: Category = {
 *   id: 1,
 *   nombre: 'Routers Inalámbricos'
 * };
 * ```
 */
export interface Category {
    /** Identificador único de la categoría */
    id: number;

    /** Nombre descriptivo de la categoría */
    nombre: string;
}

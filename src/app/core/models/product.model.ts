/**
 * Interfaz que define la estructura de un producto en la tienda
 * 
 * Representa un producto de tecnología disponible para la venta,
 * incluyendo toda su información descriptiva, precio y stock disponible.
 * 
 * @example
 * ```typescript
 * const producto: Product = {
 *   id: 1,
 *   name: 'Router Inalámbrico AC1200',
 *   description: 'Router de alta velocidad con tecnología Dual-Band',
 *   price: 129900,
 *   imageUrl: '/products/router-ac1200.jpg',
 *   category: 'Redes',
 *   categoryId: 3,
 *   stock: 15
 * };
 * ```
 */
export interface Product {
  /** Identificador único del producto */
  id: number;

  /** Nombre descriptivo del producto */
  name: string;

  /** Descripción detallada con características del producto */
  description: string;

  /** Precio en pesos colombianos (COP) */
  price: number;

  /** URL de la imagen principal del producto (opcional) */
  imageUrl?: string;

  /** Nombre de la categoría a la que pertenece (para mostrar en UI) */
  category: string;

  /** ID numérico de la categoría (para formularios y filtros) */
  categoryId?: number;

  /** Cantidad disponible en inventario */
  stock: number;
}

/**
 * Datos para crear o actualizar un producto (formulario admin)
 * 
 * Contiene los campos que se pueden editar de un producto
 */
export interface ProductFormData {
  /** Nombre del producto */
  name: string;

  /** Descripción del producto */
  description: string;

  /** Precio en COP */
  price: number;

  /** URL de la imagen */
  imageUrl?: string;

  /** ID de la categoría */
  categoryId: number;

  /** Cantidad en stock */
  stock: number;
}

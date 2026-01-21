import { Product } from './product.model';

/**
 * Interfaz que representa el carrito de compras del usuario
 * 
 * Contiene todos los productos que el usuario ha seleccionado
 * para comprar, con sus respectivas cantidades.
 * 
 * @example
 * ```typescript
 * const carrito: Cart = {
 *   items: [
 *     { product: producto1, quantity: 2 },
 *     { product: producto2, quantity: 1 }
 *   ]
 * };
 * ```
 */
export interface Cart {
  /** Lista de ítems (productos con cantidad) en el carrito */
  items: CartItem[];
}

/**
 * Estado global del carrito en la aplicación
 * 
 * Utilizado para mantener el estado del carrito en signals o state management
 */
export interface CartState {
  /** Carrito de compras actual */
  cart: Cart;
}

/**
 * Interfaz que representa un ítem individual dentro del carrito
 * 
 * Combina un producto con la cantidad seleccionada por el usuario
 * 
 * @example
 * ```typescript
 * const item: CartItem = {
 *   product: {
 *     id: 1,
 *     name: 'Router WiFi 6',
 *     price: 299900,
 *     // ... otros campos
 *   },
 *   quantity: 3
 * };
 * ```
 */
export interface CartItem {
  /** El producto agregado al carrito */
  product: Product;

  /** La cantidad de unidades de este producto */
  quantity: number;
}

/**
 * Resumen de totales del carrito
 * 
 * Contiene los cálculos de precio total, cantidad de items, etc.
 */
export interface CartSummary {
  /** Número total de items en el carrito */
  totalItems: number;

  /** Precio total de todos los productos (suma de precio * cantidad) */
  totalPrice: number;

  /** Cantidad total de productos (suma de todas las cantidades) */
  totalQuantity: number;
}

import { Product } from './product.model';


/**
 * Interfaz que representa el carrito de compras.
 */
export interface Cart {
  /** Lista de ítems en el carrito */
  items: CartItem[];
}

/**
 * Estado general del carrito.
 */
export interface CartState {
  cart: Cart;
}

/**
 * Interfaz que representa un ítem individual dentro del carrito.
 */
export interface CartItem {
  /** El producto agregado */
  product: Product;
  /** La cantidad del producto */
  quantity: number;
}

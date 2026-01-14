import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Estado gestionado por Signals
  items = signal<CartItem[]>([]);
  isOpen = signal(false);

  // Valores computados
  count = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  total = computed(() => this.items().reduce((acc, item) => acc + (item.product.price * item.quantity), 0));

  constructor() {
    // Restaurar desde localStorage si está en el navegador
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('cart');
      if (saved) {
        this.items.set(JSON.parse(saved));
      }

      // Persistir cambios
      effect(() => {
        localStorage.setItem('cart', JSON.stringify(this.items()));
      });
    }
  }

  /**
   * Agrega un producto al carrito.
   * Si ya existe, incrementa la cantidad.
   * @param product Producto a agregar
   */
  addToCart(product: Product) {
    this.items.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  /**
   * Elimina un producto del carrito por completo.
   * @param productId ID del producto a eliminar
   */
  removeFromCart(productId: number) {
    this.items.update(items => items.filter(i => i.product.id !== productId));
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * Si la cantidad es 0 o menor, elimina el producto.
   * @param productId ID del producto
   * @param quantity Nueva cantidad
   */
  updateQuantity(productId: number, quantity: number) {
    this.items.update(items => {
      if (quantity <= 0) {
        return items.filter(i => i.product.id !== productId);
      }
      return items.map(i => i.product.id === productId ? { ...i, quantity } : i);
    });
  }

  /**
   * Vacía el carrito por completo.
   */
  clearCart() {
    this.items.set([]);
  }

  /** Alterna la visibilidad del carrito (abrir/cerrar) */
  toggleCart() {
    this.isOpen.update(v => !v);
  }

  /** Abre el carrito */
  openCart() {
    this.isOpen.set(true);
  }

  /** Cierra el carrito */
  closeCart() {
    this.isOpen.set(false);
  }
}

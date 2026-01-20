import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ServerCartService } from './server-cart.service';
import { CarritoResponse, CarritoItemResponse } from '../models/backend.models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Estado gestionado por Signals
  items = signal<CartItem[]>([]);
  isOpen = signal(false);

  // Valores computados
  count = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));
  total = computed(() =>
    this.items().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  );

  private serverCart = inject(ServerCartService);

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

  private mapCarritoResponse(resp: CarritoResponse) {
    const mapped: CartItem[] = resp.items.map((i: CarritoItemResponse) => ({
      product: {
        id: i.productoId,
        name: i.nombreProducto,
        description: i.descripcionProducto ?? '',
        price: Number(i.precio),
        imageUrl: '',
        category: '',
        stock: 0,
      } as Product,
      quantity: i.cantidad,
    }));
    this.items.set(mapped);
  }

  /**
   * Agrega un producto al carrito.
   * Si hay sesión (token), delega al backend; si no, lo guarda localmente.
   * @param product Producto a agregar
   */
  addToCart(product: Product) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      this.serverCart.addToCart({ productoId: product.id, cantidad: 1 }).subscribe({
        next: (resp) => this.mapCarritoResponse(resp),
        error: (err) => console.error('Error adding to server cart', err),
      });
      return;
    }

    this.items.update((items) => {
      const existing = items.find((i) => i.product.id === product.id);
      if (existing) {
        return items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
  }

  /**
   * Elimina un producto del carrito por completo.
   * @param productId ID del producto a eliminar
   */
  removeFromCart(productId: number) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      this.serverCart.removeFromCart(productId).subscribe({
        next: () => { },
        error: (err) => console.error('Error removing from server cart', err),
        complete: () =>
          this.serverCart.getCart().subscribe({ next: (resp) => this.mapCarritoResponse(resp) }),
      });
      return;
    }

    this.items.update((items) => items.filter((i) => i.product.id !== productId));
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * Si la cantidad es 0 o menor, elimina el producto.
   * @param productId ID del producto
   * @param quantity Nueva cantidad
   * @param removeAll Si es true, elimina el producto por completo
   */
  updateQuantity(productId: number, quantity: number, removeAll: boolean = false) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      // Usuario autenticado - actualizar en el servidor
      if (removeAll) {
        this.removeFromCart(productId);
        return;
      }

      // Actualización optimista: actualizar el estado local primero
      this.items.update((items) => {
        if (quantity <= 0) {
          return items.filter((i) => i.product.id !== productId);
        }
        return items.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
      });

      // Luego sincronizar con el servidor
      this.serverCart
        .updateCart({ items: [{ productoId: productId, cantidad: quantity }] })
        .subscribe({
          next: () => {
            // Actualización exitosa en el servidor
            // No necesitamos actualizar el estado local nuevamente
            // porque ya lo hicimos de forma optimista
          },
          error: (err) => {
            console.error('Error updating server cart', err);
            // En caso de error, recargar el carrito del servidor
            this.loadServerCart();
          },
        });
      return;
    }

    // Usuario no autenticado - actualizar solo localStorage
    this.items.update((items) => {
      if (removeAll || quantity <= 0) {
        return items.filter((i) => i.product.id !== productId);
      }
      return items.map((i) => (i.product.id === productId ? { ...i, quantity } : i));
    });
  }

  /**
   * Vacía el carrito por completo.
   */
  clearCart() {
    this.items.set([]);
  }

  /**
   * Incrementa la cantidad de un producto en 1.
   * @param productId ID del producto
   */
  incrementQuantity(productId: number) {
    const item = this.items().find((i) => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  /**
   * Decrementa la cantidad de un producto en 1.
   * Si la cantidad llega a 0, elimina el producto.
   * @param productId ID del producto
   */
  decrementQuantity(productId: number) {
    const item = this.items().find((i) => i.product.id === productId);
    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  /**
   * Carga el carrito desde el servidor (si el usuario está autenticado).
   */
  loadServerCart() {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    this.serverCart.getCart().subscribe({
      next: (resp) => this.mapCarritoResponse(resp),
      error: (err) => console.error('Error loading server cart', err),
    });
  }

  /** Alterna la visibilidad del carrito (abrir/cerrar) */
  toggleCart() {
    this.isOpen.update((v) => !v);
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

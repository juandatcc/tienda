import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ServerCartService } from './server-cart.service';
import { CarritoResponse, CarritoItemResponse } from '../models/backend.models';
import { NotificationService } from './notification.service';

/**
 * Servicio de Gestión del Carrito de Compras de TechHub
 * 
 * Este servicio maneja toda la lógica del carrito de compras:
 * - Añadir/eliminar productos
 * - Actualizar cantidades
 * - Sincronización con el servidor para usuarios autenticados
 * - Persistencia local para usuarios no autenticados
 * - Validación de stock
 * - Notificaciones de operaciones
 * 
 * El carrito tiene dos modos de operación:
 * 1. **Usuario NO autenticado**: Almacena el carrito en localStorage
 * 2. **Usuario autenticado**: Sincroniza el carrito con el servidor
 * 
 * @example
 * ```typescript
 * constructor(private cartService: CartService) {}
 * 
 * // Añadir producto
 * agregarAlCarrito(producto: Product) {
 *   this.cartService.addToCart(producto);
 * }
 * 
 * // Leer total
 * const total = this.cartService.total();
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  // ============================================
  // SIGNALS (Estado Reactivo)
  // ============================================

  /** 
   * Array de items en el carrito
   * 
   * Cada item contiene el producto y la cantidad seleccionada
   */
  items = signal<CartItem[]>([]);

  /** 
   * Indica si el panel lateral del carrito está abierto
   * 
   * Se utiliza para controlar la visibilidad del cart-sidebar
   */
  isOpen = signal(false);

  /** 
   * Indica si hay una operación de actualización en progreso
   * 
   * Se utiliza para deshabilitar botones mientras se sincroniza con el servidor
   */
  isUpdating = signal(false);

  // ============================================
  // COMPUTED VALUES (Valores Calculados)
  // ============================================

  /** 
   * Número total de productos en el carrito
   * 
   * Suma todas las cantidades de los items
   */
  count = computed(() => this.items().reduce((acc, item) => acc + item.quantity, 0));

  /** 
   * Precio total del carrito
   * 
   * Suma el precio * cantidad de todos los items
   */
  total = computed(() =>
    this.items().reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  );

  // ============================================
  // DEPENDENCIES (Dependencias Inyectadas)
  // ============================================

  /** Servicio para operaciones del carrito en el servidor */
  private serverCart = inject(ServerCartService);

  /** Servicio para mostrar notificaciones al usuario */
  /** Servicio para mostrar notificaciones al usuario */
  private notificationService = inject(NotificationService);

  /**
   * Constructor del servicio
   * 
   * Inicializa el carrito restaurando los datos de localStorage
   * y configura un effect para persistir cambios automáticamente.
   */
  constructor() {
    // Restaurar carrito guardado desde localStorage (solo en el navegador)
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('cart');
      if (saved) {
        this.items.set(JSON.parse(saved));
      }

      // Effect: Persistir automáticamente cada cambio en el carrito
      effect(() => {
        localStorage.setItem('cart', JSON.stringify(this.items()));
      });
    }
  }

  // ============================================
  // PRIVATE METHODS (Métodos Privados)
  // ============================================

  /**
   * Mapea la respuesta del servidor al formato local del carrito
   * 
   * Convierte los datos del backend (español, formato DTO) al formato
   * que utiliza el frontend (inglés, interfaces Product y CartItem).
   * 
   * @param resp - Respuesta del servidor con el carrito
   */
  private mapCarritoResponse(resp: CarritoResponse) {
    const mapped: CartItem[] = resp.items.map((i: CarritoItemResponse) => ({
      product: {
        id: i.productoId,
        name: i.nombreProducto,
        description: i.descripcionProducto ?? '',
        price: Number(i.precio),
        imageUrl: i.imagenUrl ?? '',
        category: '',
        stock: 0,
      } as Product,
      quantity: i.cantidad,
    }));
    this.items.set(mapped);
  }

  // ============================================
  // PUBLIC METHODS (Métodos Públicos)
  // ============================================

  /**
   * Agrega un producto al carrito de compras
   * 
   * Comportamiento según el estado de autenticación:
   * - **Usuario autenticado**: Envía la petición al servidor y sincroniza
   * - **Usuario no autenticado**: Actualiza el carrito local en localStorage
   * 
   * Validaciones:
   * - Verifica que el producto tenga stock disponible
   * - Valida que no se exceda el stock máximo
   * - Muestra notificaciones de éxito/error
   * 
   * Si el producto ya existe en el carrito, incrementa su cantidad en 1.
   * 
   * @param product - Producto a agregar al carrito
   * 
   * @example
   * ```typescript
   * agregarProducto(producto: Product) {
   *   this.cartService.addToCart(producto);
   * }
   * ```
   */
  addToCart(product: Product) {
    // Validar stock
    if (product.stock <= 0) {
      this.notificationService.error('Producto sin stock disponible');
      return;
    }

    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      this.serverCart.addToCart({ productoId: product.id, cantidad: 1 }).subscribe({
        next: (resp) => {
          this.mapCarritoResponse(resp);
          this.notificationService.success(`${product.name} añadido al carrito`);
        },
        error: (err) => {
          console.error('Error adding to server cart', err);
          this.notificationService.error('Error al añadir producto');
        },
      });
      return;
    }

    this.items.update((items) => {
      const existing = items.find((i) => i.product.id === product.id);
      if (existing) {
        // Validar que no exceda el stock
        if (existing.quantity >= product.stock) {
          this.notificationService.warning(`Stock máximo alcanzado (${product.stock} unidades)`);
          return items;
        }
        this.notificationService.success(`${product.name} añadido al carrito`);
        return items.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      this.notificationService.success(`${product.name} añadido al carrito`);
      return [...items, { product, quantity: 1 }];
    });
  }

  /**
   * Elimina un producto del carrito por completo
   * 
   * Elimina todas las unidades del producto, sin importar la cantidad.
   * 
   * Comportamiento según el estado de autenticación:
   * - **Usuario autenticado**: Elimina del servidor y recarga el carrito
   * - **Usuario no autenticado**: Elimina del carrito local
   * 
   * @param productId - ID del producto a eliminar
   * 
   * @example
   * ```typescript
   * eliminarProducto(id: number) {
   *   this.cartService.removeFromCart(id);
   * }
   * ```
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
   * Actualiza la cantidad de un producto en el carrito
   * 
   * Permite establecer una cantidad específica para un producto.
   * Si la cantidad es 0 o negativa, elimina el producto del carrito.
   * 
   * Comportamiento según el estado de autenticación:
   * - **Usuario autenticado**: Actualiza en el servidor y sincroniza
   * - **Usuario no autenticado**: Actualiza el carrito local
   * 
   * Durante la actualización en el servidor, activa el flag `isUpdating`
   * para deshabilitar botones y evitar múltiples peticiones simultáneas.
   * 
   * @param productId - ID del producto
   * @param quantity - Nueva cantidad deseada
   * @param removeAll - Si es true, elimina el producto sin importar la cantidad
   * 
   * @example
   * ```typescript
   * // Establecer cantidad a 5
   * this.cartService.updateQuantity(productId, 5);
   * 
   * // Eliminar producto
   * this.cartService.updateQuantity(productId, 0, true);
   * ```
   */
  updateQuantity(productId: number, quantity: number, removeAll: boolean = false) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      // Usuario autenticado - actualizar en el servidor
      if (removeAll || quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }

      this.isUpdating.set(true);

      // Actualizar en el servidor
      this.serverCart
        .updateCart({ items: [{ productoId: productId, cantidad: quantity }] })
        .subscribe({
          next: (resp) => {
            // Sincronizar con la respuesta del servidor
            this.mapCarritoResponse(resp);
            this.isUpdating.set(false);
          },
          error: (err) => {
            console.error('Error updating server cart', err);
            this.isUpdating.set(false);
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
   * Vacía el carrito por completo
   * 
   * Elimina todos los productos del carrito.
   * Utilizado principalmente al cerrar sesión.
   * 
   * @example
   * ```typescript
   * logout() {
   *   this.cartService.clearCart();
   *   // ... otras operaciones de logout
   * }
   * ```
   */
  clearCart() {
    this.items.set([]);
  }

  /**
   * Incrementa la cantidad de un producto en 1 unidad
   * 
   * Método de conveniencia para aumentar la cantidad.
   * Si el producto no existe en el carrito, no hace nada.
   * 
   * @param productId - ID del producto
   * 
   * @example
   * ```typescript
   * <button (click)="cartService.incrementQuantity(producto.id)">
   *   +
   * </button>
   * ```
   */
  incrementQuantity(productId: number) {
    const item = this.items().find((i) => i.product.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  /**
   * Decrementa la cantidad de un producto en 1 unidad
   * 
   * Método de conveniencia para disminuir la cantidad.
   * Si la cantidad llega a 1 o menos, elimina el producto del carrito.
   * Si el producto no existe en el carrito, no hace nada.
   * 
   * @param productId - ID del producto
   * 
   * @example
   * ```typescript
   * <button (click)="cartService.decrementQuantity(producto.id)">
   *   -
   * </button>
   * ```
   */
  decrementQuantity(productId: number) {
    const item = this.items().find((i) => i.product.id === productId);
    if (item) {
      if (item.quantity <= 1) {
        this.removeFromCart(productId);
      } else {
        this.updateQuantity(productId, item.quantity - 1);
      }
    }
  }

  /**
   * Carga el carrito desde el servidor
   * 
   * Obtiene el carrito almacenado en el backend para el usuario autenticado
   * y sincroniza el estado local con los datos del servidor.
   * 
   * Solo ejecuta la petición si existe un token de autenticación.
   * Utilizado al iniciar sesión para cargar el carrito guardado del usuario.
   * 
   * @example
   * ```typescript
   * ngOnInit() {
   *   // Cargar carrito al iniciar la app si hay sesión
   *   this.cartService.loadServerCart();
   * }
   * ```
   */
  loadServerCart() {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    this.serverCart.getCart().subscribe({
      next: (resp) => this.mapCarritoResponse(resp),
      error: (err) => console.error('Error loading server cart', err),
    });
  }

  // ============================================
  // UI METHODS (Métodos de Interfaz de Usuario)
  // ============================================

  /** 
   * Alterna la visibilidad del panel lateral del carrito
   * 
   * Cambia entre estado abierto y cerrado.
   * 
   * @example
   * ```typescript
   * <button (click)="cartService.toggleCart()">
   *   Carrito ({{ cartService.count() }})
   * </button>
   * ```
   */
  toggleCart() {
    this.isOpen.update((v) => !v);
  }

  /** 
   * Abre el panel lateral del carrito
   * 
   * @example
   * ```typescript
   * agregarYMostrar(producto: Product) {
   *   this.cartService.addToCart(producto);
   *   this.cartService.openCart();
   * }
   * ```
   */
  openCart() {
    this.isOpen.set(true);
  }

  /** 
   * Cierra el panel lateral del carrito
   * 
   * @example
   * ```typescript
   * <button (click)="cartService.closeCart()">
   *   Cerrar
   * </button>
   * ```
   */
  closeCart() {
    this.isOpen.set(false);
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { PriceFormatPipe } from '../../shared/pipes/price-format.pipe';

/**
 * Componente de Página del Carrito de Compras
 * 
 * Este componente muestra la vista completa del carrito de compras
 * donde el usuario puede revisar, modificar cantidades y proceder al pago.
 * 
 * Características:
 * - **Vista detallada**: Muestra cada producto con imagen, nombre, precio y cantidad
 * - **Control de cantidad**: Botones +/- para ajustar cantidades
 * - **Resumen de compra**: Total de productos y precio total
 * - **Botón de pago**: Procede al checkout (integración con PSE pendiente)
 * - **Estado vacío**: Mensaje amigable cuando no hay productos
 * - **Formato de precios**: Usa pipe personalizado para formato COP
 * 
 * El componente es reactivo gracias a los signals del CartService,
 * lo que significa que cualquier cambio en el carrito se refleja
 * inmediatamente en la interfaz.
 * 
 * @example
 * ```html
 * <!-- Navegación al carrito -->
 * <a routerLink="/cart">
 *   Ver Carrito ({{ cartService.count() }})
 * </a>
 * ```
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, PriceFormatPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  /** 
   * Servicio del carrito (público para uso en el template)
   * 
   * Expuesto públicamente para que el template pueda acceder a:
   * - items(): Array de productos en el carrito
   * - total(): Precio total calculado
   * - count(): Número total de productos
   * - isUpdating(): Estado de actualización
   */
  cartService = inject(CartService);

  /**
   * Incrementa la cantidad de un producto en 1 unidad
   * 
   * Delega al CartService que maneja la lógica de actualización,
   * sincronización con el servidor (si está autenticado) y
   * persistencia en localStorage (si no está autenticado).
   * 
   * @param productId - ID del producto a incrementar
   * 
   * @example
   * ```html
   * <button (click)="incrementQuantity(producto.id)">
   *   <i class="fas fa-plus"></i>
   * </button>
   * ```
   */
  incrementQuantity(productId: number) {
    this.cartService.incrementQuantity(productId);
  }

  /**
   * Decrementa la cantidad de un producto en 1 unidad
   * 
   * Si la cantidad llega a 1 o menos, el producto se elimina
   * completamente del carrito.
   * 
   * @param productId - ID del producto a decrementar
   * 
   * @example
   * ```html
   * <button (click)="decrementQuantity(producto.id)">
   *   <i class="fas fa-minus"></i>
   * </button>
   * ```
   */
  decrementQuantity(productId: number) {
    this.cartService.decrementQuantity(productId);
  }

  /**
   * Procede al proceso de checkout para completar la compra
   * 
   * TODO: Implementar integración con PSE (Pagos Seguros en Línea)
   * TODO: Navegar a página de checkout con selección de método de pago
   * TODO: Validar stock disponible antes de procesar
   * TODO: Crear orden en el backend
   * 
   * Por ahora muestra un alert con el total para propósitos de desarrollo.
   * 
   * @example
   * ```html
   * <button (click)="proceedToCheckout()" 
   *         [disabled]="cartService.count() === 0">
   *   Proceder al Pago
   * </button>
   * ```
   */
  proceedToCheckout() {
    alert(`Procesando pago por ${this.cartService.total().toFixed(2)}. Esta funcionalidad se conectará con el backend de Spring Boot.`);
    // TODO: Navegar a página de checkout o integrar con pasarela de pago
  }
}

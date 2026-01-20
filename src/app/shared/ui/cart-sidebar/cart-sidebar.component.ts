import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { PriceFormatPipe } from '../../pipes/price-format.pipe';

/**
 * Componente que muestra el carrito de compras como una barra lateral (sidebar).
 * Responsable de listar productos, manejar cantidades y navegar al checkout.
 */
@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, PriceFormatPipe],
  templateUrl: './cart-sidebar.component.html',
})
export class CartSidebarComponent {
  cartService = inject(CartService);
  router = inject(Router);

  /** Cierra el sidebar llamando al servicio */
  close() {
    this.cartService.closeCart();
  }

  /**
   * Incrementa la cantidad de un producto en el carrito.
   */
  incrementQuantity(productId: number) {
    this.cartService.incrementQuantity(productId);
  }

  /**
   * Decrementa la cantidad de un producto en el carrito.
   */
  decrementQuantity(productId: number) {
    this.cartService.decrementQuantity(productId);
  }

  /**
   * Cierra el sidebar y navega a la página del carrito.
   */
  goToCheckout() {
    this.close();
    this.router.navigate(['/cart']);
  }
}

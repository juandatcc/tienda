import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ButtonComponent } from '../../shared/ui/button/button.component';

/**
 * Componente de página completa del carrito.
 * Muestra el detalle de los productos, resumen de costos y botón de pago.
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartService = inject(CartService);

  /**
   * Procede al checkout (por ahora muestra un mensaje)
   */
  proceedToCheckout() {
    alert(`Procesando pago por ${this.cartService.total().toFixed(2)}. Esta funcionalidad se conectará con el backend de Spring Boot.`);
    // TODO: Navegar a página de checkout o integrar con pasarela de pago
  }
}

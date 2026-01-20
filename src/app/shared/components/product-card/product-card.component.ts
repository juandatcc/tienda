import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { ButtonComponent } from '../../ui/button/button.component';
import { PriceFormatPipe } from '../../pipes/price-format.pipe';

/**
 * Componente de tarjeta de producto.
 * Muestra la imagen, nombre, precio y descripción breve de un producto.
 * Permite agregar el producto al carrito directamente.
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, PriceFormatPipe],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  /** El producto a mostrar */
  @Input({ required: true }) product!: Product;

  private cartService = inject(CartService);
  imageError = false;

  /**
   * Agrega el producto al carrito.
   * Detiene la propagación del evento para evitar navegar al detalle del producto.
   * @param event Evento del click
   */
  addToCart(event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(this.product);
    this.cartService.openCart(); // Abre el carrito para mostrar feedback visual
  }

  /**
   * Maneja el error al cargar la imagen
   * @param event Evento de error
   */
  onImageError(event: Event) {
    this.imageError = true;
  }
}

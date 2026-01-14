import { Component, OnInit, inject, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (product()) {
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in">
        <!-- Image Gallery -->
        <div
          class="bg-white rounded-3xl p-8 border border-slate-100 flex items-center justify-center aspect-square"
        >
          <img
            [src]="product()?.imageUrl || 'https://via.placeholder.com/600'"
            [alt]="product()?.name"
            class="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
          />

          <!-- Info -->
          <div class="flex flex-col justify-center space-y-6">
            <div>
              <span
                class="text-primary font-medium text-sm tracking-wider uppercase bg-primary/5 px-3 py-1 rounded-full"
              >
                {{ product()?.category }}
              </span>
              <h1 class="text-4xl font-bold text-slate-900 mt-4 mb-2">{{ product()?.name }}</h1>
              <div class="flex items-center gap-4">
                <span class="text-3xl font-bold text-slate-900">{{
                  product()?.price | currency
                }}</span>
                @if (product()?.stock) {
                  <span class="text-green-600 text-sm font-medium flex items-center gap-1">
                    <span class="w-2 h-2 rounded-full bg-green-500"></span>
                    En Stock
                  </span>
                }
              </div>
            </div>

            <p class="text-slate-600 text-lg leading-relaxed">
              {{ product()?.description }}
            </p>

            <div class="pt-6 border-t border-slate-100">
              <div class="flex gap-4">
                <app-button (onClick)="addToCart()" size="lg" [fullWidth]="true">
                  Añadir al Carrito
                </app-button>
              </div>
              <p class="mt-4 text-xs text-slate-400 text-center">
                Envío gratis en pedidos superiores a $50. Garantía de 2 años.
              </p>
            </div>
          </div>
        </div>
      </div>
    } @else {
      <div class="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div class="bg-slate-100 rounded-3xl aspect-square"></div>
        <div class="space-y-4 py-12">
          <div class="h-8 bg-slate-100 rounded w-1/3"></div>
          <div class="h-12 bg-slate-100 rounded w-3/4"></div>
          <div class="h-6 bg-slate-100 rounded w-full"></div>
          <div class="h-6 bg-slate-100 rounded w-full"></div>
        </div>
      </div>
    }
  `,
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | undefined>(undefined);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (id) {
        this.productService.getProduct(id).subscribe((p) => this.product.set(p));
      }
    });
  }

  addToCart() {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p);
      this.cartService.openCart(); // Abre el carrito para mostrar feedback visual
    }
  }
}

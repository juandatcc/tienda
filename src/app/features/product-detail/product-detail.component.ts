import { Component, OnInit, inject, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';
import { PriceFormatPipe } from '../../shared/pipes/price-format.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, PriceFormatPipe],
  template: `
    @if (product()) {
      <div class="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Image Gallery -->
            <div class="bg-linear-to-br from-slate-900/80 to-slate-800/80 rounded-3xl p-8 border border-white/10 backdrop-blur-xl flex items-center justify-center aspect-square">
              <img
                [src]="product()?.imageUrl || '/banners/hero.jpg'"
                [alt]="product()?.name"
                class="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            <!-- Info -->
            <div class="flex flex-col justify-center space-y-6">
              <div>
                <span class="text-cyan-400 font-medium text-sm tracking-wider uppercase bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
                  {{ product()?.category }}
                </span>
                <h1 class="text-4xl font-bold text-white mt-4 mb-2">{{ product()?.name }}</h1>
                <div class="flex items-center gap-4">
                  <span class="text-3xl font-bold bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {{ product()?.price | priceFormat }}
                  </span>
                  @if (product()?.stock && product()!.stock > 0) {
                    <span class="text-emerald-400 text-sm font-medium flex items-center gap-1 bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-400/30">
                      <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                      En Stock ({{ product()?.stock }})
                    </span>
                  } @else {
                    <span class="text-red-400 text-sm font-medium flex items-center gap-1 bg-red-950/50 px-3 py-1 rounded-full border border-red-400/30">
                      <span class="w-2 h-2 rounded-full bg-red-400"></span>
                      Agotado
                    </span>
                  }
                </div>
              </div>

              <p class="text-slate-300 text-lg leading-relaxed">
                {{ product()?.description }}
              </p>

              <div class="pt-6 border-t border-white/10">
                <div class="flex gap-4">
                  <button 
                    (click)="addToCart()" 
                    [disabled]="!product()?.stock || product()!.stock <= 0"
                    class="flex-1 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg disabled:hover:bg-emerald-600 flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="8" cy="21" r="1" />
                      <circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    @if (product()?.stock && product()!.stock > 0) {
                      <span>Añadir al Carrito</span>
                    } @else {
                      <span>No Disponible</span>
                    }
                  </button>
                </div>
                <p class="mt-4 text-xs text-slate-400 text-center">
                  Envío gratis en pedidos superiores a $50. Garantía de 2 años.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    } @else if (error()) {
      <div class="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col items-center justify-center py-32">
            <div class="text-red-400 text-6xl mb-4">⚠️</div>
            <h2 class="text-3xl font-bold text-white mb-2">{{ error() }}</h2>
            <p class="text-slate-400 mb-8">No pudimos cargar la información del producto.</p>
            <a href="/products" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
              Volver a Productos
            </a>
          </div>
        </div>
      </div>
    } @else {
      <div class="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div class="bg-slate-800/50 rounded-3xl aspect-square border border-white/10"></div>
            <div class="space-y-4 py-12">
              <div class="h-8 bg-slate-800/50 rounded w-1/3"></div>
              <div class="h-12 bg-slate-800/50 rounded w-3/4"></div>
              <div class="h-6 bg-slate-800/50 rounded w-full"></div>
              <div class="h-6 bg-slate-800/50 rounded w-full"></div>
            </div>
          </div>
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
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      console.log('Product ID from route:', id);
      if (id) {
        this.loading.set(true);
        this.error.set(null);
        this.productService.getProduct(id).subscribe({
          next: (p) => {
            console.log('Product loaded:', p);
            this.product.set(p);
            this.loading.set(false);
            if (!p) {
              this.error.set('Producto no encontrado');
            }
          },
          error: (err) => {
            console.error('Error loading product:', err);
            this.error.set('Error al cargar el producto');
            this.loading.set(false);
          }
        });
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

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { CreatePaymentRequest } from '../../../core/models/payment.model';

@Component({
  selector: 'app-pse-start',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div class="max-w-5xl mx-auto px-4 py-12 lg:py-16">
        <!-- Hero / Header -->
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 text-blue-200 text-sm border border-blue-500/20">
              <span class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              </span>
              Pago seguro con PSE
            </div>
            <h1 class="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight">Completa tu pago con confianza</h1>
            <p class="mt-2 text-slate-400 max-w-2xl">Verifica el resumen, confirma tu correo y continúa al checkout bancario protegido.</p>
          </div>
          <div class="flex items-center gap-3 text-sm text-slate-400">
            <div class="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700">Cifrado TLS 1.2</div>
            <div class="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700">Anti-phishing activo</div>
            <div class="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700">Autenticación bancaria</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Columna Resumen -->
          <div class="lg:col-span-2 space-y-6">
            @if (cartService.items().length > 0) {
              <div class="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur p-6 shadow-lg shadow-blue-900/20">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="text-lg font-semibold">Resumen de compra</h3>
                  <span class="text-xs px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">{{ cartService.items().length }} artículo(s)</span>
                </div>
                <div class="divide-y divide-slate-800/70">
                  @for (item of cartService.items(); track item.product.id) {
                    <div class="flex items-center justify-between py-3 gap-3">
                      <div class="min-w-0">
                        <p class="font-medium truncate">{{ item.product.name }}</p>
                        <p class="text-sm text-slate-400">Cantidad: {{ item.quantity }}</p>
                      </div>
                      <div class="text-right">
                        <p class="font-semibold text-blue-300">\${{ (item.product.price * item.quantity).toLocaleString('es-CO') }}</p>
                      </div>
                    </div>
                  }
                </div>
                <div class="mt-5 grid grid-cols-3 gap-3 text-sm text-slate-300 bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                  <div class="space-y-1">
                    <p class="text-slate-400">Subtotal</p>
                    <p class="font-semibold">\${{ cartService.total().toLocaleString('es-CO') }}</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-slate-400">Envío</p>
                    <p class="font-semibold text-emerald-300">Gratis</p>
                  </div>
                  <div class="space-y-1">
                    <p class="text-slate-400">Impuestos</p>
                    <p class="font-semibold">Calculado al pagar</p>
                  </div>
                </div>
              </div>
            }

            <!-- Bloque de confianza -->
            <div class="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur p-5 flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <div class="flex items-center gap-2">
                <span class="h-9 w-9 rounded-full bg-emerald-500/15 text-emerald-300 flex items-center justify-center">🔒</span>
                <div>
                  <p class="font-semibold">Checkout protegido</p>
                  <p class="text-slate-400">Validamos la sesión y encriptamos tus datos.</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="h-9 w-9 rounded-full bg-blue-500/15 text-blue-300 flex items-center justify-center">✅</span>
                <div>
                  <p class="font-semibold">Autenticación bancaria</p>
                  <p class="text-slate-400">Redirección segura al flujo PSE.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna Formulario -->
          <div class="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur p-6 shadow-lg shadow-blue-900/25">
            <div class="flex items-center justify-between mb-4">
              <div>
                <p class="text-sm text-slate-400">Paso 1 de 2</p>
                <h3 class="text-lg font-semibold">Confirma tu correo</h3>
              </div>
              <div class="flex items-center gap-1 text-xs text-slate-400">
                <span class="h-2 w-2 rounded-full bg-blue-400"></span>
                <span class="h-2 w-2 rounded-full bg-slate-700"></span>
              </div>
            </div>

            <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()" class="space-y-5">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Correo electrónico</label>
                <div class="relative">
                  <input
                    type="email"
                    formControlName="buyerEmail"
                    class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                    placeholder="tu@email.com"
                  />
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16v16H4z" opacity="0.2"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                </div>
                @if (paymentForm.get('buyerEmail')?.invalid && paymentForm.get('buyerEmail')?.touched) {
                  <p class="text-red-400 text-sm">Ingresa un email válido</p>
                }
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Total a pagar</label>
                <div class="flex items-center justify-between px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-inner shadow-blue-900/30">
                  <div>
                    <p class="text-xs uppercase text-blue-100/80">Monto</p>
                    <p class="text-xl font-extrabold tracking-tight">\${{ cartService.total().toLocaleString('es-CO') }} COP</p>
                  </div>
                  <span class="text-sm px-3 py-1 rounded-full bg-white/15 border border-white/20">PSE</span>
                </div>
              </div>

              @if (errorMessage()) {
                <div class="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-sm text-red-200">
                  {{ errorMessage() }}
                </div>
              }

              <div class="flex gap-3">
                <button
                  type="button"
                  (click)="goBack()"
                  class="w-1/3 px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 font-semibold hover:border-slate-500 transition"
                  [disabled]="loading()"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-900/30 hover:from-blue-500 hover:to-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  [disabled]="paymentForm.invalid || loading() || cartService.items().length === 0"
                >
                  @if (loading()) {
                    <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Procesando...</span>
                  } @else {
                    <span>Continuar al pago</span>
                  }
                </button>
              </div>
            </form>

            <div class="mt-5 text-xs text-slate-500 flex items-center gap-2">
              <span class="h-6 w-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">🔒</span>
              Tus datos están cifrados y se validan directamente con el banco vía PSE.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class PseStartComponent {
  private fb = inject(FormBuilder);
  private paymentService = inject(PaymentService);
  private authService = inject(AuthService);
  cartService = inject(CartService);
  private router = inject(Router);

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  paymentForm: FormGroup;

  constructor() {
    // Get authenticated user's email or empty string
    const userEmail = this.authService.currentUser()?.correo || '';

    this.paymentForm = this.fb.group({
      buyerEmail: [userEmail, [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid || this.cartService.items().length === 0) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const request: CreatePaymentRequest = {
      amount: this.cartService.total(),
      currency: 'COP',
      buyerEmail: this.paymentForm.value.buyerEmail,
      returnUrl: `${window.location.origin}/pago/resultado`
    };

    this.paymentService.initiatePSE(request).subscribe({
      next: (response) => {
        // Redirigir a la URL de PSE mock
        window.location.href = response.redirectUrl;
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Error al procesar el pago. Intenta nuevamente.'
        );
        console.error('Error initiating PSE payment:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
}

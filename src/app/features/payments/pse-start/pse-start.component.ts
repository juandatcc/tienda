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
    <div class="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="text-blue-400">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-white mb-2">Pago con PSE</h1>
          <p class="text-slate-400">Completa los datos para procesar tu pago de forma segura</p>
        </div>

        <!-- Resumen del Carrito -->
        @if (cartService.items().length > 0) {
          <div class="bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-700">
            <h3 class="text-lg font-bold text-white mb-4">Resumen de tu compra</h3>
            <div class="space-y-3 mb-4">
              @for (item of cartService.items(); track item.product.id) {
                <div class="flex justify-between items-center text-sm">
                  <span class="text-slate-300">{{ item.product.name }} x{{ item.quantity }}</span>
                  <span class="text-white font-semibold">\${{ (item.product.price * item.quantity).toLocaleString('es-CO') }}</span>
                </div>
              }
            </div>
            <div class="pt-4 border-t border-slate-700 flex justify-between items-center">
              <span class="text-lg font-bold text-white">Total a Pagar</span>
              <span class="text-2xl font-bold text-blue-400">\${{ cartService.total().toLocaleString('es-CO') }} COP</span>
            </div>
          </div>
        }

        <!-- Formulario PSE -->
        <div class="bg-slate-800 rounded-2xl p-8 border border-slate-700">
          <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()">
            <!-- Email -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-300 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                formControlName="buyerEmail"
                class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                placeholder="tu@email.com"
              />
              @if (paymentForm.get('buyerEmail')?.invalid && paymentForm.get('buyerEmail')?.touched) {
                <p class="text-red-400 text-sm mt-2">Ingresa un email válido</p>
              }
            </div>

            <!-- Monto (readonly) -->
            <div class="mb-6">
              <label class="block text-sm font-medium text-slate-300 mb-2">
                Monto a Pagar (COP)
              </label>
              <input
                type="text"
                [value]="'\$' + cartService.total().toLocaleString('es-CO')"
                readonly
                class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white cursor-not-allowed"
              />
            </div>

            <!-- Error Message -->
            @if (errorMessage()) {
              <div class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p class="text-red-400 text-sm">{{ errorMessage() }}</p>
              </div>
            }

            <!-- Buttons -->
            <div class="flex gap-4">
              <button
                type="button"
                (click)="goBack()"
                class="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
                [disabled]="loading()"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                [disabled]="paymentForm.invalid || loading() || cartService.items().length === 0"
              >
                @if (loading()) {
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Procesando...</span>
                } @else {
                  <span>Continuar al Pago</span>
                }
              </button>
            </div>
          </form>
        </div>

        <!-- Información de Seguridad -->
        <div class="mt-6 text-center">
          <p class="text-slate-500 text-sm">
            🔒 Tus datos están protegidos. PSE es un sistema seguro de pagos electrónicos.
          </p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
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

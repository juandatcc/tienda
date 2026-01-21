import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { CartService } from '../../../core/services/cart.service';
import { PaymentTransaction, PaymentStatus } from '../../../core/models/payment.model';

@Component({
    selector: 'app-pse-return',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        
        @if (loading()) {
          <!-- Loading State -->
          <div class="text-center py-20">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 mb-6">
              <svg class="animate-spin h-12 w-12 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Verificando tu pago...</h2>
            <p class="text-slate-400">Por favor espera un momento</p>
          </div>
        }

        @if (!loading() && transaction()) {
          <!-- Success State -->
          @if (transaction()?.status === 'APPROVED') {
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-6 animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                  class="text-green-400">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h1 class="text-4xl font-bold text-white mb-2">¡Pago Exitoso!</h1>
              <p class="text-slate-400">Tu transacción ha sido aprobada correctamente</p>
            </div>

            <div class="bg-slate-800 rounded-2xl p-8 border border-slate-700 mb-6">
              <h3 class="text-lg font-bold text-white mb-6">Detalles de la Transacción</h3>
              
              <div class="space-y-4">
                <div class="flex justify-between py-3 border-b border-slate-700">
                  <span class="text-slate-400">Referencia</span>
                  <span class="text-white font-mono font-semibold">{{ transaction()?.reference }}</span>
                </div>
                
                <div class="flex justify-between py-3 border-b border-slate-700">
                  <span class="text-slate-400">Monto</span>
                  <span class="text-white font-bold">\${{ typeof transaction()?.amount === 'number' ? transaction()!.amount!.toLocaleString('es-CO') : '' }} {{ transaction()?.currency }}</span>
                </div>
                
                @if (transaction()?.pseTransactionId) {
                  <div class="flex justify-between py-3 border-b border-slate-700">
                    <span class="text-slate-400">ID Transacción PSE</span>
                    <span class="text-white font-mono text-sm">{{ transaction()?.pseTransactionId }}</span>
                  </div>
                }
                
                @if (transaction()?.pseBankCode) {
                  <div class="flex justify-between py-3 border-b border-slate-700">
                    <span class="text-slate-400">Banco</span>
                    <span class="text-white">{{ transaction()?.pseBankCode }}</span>
                  </div>
                }
                
                <div class="flex justify-between py-3 border-b border-slate-700">
                  <span class="text-slate-400">Email</span>
                  <span class="text-white">{{ transaction()?.buyerEmail }}</span>
                </div>
                
                <div class="flex justify-between py-3 border-b border-slate-700">
                  <span class="text-slate-400">Estado</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-400">
                    ✓ {{ transaction()?.status }}
                  </span>
                </div>
                
                <div class="flex justify-between py-3">
                  <span class="text-slate-400">Fecha</span>
                  <span class="text-white">{{ formatDate(transaction()?.createdAt) }}</span>
                </div>
              </div>
            </div>

            <div class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
              <p class="text-blue-300 text-sm text-center">
                📧 Recibirás un correo de confirmación en {{ transaction()?.buyerEmail }}
              </p>
            </div>
          }

          <!-- Rejected/Cancelled/Pending State -->
          @if (transaction()?.status !== 'APPROVED') {
            <div class="text-center mb-8">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                  class="text-red-400">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <h1 class="text-4xl font-bold text-white mb-2">Pago {{ getStatusText(transaction()?.status) }}</h1>
              <p class="text-slate-400">{{ getStatusMessage(transaction()?.status) }}</p>
            </div>

            <div class="bg-slate-800 rounded-2xl p-8 border border-slate-700 mb-6">
              <h3 class="text-lg font-bold text-white mb-6">Detalles</h3>
              
              <div class="space-y-4">
                <div class="flex justify-between py-3 border-b border-slate-700">
                  <span class="text-slate-400">Referencia</span>
                  <span class="text-white font-mono font-semibold">{{ transaction()?.reference }}</span>
                </div>
                
                <div class="flex justify-between py-3 border-b border-slate-700">
                  <span class="text-slate-400">Estado</span>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400">
                    ✗ {{ transaction()?.status }}
                  </span>
                </div>
              </div>
            </div>
          }

          <!-- Action Buttons -->
          <div class="flex gap-4">
            <button
              routerLink="/products"
              class="flex-1 px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
            >
              Continuar Comprando
            </button>
            <button
              routerLink="/"
              class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition"
            >
              Ir al Inicio
            </button>
          </div>
        }

        @if (!loading() && errorMessage()) {
          <!-- Error State -->
          <div class="text-center py-20">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                class="text-red-400">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Error al Verificar Pago</h2>
            <p class="text-red-400 mb-6">{{ errorMessage() }}</p>
            <button
              routerLink="/cart"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition"
            >
              Volver al Carrito
            </button>
          </div>
        }
      </div>
    </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class PseReturnComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private paymentService = inject(PaymentService);
    private cartService = inject(CartService);

    loading = signal(true);
    transaction = signal<PaymentTransaction | null>(null);
    errorMessage = signal<string | null>(null);

    ngOnInit(): void {
        // Leer parámetros de la URL: reference, status, transactionId, bankCode
        this.route.queryParams.subscribe(params => {
            const reference = params['reference'];

            if (!reference) {
                this.errorMessage.set('No se encontró la referencia del pago');
                this.loading.set(false);
                return;
            }

            // Consultar el estado de la transacción en el backend
            this.paymentService.getPaymentStatus(reference).subscribe({
                next: (transaction) => {
                    this.transaction.set(transaction);
                    this.loading.set(false);

                    // Si el pago fue aprobado, limpiar el carrito
                    if (transaction.status === PaymentStatus.APPROVED) {
                        this.cartService.clearCart();
                    }
                },
                error: (error) => {
                    this.errorMessage.set(
                        error.error?.message || 'Error al consultar el estado del pago'
                    );
                    this.loading.set(false);
                    console.error('Error fetching payment status:', error);
                }
            });
        });
    }

    formatDate(dateString: string | undefined): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getStatusText(status: PaymentStatus | undefined): string {
        switch (status) {
            case PaymentStatus.REJECTED:
                return 'Rechazado';
            case PaymentStatus.CANCELLED:
                return 'Cancelado';
            case PaymentStatus.PENDING:
                return 'Pendiente';
            default:
                return 'No Procesado';
        }
    }

    getStatusMessage(status: PaymentStatus | undefined): string {
        switch (status) {
            case PaymentStatus.REJECTED:
                return 'La transacción fue rechazada por el banco. Por favor, intenta con otro método de pago.';
            case PaymentStatus.CANCELLED:
                return 'La transacción fue cancelada. Puedes intentar nuevamente cuando lo desees.';
            case PaymentStatus.PENDING:
                return 'La transacción está pendiente de confirmación. Te notificaremos cuando se procese.';
            default:
                return 'No se pudo procesar el pago correctamente.';
        }
    }
}

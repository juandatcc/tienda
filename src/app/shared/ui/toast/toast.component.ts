import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="fixed top-20 right-4 z-[9999] space-y-2 pointer-events-none">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div 
          class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-xl border animate-slide-in-right"
          [class]="getClasses(notification.type)"
          (click)="notificationService.remove(notification.id)">
          
          <!-- Icono -->
          <div class="flex-shrink-0">
            @if (notification.type === 'success') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            }
            @if (notification.type === 'error') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
            @if (notification.type === 'info') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            @if (notification.type === 'warning') {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          </div>

          <!-- Mensaje -->
          <p class="text-sm font-medium flex-1">{{ notification.message }}</p>

          <!-- Botón cerrar -->
          <button 
            (click)="notificationService.remove(notification.id)"
            class="flex-shrink-0 hover:opacity-70 transition-opacity">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
    styles: [`
    @keyframes slide-in-right {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .animate-slide-in-right {
      animation: slide-in-right 0.3s ease-out;
    }
  `]
})
export class ToastComponent {
    notificationService = inject(NotificationService);

    getClasses(type: 'success' | 'error' | 'info' | 'warning'): string {
        const baseClasses = 'cursor-pointer transition-all hover:scale-105';

        switch (type) {
            case 'success':
                return `${baseClasses} bg-emerald-950/90 border-emerald-400/30 text-emerald-400`;
            case 'error':
                return `${baseClasses} bg-red-950/90 border-red-400/30 text-red-400`;
            case 'info':
                return `${baseClasses} bg-blue-950/90 border-blue-400/30 text-blue-400`;
            case 'warning':
                return `${baseClasses} bg-yellow-950/90 border-yellow-400/30 text-yellow-400`;
            default:
                return baseClasses;
        }
    }
}

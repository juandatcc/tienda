import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-product-skeleton',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 shadow-lg animate-pulse">
      <!-- Image Skeleton -->
      <div class="relative w-full pt-[75%] bg-slate-800/50"></div>

      <!-- Content Skeleton -->
      <div class="flex flex-col flex-1 p-5 space-y-3">
        <!-- Title -->
        <div class="h-5 bg-slate-800/50 rounded w-3/4"></div>
        <div class="h-5 bg-slate-800/50 rounded w-1/2"></div>

        <!-- Description -->
        <div class="space-y-2 flex-1">
          <div class="h-3 bg-slate-800/50 rounded w-full"></div>
          <div class="h-3 bg-slate-800/50 rounded w-5/6"></div>
        </div>

        <!-- Price and Button -->
        <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
          <div class="h-8 bg-slate-800/50 rounded w-24"></div>
          <div class="h-10 bg-slate-800/50 rounded w-28"></div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class ProductSkeletonComponent {
    @Input() count: number = 1;
}

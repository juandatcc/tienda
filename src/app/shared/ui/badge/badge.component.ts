import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="inline-flex items-center justify-center rounded-full bg-accent text-white font-bold text-[10px] shadow-sm"
      [ngClass]="size === 'sm' ? 'h-4 min-w-4 px-1' : 'h-5 min-w-5 px-1.5'"
    >
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  @Input() size: 'sm' | 'md' = 'md';
}

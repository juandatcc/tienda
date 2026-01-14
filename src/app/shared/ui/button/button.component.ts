import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de botón reutilizable con variantes y tamaños.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  /** Variante visual del botón: 'primary' (relleno), 'outline' (borde), 'ghost' (texto) */
  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';
  /** Tamaño del botón */
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  /** Tipo de botón HTML */
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  /** Estado deshabilitado */
  @Input() disabled = false;
  /** Estado de carga (muestra spinner) */
  @Input() loading = false;
  /** Si debe ocupar todo el ancho disponible */
  @Input() fullWidth = false;

  /** Evento emitido al hacer click */
  @Output() onClick = new EventEmitter<Event>();

  /**
   * Genera las clases CSS dinámicamente según las props.
   */
  getClasses(): string {
    const base = 'font-medium rounded-full';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-dark shadow-lg hover:shadow-primary/30',
      outline: 'border border-slate-200 text-slate-700 hover:bg-slate-50',
      ghost: 'text-slate-600 hover:bg-slate-100'
    };

    const sizes = {
      sm: 'px-4 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-3 text-lg'
    };

    return [
      base,
      'focus:outline-none focus:ring-2 focus:ring-offset-2', // Accessibility & Focus
      this.variant === 'primary' ? 'focus:ring-primary' : '',
      this.variant === 'outline' ? 'focus:ring-slate-200' : '',
      this.variant === 'ghost' ? 'focus:ring-slate-200' : '',
      variants[this.variant],
      sizes[this.size],
      this.fullWidth ? 'w-full' : ''
    ].join(' ');
  }
}

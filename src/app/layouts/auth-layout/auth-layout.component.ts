import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-neutral-950 text-white relative overflow-hidden">
      <div class="absolute -top-20 -left-10 h-72 w-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 -right-20 h-80 w-80 bg-emerald-500/15 rounded-full blur-3xl"></div>

      <div class="relative grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <!-- Panel visual -->
        <div class="relative hidden lg:flex overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80"
            alt="TechHub"
            class="absolute inset-0 h-full w-full object-cover"
          />
          <div class="absolute inset-0 bg-linear-to-br from-black/80 via-black/60 to-black/80"></div>
          <div class="relative z-10 flex flex-col justify-between p-12">
            <div class="flex items-center gap-3 select-none">
              <a routerLink="/" class="text-2xl font-bold text-white hover:text-blue-200 transition-colors">TechHub</a>
              <span class="px-3 py-1 text-xs rounded-full bg-white/10 border border-white/15">Innovación</span>
            </div>
            <div class="space-y-4 max-w-xl">
              <p class="text-3xl font-semibold leading-snug">Compra con confianza, recibe rápido.</p>
              <p class="text-slate-200/80 text-lg leading-relaxed">
                Elige tus productos favoritos y nosotros nos encargamos del resto. Envíos rápidos, pagos seguros y
                soporte siempre disponible.
              </p>
            </div>
          </div>
        </div>

        <!-- Contenedor del formulario -->
        <div class="flex items-center justify-center px-4 py-10">
          <div
            class="w-full max-w-xl bg-neutral-900/85 border border-neutral-800 rounded-2xl shadow-2xl shadow-blue-900/30 p-8 sm:p-10 backdrop-blur">
            <div class="flex items-center justify-between mb-6">
              <a routerLink="/" class="text-xl font-semibold tracking-tight">TechHub</a>
              <span class="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-200 border border-blue-500/30">Acceso seguro</span>
            </div>
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent { }

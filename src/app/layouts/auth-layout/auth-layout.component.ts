import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col md:flex-row bg-surface">
      <!-- Lado Izquierdo: Marca/Imagen -->
      <div
        class="hidden md:flex flex-col justify-between w-1/2 bg-secondary p-12 text-white relative overflow-hidden"
      >
        <div
          class="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"
        ></div>
        <div class="relative z-10">
          <a routerLink="/" class="text-2xl font-bold tracking-tighter">TechHub</a>
        </div>
        <div class="relative z-10">
          <blockquote class="text-xl font-medium leading-relaxed">
            "La tecnología conecta a las personas, nosotros te conectamos con la mejor tecnología."
          </blockquote>
        </div>
      </div>

      <!-- Lado Derecho: Contenido del Formulario -->
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="w-full max-w-sm space-y-8 animate-slide-up">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
})
export class AuthLayoutComponent { }

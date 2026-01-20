import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-4xl font-bold text-white mb-2">Mi Perfil</h1>
            <p class="text-slate-400">Administra tu información personal</p>
          </div>
          <button routerLink="/" class="p-3 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>

        @if (user()) {
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Información del Usuario -->
            <div class="lg:col-span-1">
              <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div class="flex flex-col items-center text-center">
                  <!-- Avatar -->
                  <div class="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center mb-4 text-white text-3xl font-bold shadow-xl">
                    {{ getInitials(user()!.nombre) }}
                  </div>
                  
                  <h2 class="text-xl font-bold text-white mb-1">{{ user()?.nombre }}</h2>
                  <p class="text-slate-400 text-sm mb-4">{{ user()?.correo }}</p>
                  
                  <!-- Badge de Rol -->
                  <span class="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold"
                    [class.bg-purple-500/10]="user()?.rol === 'ADMIN'"
                    [class.text-purple-400]="user()?.rol === 'ADMIN'"
                    [class.bg-blue-500/10]="user()?.rol === 'USER'"
                    [class.text-blue-400]="user()?.rol === 'USER'">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1.5">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    {{ user()?.rol === 'ADMIN' ? 'Administrador' : 'Usuario' }}
                  </span>
                </div>

                <div class="mt-6 pt-6 border-t border-slate-700">
                  <div class="space-y-3 text-sm">
                    <div class="flex items-center text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-slate-500">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      <span class="text-slate-400">Dirección:</span>
                      <span class="ml-auto text-white">{{ user()?.direccion || 'No especificada' }}</span>
                    </div>
                    <div class="flex items-center text-slate-300">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-slate-500">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <span class="text-slate-400">Teléfono:</span>
                      <span class="ml-auto text-white">{{ user()?.telefono || 'No especificado' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulario de Edición -->
            <div class="lg:col-span-2">
              <div class="bg-slate-800 rounded-2xl p-8 border border-slate-700">
                <h3 class="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-3 text-blue-400">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                  </svg>
                  Editar Información
                </h3>

                <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="space-y-6">
                  <!-- Nombre -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      formControlName="nombre"
                      class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                      placeholder="Tu nombre completo"
                    />
                    @if (profileForm.get('nombre')?.invalid && profileForm.get('nombre')?.touched) {
                      <p class="text-red-400 text-sm mt-2">El nombre es requerido</p>
                    }
                  </div>

                  <!-- Email (readonly) -->
                  <div>
                    <label class="block text-sm font-medium text-slate-300 mb-2">Correo Electrónico</label>
                    <input
                      type="email"
                      formControlName="correo"
                      readonly
                      class="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                    />
                    <p class="text-slate-500 text-xs mt-2">El correo no puede ser modificado</p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Teléfono -->
                    <div>
                      <label class="block text-sm font-medium text-slate-300 mb-2">Teléfono</label>
                      <input
                        type="tel"
                        formControlName="telefono"
                        class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                        placeholder="3001234567"
                      />
                    </div>

                    <!-- Dirección -->
                    <div>
                      <label class="block text-sm font-medium text-slate-300 mb-2">Dirección</label>
                      <input
                        type="text"
                        formControlName="direccion"
                        class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition"
                        placeholder="Calle 123 #45-67"
                      />
                    </div>
                  </div>

                  <!-- Error Message -->
                  @if (errorMessage()) {
                    <div class="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <p class="text-red-400 text-sm">{{ errorMessage() }}</p>
                    </div>
                  }

                  <!-- Success Message -->
                  @if (successMessage()) {
                    <div class="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p class="text-green-400 text-sm">{{ successMessage() }}</p>
                    </div>
                  }

                  <!-- Buttons -->
                  <div class="flex gap-4 pt-4">
                    <button
                      type="submit"
                      class="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      [disabled]="profileForm.invalid || isSubmitting()"
                    >
                      @if (isSubmitting()) {
                        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Guardando...</span>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17 21 17 13 7 13 7 21"/>
                          <polyline points="7 3 7 8 15 8"/>
                        </svg>
                        <span>Guardar Cambios</span>
                      }
                    </button>
                    <button
                      type="button"
                      (click)="resetForm()"
                      class="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>

              <!-- Panel de Admin (solo si es admin) -->
              @if (user()?.rol === 'ADMIN') {
                <div class="mt-6 bg-linear-to-r from-purple-900/20 to-purple-800/20 border border-purple-700/30 rounded-2xl p-6">
                  <div class="flex items-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-400 mr-3">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <h4 class="text-lg font-bold text-white">Panel de Administrador</h4>
                  </div>
                  <p class="text-purple-300 text-sm mb-4">Tienes acceso a funciones administrativas especiales</p>
                  <button routerLink="/admin" class="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-500 transition text-sm">
                    Ir al Panel Admin
                  </button>
                </div>
              }
            </div>
          </div>
        } @else {
          <div class="text-center py-20">
            <p class="text-slate-400">Cargando perfil...</p>
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
export class ProfileComponent implements OnInit {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private router = inject(Router);

    user = signal<User | null>(null);
    profileForm: FormGroup;
    isSubmitting = signal(false);
    errorMessage = signal<string | null>(null);
    successMessage = signal<string | null>(null);

    constructor() {
        this.profileForm = this.fb.group({
            nombre: ['', [Validators.required]],
            correo: [{ value: '', disabled: true }],
            telefono: [''],
            direccion: ['']
        });
    }

    ngOnInit(): void {
        const currentUser = this.authService.currentUser();
        if (!currentUser) {
            this.router.navigate(['/auth/login']);
            return;
        }

        this.user.set(currentUser);
        this.profileForm.patchValue({
            nombre: currentUser.nombre,
            correo: currentUser.correo,
            telefono: currentUser.telefono || '',
            direccion: currentUser.direccion || ''
        });
    }

    getInitials(name: string): string {
        if (!name) return '?';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    onSubmit(): void {
        if (this.profileForm.invalid) return;

        this.isSubmitting.set(true);
        this.errorMessage.set(null);
        this.successMessage.set(null);

        // Simulamos actualización (aquí irían las llamadas al backend)
        setTimeout(() => {
            const updatedUser: User = {
                ...this.user()!,
                nombre: this.profileForm.value.nombre,
                telefono: this.profileForm.value.telefono,
                direccion: this.profileForm.value.direccion
            };

            // Actualizar en localStorage
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            // Actualizar signal
            this.authService.currentUser.set(updatedUser);
            this.user.set(updatedUser);

            this.isSubmitting.set(false);
            this.successMessage.set('Perfil actualizado correctamente');

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => this.successMessage.set(null), 3000);
        }, 1000);
    }

    resetForm(): void {
        const currentUser = this.user();
        if (currentUser) {
            this.profileForm.patchValue({
                nombre: currentUser.nombre,
                telefono: currentUser.telefono || '',
                direccion: currentUser.direccion || ''
            });
        }
        this.errorMessage.set(null);
        this.successMessage.set(null);
    }
}

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guardia de autenticación para proteger rutas.
 * Verifica si el usuario tiene una sesión activa.
 * Si no está autenticado, redirige al login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) {
    return true;
  }

  // Redirigir al login si no hay usuario
  return router.createUrlTree(['/auth/login']);
};

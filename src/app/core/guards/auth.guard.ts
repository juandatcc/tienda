import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guardia de autenticación para proteger rutas.
 * Verifica si el usuario tiene una sesión activa.
 * Si no está autenticado, redirige al login.
 */
export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = authService.currentUser();
  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  const requiredRole = route.data?.['role'];
  if (requiredRole && user.rol !== requiredRole) {
    return router.createUrlTree(['/']);
  }

  return true;
};


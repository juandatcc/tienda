import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guardia de Autenticación para Proteger Rutas
 * 
 * Este guardia protege rutas que requieren autenticación y/o roles específicos.
 * Implementa la interface CanActivateFn de Angular Router.
 * 
 * Funcionalidades:
 * 1. **Verificación de Autenticación**: Comprueba si existe un usuario autenticado
 * 2. **Control de Roles**: Valida si el usuario tiene el rol requerido (ADMIN/CLIENT)
 * 3. **Redirección Automática**: Redirige a login si no está autenticado, o a home si no tiene permisos
 * 
 * @param route - Información de la ruta que se intenta activar, contiene los datos de rol requerido
 * @returns `true` si el usuario puede acceder, o un `UrlTree` para redirigir
 * 
 * @example
 * ```typescript
 * // En app.routes.ts:
 * {
 *   path: 'admin',
 *   canActivate: [authGuard],
 *   data: { role: 'ADMIN' },  // Solo administradores
 *   loadComponent: () => import('./admin/admin.component')
 * }
 * 
 * // Sin rol específico (solo requiere autenticación):
 * {
 *   path: 'profile',
 *   canActivate: [authGuard],
 *   loadComponent: () => import('./profile/profile.component')
 * }
 * ```
 */
export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener el usuario actual del signal
  const user = authService.currentUser();

  // Si no hay usuario autenticado, redirigir a login
  if (!user) {
    return router.createUrlTree(['/auth/login']);
  }

  // Verificar si la ruta requiere un rol específico
  const requiredRole = route.data?.['role'];
  if (requiredRole && user.rol !== requiredRole) {
    // Si el usuario no tiene el rol requerido, redirigir a home
    return router.createUrlTree(['/']);
  }

  // Usuario autenticado y con permisos correctos
  return true;
};


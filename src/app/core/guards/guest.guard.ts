import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guardia para Páginas de Invitados (Guest Guard)
 * 
 * Este guardia protege rutas que solo deben ser accesibles para usuarios NO autenticados.
 * Es el complemento inverso del authGuard.
 * 
 * Uso común:
 * - Página de login
 * - Página de registro
 * - Página de recuperación de contraseña
 * 
 * Si un usuario ya autenticado intenta acceder a estas páginas,
 * será redirigido automáticamente a la página principal.
 * Esto mejora la experiencia de usuario evitando que vean
 * formularios de login cuando ya tienen sesión activa.
 * 
 * @returns `true` si el usuario NO está autenticado (puede acceder), o un `UrlTree` para redirigir a home
 * 
 * @example
 * ```typescript
 * // En app.routes.ts:
 * {
 *   path: 'auth',
 *   canActivate: [guestGuard],  // Solo usuarios no autenticados
 *   children: [
 *     {
 *       path: 'login',
 *       loadComponent: () => import('./login/login.component')
 *     },
 *     {
 *       path: 'register',
 *       loadComponent: () => import('./register/register.component')
 *     }
 *   ]
 * }
 * ```
 */
export const guestGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Obtener el usuario actual del signal
    const user = authService.currentUser();

    // Si el usuario ya está autenticado, redirigir a home
    if (user) {
        return router.createUrlTree(['/']);
    }

    // Usuario no autenticado, puede acceder a la ruta
    return true;
};

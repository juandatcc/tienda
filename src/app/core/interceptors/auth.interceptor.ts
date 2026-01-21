import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interceptor de Autenticación HTTP
 * 
 * Este interceptor se ejecuta automáticamente en TODAS las peticiones HTTP
 * realizadas desde la aplicación. Su función principal es adjuntar el token
 * de autenticación JWT al header Authorization de cada petición.
 * 
 * Flujo de funcionamiento:
 * 1. Se intercepta la petición HTTP antes de enviarla
 * 2. Se verifica si existe un token en localStorage
 * 3. Si existe token, se clona la petición añadiendo el header "Authorization: Bearer {token}"
 * 4. Se envía la petición modificada (o la original si no hay token)
 * 
 * Esto evita tener que añadir manualmente el token en cada petición HTTP,
 * centralizando la lógica de autenticación.
 * 
 * @example
 * ```typescript
 * // Configuración en app.config.ts:
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(
 *       withInterceptors([authInterceptor])
 *     )
 *   ]
 * };
 * 
 * // Después, todas las peticiones llevarán el token automáticamente:
 * this.http.get('/api/profile')  // <- Token incluido automáticamente
 * ```
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  /**
   * Intercepta y modifica peticiones HTTP para incluir el token de autenticación
   * 
   * @param req - Petición HTTP original
   * @param next - Manejador para continuar con la cadena de interceptores
   * @returns Observable con el evento HTTP (respuesta o error)
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Intentar obtener el token de localStorage (solo en navegador, no en SSR)
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

    if (token) {
      // Clonar la petición añadiendo el header de autorización
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      });
      // Enviar la petición modificada
      return next.handle(cloned);
    }

    // Si no hay token, enviar la petición original sin modificar
    return next.handle(req);
  }
}

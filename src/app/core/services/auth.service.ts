import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthResponse } from '../models/user.model';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

/**
 * Servicio de Autenticación de TechHub
 * 
 * Este servicio gestiona toda la lógica de autenticación de usuarios:
 * - Inicio de sesión (login)
 * - Registro de nuevos usuarios
 * - Cierre de sesión (logout)
 * - Persistencia de sesión en localStorage
 * - Manejo del usuario actual mediante signals
 * 
 * El servicio se comunica con el backend y mapea los campos entre
 * el formato del frontend (camelCase) y el backend (español).
 * 
 * @example
 * ```typescript
 * constructor(private authService: AuthService) {}
 * 
 * login() {
 *   this.authService.login({ email: 'user@mail.com', password: '123456' })
 *     .subscribe(response => console.log('Sesión iniciada'));
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /** Cliente HTTP para realizar peticiones al backend */
  private http = inject(HttpClient);

  /** Router para navegación entre páginas */
  private router = inject(Router);

  /** Servicio del carrito para sincronizar al iniciar/cerrar sesión */
  private cartService = inject(CartService);

  /** URL base del API de autenticación */
  /** URL base del API de autenticación */
  private apiUrl = `${environment.apiUrl}/auth`;

  /** 
   * Signal que contiene el usuario autenticado actual
   * 
   * Es null cuando no hay sesión activa.
   * Se actualiza automáticamente al hacer login/logout.
   * Otros componentes pueden suscribirse a este signal para reaccionar
   * a cambios en el estado de autenticación.
   */
  currentUser = signal<User | null>(null);

  /**
   * Constructor del servicio
   * 
   * Intenta restaurar la sesión desde localStorage al iniciar la aplicación.
   * Esto permite que el usuario permanezca autenticado después de recargar la página.
   */
  constructor() {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        this.currentUser.set(JSON.parse(user));
      }
    }
  }

  /**
   * Inicia sesión con credenciales de email y contraseña
   * 
   * Mapea los campos del frontend (email, password) al formato esperado
   * por el backend (correo, contrasena) y guarda la sesión localmente.
   * 
   * @param credentials - Credenciales del usuario
   * @param credentials.email - Correo electrónico del usuario
   * @param credentials.password - Contraseña del usuario
   * @returns Observable que emite la respuesta de autenticación con el token
   * 
   * @example
   * ```typescript
   * this.authService.login({ email: 'usuario@mail.com', password: '123456' })
   *   .subscribe({
   *     next: (response) => console.log('Login exitoso', response),
   *     error: (err) => console.error('Error en login', err)
   *   });
   * ```
   */
  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    const payload = {
      correo: credentials.email,
      contrasena: credentials.password,
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      tap((response) => {
        this.saveSession(response);
      })
    );
  }

  /**
   * Registra un nuevo usuario en el sistema
   * 
   * Crea una cuenta nueva enviando los datos al backend.
   * Si se proporciona un código de administrador válido, el usuario
   * se registrará con rol ADMIN; de lo contrario, será CLIENT.
   * 
   * @param userData - Datos del nuevo usuario
   * @param userData.fullName - Nombre completo del usuario
   * @param userData.email - Correo electrónico (único en el sistema)
   * @param userData.password - Contraseña
   * @param userData.phone - Número de teléfono (opcional)
   * @param userData.address - Dirección de envío (opcional)
   * @param userData.adminCode - Código para registro como administrador (opcional)
   * @returns Observable que emite la respuesta de autenticación con el token
   * 
   * @example
   * ```typescript
   * this.authService.register({
   *   fullName: 'Juan Pérez',
   *   email: 'juan@mail.com',
   *   password: 'segura123',
   *   phone: '+57 300 123 4567',
   *   address: 'Calle 123 #45-67'
   * }).subscribe({
   *   next: () => console.log('Registro exitoso'),
   *   error: (err) => console.error('Error en registro', err)
   * });
   * ```
   */
  register(userData: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    adminCode?: string;
  }): Observable<AuthResponse> {
    const payload = {
      nombre: userData.fullName,
      correo: userData.email,
      contrasena: userData.password,
      telefono: userData.phone,
      direccion: userData.address,
      codigoAdmin: userData.adminCode,
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap((response) => {
        this.saveSession(response);
      })
    );
  }

  /**
   * Cierra la sesión del usuario actual
   * 
   * Realiza las siguientes operaciones:
   * 1. Notifica al backend para invalidar el token (mejor práctica de seguridad)
   * 2. Limpia el usuario actual del signal
   * 3. Elimina el token y datos de usuario de localStorage
   * 4. Vacía el carrito de compras
   * 5. Redirige al usuario a la página de login
   * 
   * Nota: Incluso si la petición al backend falla (ej: servidor caído),
   * se realiza la limpieza local para garantizar que el usuario cierre sesión.
   * 
   * @example
   * ```typescript
   * // En un componente:
   * cerrarSesion() {
   *   this.authService.logout();
   * }
   * ```
   */
  logout() {
    // Intentamos notificar al backend; si falla, igualmente limpiamos la sesión local
    this.http.post<void>(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        this.clearSession();
      },
      error: () => {
        // Aun en caso de error, retirar la sesión localmente
        this.clearSession();
      },
    });
  }

  /**
   * Limpia la sesión actual del sistema
   * 
   * Método privado que realiza la limpieza de datos de sesión:
   * - Resetea el signal currentUser a null
   * - Elimina el token del localStorage
   * - Elimina los datos del usuario del localStorage
   * - Vacía el carrito de compras
   * - Navega a la página de login
   */
  private clearSession() {
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.cartService.clearCart();
    this.router.navigate(['/auth/login']);
  }

  /**
   * Guarda la sesión del usuario en el almacenamiento local
   * 
   * Método privado que se ejecuta después de un login o registro exitoso.
   * Realiza las siguientes acciones:
   * 1. Limpia el prefijo 'ROLE_' del rol (formato backend)
   * 2. Construye el objeto User con los datos de la respuesta
   * 3. Actualiza el signal currentUser
   * 4. Guarda el token y usuario en localStorage
   * 5. Sincroniza el carrito con el servidor
   * 
   * @param response - Respuesta del backend con token, correo y rol
   */
  private saveSession(response: AuthResponse) {
    const role = response.rol.replace('ROLE_', '');

    const user: User = {
      correo: response.correo,
      nombre: response.correo.split('@')[0], // Temporal hasta que el backend devuelva el nombre
      rol: role, // ADMIN | USER
      token: response.token,
    };

    this.currentUser.set(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    this.cartService.loadServerCart();
  }

}

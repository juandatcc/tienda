import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, AuthResponse } from '../models/user.model';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cartService = inject(CartService);
  private apiUrl = `${environment.apiUrl}/auth`;

  /** Signal que contiene el usuario actual o null si no hay sesión */
  currentUser = signal<User | null>(null);

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const user = localStorage.getItem('user');
      if (user) {
        this.currentUser.set(JSON.parse(user));
      }
    }
  }

  /**
   * Inicia sesión con credenciales de email y contraseña.
   * Mapea los campos al formato esperado por el backend (correo, contrasena).
   * @param credentials Objeto con email y password
   * @returns Observable con la respuesta de autenticación
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
   * Registra un nuevo usuario en el sistema.
   * @param userData Datos del usuario a registrar
   * @returns Observable con la respuesta de autenticación
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
   * Cierra la sesión del usuario actual llamando al backend para invalidar el token
   * y limpiando el almacenamiento local. Redirige a la página de login.
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

  private clearSession() {
    this.currentUser.set(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/auth/login']);
  }

  /**
   * Guarda la sesión del usuario en localStorage.
   * Mapea la respuesta plana del backend a un objeto User.
   * @param response Respuesta de autenticación con token, correo y rol
   */
  private saveSession(response: AuthResponse) {
    const user: User = {
      email: response.correo,
      role: response.rol, // Validar si el backend envía 'ADMIN' o 'ROLE_ADMIN'
      token: response.token,
    };

    this.currentUser.set(user);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    // Cargar carrito del servidor (si existe)
    try {
      this.cartService.loadServerCart();
    } catch (e) {
      // noop
    }
  }
}

/**
 * Interfaz que representa un usuario del sistema.
 */
export interface User {
  id?: number;
  email: string;
  fullName?: string;
  phone?: string;
  address?: string;
  /** Rol del usuario: 'admin' o 'user' */
  role: string;
  token?: string;
}

/**
 * Respuesta de autenticación del servidor.
 * Coincide con el DTO del backend: { token, correo, rol }
 */
export interface AuthResponse {
  token: string;
  correo: string;
  rol: string;
}

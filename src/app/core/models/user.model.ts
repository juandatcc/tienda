/**
 * Interfaz que representa un usuario del sistema.
 */
export interface User {
  id?: number;
  correo: string;
  nombre: string;
  telefono?: string;
  direccion?: string;
  /** Rol del usuario: 'ADMIN' o 'USER' */
  rol: string;
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

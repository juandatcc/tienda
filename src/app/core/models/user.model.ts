/**
 * Interfaz que representa un usuario del sistema TechHub
 * 
 * Esta interfaz define la estructura de un usuario registrado,
 * incluyendo sus datos personales y rol de acceso.
 * 
 * @example
 * ```typescript
 * const usuario: User = {
 *   id: 1,
 *   correo: 'usuario@techhub.com',
 *   nombre: 'Juan Pérez',
 *   telefono: '+57 300 123 4567',
 *   direccion: 'Calle 123 #45-67',
 *   rol: 'CLIENT'
 * };
 * ```
 */
export interface User {
  /** Identificador único del usuario (generado por la base de datos) */
  id?: number;

  /** Correo electrónico del usuario (utilizado para login) */
  correo: string;

  /** Nombre completo del usuario */
  nombre: string;

  /** Número de teléfono de contacto (opcional) */
  telefono?: string;

  /** Dirección de envío del usuario (opcional) */
  direccion?: string;

  /** Rol del usuario en el sistema: 'ADMIN' para administradores o 'CLIENT' para clientes */
  rol: string;

  /** Token JWT de autenticación (solo presente después del login) */
  token?: string;
}

/**
 * Respuesta de autenticación del servidor
 * 
 * Esta interfaz representa la respuesta que devuelve el backend
 * cuando un usuario inicia sesión exitosamente.
 * Coincide con el DTO del backend: { token, correo, rol }
 * 
 * @example
 * ```typescript
 * const respuesta: AuthResponse = {
 *   token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
 *   correo: 'admin@techhub.com',
 *   rol: 'ADMIN'
 * };
 * ```
 */
export interface AuthResponse {
  /** Token JWT para autenticación en peticiones subsecuentes */
  token: string;

  /** Correo electrónico del usuario autenticado */
  correo: string;

  /** Rol del usuario autenticado */
  rol: string;
}

/**
 * Credenciales para inicio de sesión
 * 
 * Datos requeridos para autenticar un usuario en el sistema
 */
export interface LoginCredentials {
  /** Correo electrónico del usuario */
  correo: string;

  /** Contraseña del usuario */
  password: string;
}

/**
 * Datos para registro de nuevo usuario
 * 
 * Información requerida para crear una cuenta nueva en el sistema
 */
export interface RegisterData {
  /** Correo electrónico (único en el sistema) */
  correo: string;

  /** Nombre completo del usuario */
  nombre: string;

  /** Contraseña (debe cumplir políticas de seguridad) */
  password: string;

  /** Número de teléfono (opcional) */
  telefono?: string;

  /** Dirección de envío (opcional) */
  direccion?: string;
}

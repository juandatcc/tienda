/**
 * Enumeración de roles de usuario en el sistema
 * 
 * Define los diferentes niveles de acceso y permisos en la aplicación.
 * Estos roles se utilizan para control de acceso en guards y componentes.
 */
export enum UserRole {
    /** Usuario administrador con acceso total al sistema */
    ADMIN = 'ADMIN',

    /** Usuario cliente con permisos básicos de compra */
    CLIENT = 'CLIENT'
}

/**
 * Tipo de unión para los valores de rol
 * Útil para validaciones y type-checking estricto
 */
export type UserRoleType = 'ADMIN' | 'CLIENT';

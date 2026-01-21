/**
 * Enumeración de tipos de notificaciones
 * 
 * Define los diferentes estilos visuales de notificaciones toast
 * que se pueden mostrar al usuario.
 */
export enum NotificationType {
    /** Notificación de operación exitosa (verde) */
    SUCCESS = 'success',

    /** Notificación de error (rojo) */
    ERROR = 'error',

    /** Notificación informativa (azul) */
    INFO = 'info',

    /** Notificación de advertencia (amarillo) */
    WARNING = 'warning'
}

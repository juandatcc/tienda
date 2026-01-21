import { Injectable, signal } from '@angular/core';

/**
 * Interfaz que representa una notificación toast
 * 
 * Define la estructura de las notificaciones que se muestran
 * temporalmente en la interfaz de usuario.
 */
export interface Notification {
    /** Identificador único de la notificación */
    id: number;

    /** Tipo de notificación que determina el estilo visual */
    type: 'success' | 'error' | 'info' | 'warning';

    /** Mensaje de texto a mostrar al usuario */
    message: string;

    /** Duración en milisegundos antes de auto-ocultarse (opcional) */
    duration?: number;
}

/**
 * Servicio de Notificaciones Toast de TechHub
 * 
 * Este servicio gestiona las notificaciones emergentes (toast) que se muestran
 * al usuario para dar feedback sobre acciones realizadas en la aplicación.
 * 
 * Características:
 * - 4 tipos de notificaciones: success, error, info, warning
 * - Auto-ocultado configurable por duración
 * - Gestión mediante Angular Signals para reactividad
 * - API simple y limpia
 * 
 * @example
 * ```typescript
 * constructor(private notificationService: NotificationService) {}
 * 
 * guardarProducto() {
 *   this.productService.save(product).subscribe({
 *     next: () => this.notificationService.success('Producto guardado'),
 *     error: () => this.notificationService.error('Error al guardar')
 *   });
 * }
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    /** 
     * Signal que contiene el array de notificaciones activas
     * 
     * Los componentes pueden suscribirse a este signal para
     * mostrar las notificaciones en la interfaz.
     */
    notifications = signal<Notification[]>([]);

    /** Contador para generar IDs únicos de notificaciones */
    /** Contador para generar IDs únicos de notificaciones */
    private nextId = 1;

    /**
     * Muestra una notificación de éxito (verde)
     * 
     * Utilizada para confirmar operaciones exitosas como:
     * - Producto añadido al carrito
     * - Perfil actualizado
     * - Pedido realizado
     * 
     * @param message - Mensaje a mostrar al usuario
     * @param duration - Duración en milisegundos (por defecto 3000ms = 3s)
     * 
     * @example
     * ```typescript
     * this.notificationService.success('Producto añadido al carrito');
     * ```
     */
    success(message: string, duration: number = 3000) {
        this.show('success', message, duration);
    }

    /**
     * Muestra una notificación de error (roja)
     * 
     * Utilizada para informar sobre errores como:
     * - Error de conexión al servidor
     * - Credenciales incorrectas
     * - Producto sin stock
     * 
     * @param message - Mensaje de error a mostrar
     * @param duration - Duración en milisegundos (por defecto 5000ms = 5s)
     * 
     * @example
     * ```typescript
     * this.notificationService.error('Error al procesar el pago');
     * ```
     */
    error(message: string, duration: number = 5000) {
        this.show('error', message, duration);
    }

    /**
     * Muestra una notificación informativa (azul)
     * 
     * Utilizada para información general como:
     * - Cargando datos
     * - Nuevas funcionalidades
     * - Mensajes del sistema
     * 
     * @param message - Mensaje informativo a mostrar
     * @param duration - Duración en milisegundos (por defecto 3000ms = 3s)
     * 
     * @example
     * ```typescript
     * this.notificationService.info('Sincronizando carrito...');
     * ```
     */
    info(message: string, duration: number = 3000) {
        this.show('info', message, duration);
    }

    /**
     * Muestra una notificación de advertencia (amarilla)
     * 
     * Utilizada para advertencias como:
     * - Stock máximo alcanzado
     * - Sesión por expirar
     * - Validaciones de formularios
     * 
     * @param message - Mensaje de advertencia a mostrar
     * @param duration - Duración en milisegundos (por defecto 4000ms = 4s)
     * 
     * @example
     * ```typescript
     * this.notificationService.warning('Stock máximo alcanzado (10 unidades)');
     * ```
     */
    warning(message: string, duration: number = 4000) {
        this.show('warning', message, duration);
    }

    /**
     * Método privado para mostrar una notificación genérica
     * 
     * Crea una nueva notificación, la añade al array y programa
     * su eliminación automática después de la duración especificada.
     * 
     * @param type - Tipo de notificación
     * @param message - Mensaje a mostrar
     * @param duration - Duración en milisegundos
     */
    private show(type: 'success' | 'error' | 'info' | 'warning', message: string, duration: number) {
        const notification: Notification = {
            id: this.nextId++,
            type,
            message,
            duration
        };

        this.notifications.update(notifications => [...notifications, notification]);

        // Eliminar automáticamente después de la duración
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification.id);
            }, duration);
        }
    }

    /**
     * Elimina una notificación específica por su ID
     * 
     * Utilizado cuando el usuario hace clic en el botón de cerrar
     * o cuando se cumple el tiempo de auto-ocultado.
     * 
     * @param id - ID único de la notificación a eliminar
     * 
     * @example
     * ```typescript
     * cerrarNotificacion(id: number) {
     *   this.notificationService.remove(id);
     * }
     * ```
     */
    remove(id: number) {
        this.notifications.update(notifications =>
            notifications.filter(n => n.id !== id)
        );
    }

    /**
     * Elimina todas las notificaciones activas
     * 
     * Útil para limpiar la pantalla de notificaciones
     * al navegar entre páginas o realizar acciones específicas.
     * 
     * @example
     * ```typescript
     * limpiarNotificaciones() {
     *   this.notificationService.clear();
     * }
     * ```
     */
    clear() {
        this.notifications.set([]);
    }
}

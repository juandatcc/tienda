/**
 * Constantes de la aplicación TechHub
 * 
 * Este archivo centraliza todas las constantes utilizadas en la aplicación
 * para facilitar el mantenimiento y evitar valores mágicos en el código.
 */

/**
 * Claves para almacenamiento local (localStorage)
 * Utilizadas para persistir datos en el navegador del cliente
 */
export const STORAGE_KEYS = {
    /** Clave para almacenar el token JWT de autenticación */
    TOKEN: 'token',
    /** Clave para almacenar el carrito de compras local */
    CART: 'cart'
} as const;

/**
 * Tiempos en milisegundos
 * Constantes de tiempo para timeouts, delays y duraciones
 */
export const TIMEOUTS = {
    /** Duración de las notificaciones toast antes de auto-ocultarse */
    TOAST_DURATION: 3000,
    /** Delay para debounce en búsquedas */
    SEARCH_DEBOUNCE: 300,
    /** Timeout para peticiones HTTP */
    HTTP_TIMEOUT: 30000
} as const;

/**
 * Límites y restricciones de la aplicación
 */
export const LIMITS = {
    /** Número máximo de productos que se pueden mostrar por página */
    MAX_PRODUCTS_PER_PAGE: 50,
    /** Cantidad máxima de un producto en el carrito */
    MAX_CART_QUANTITY: 99,
    /** Tamaño máximo de imágenes en MB */
    MAX_IMAGE_SIZE_MB: 5
} as const;

/**
 * Mensajes predefinidos del sistema
 * Centralizados para consistencia y facilidad de traducción
 */
export const MESSAGES = {
    SUCCESS: {
        /** Mensaje cuando se añade un producto al carrito */
        PRODUCT_ADDED: 'Producto añadido al carrito',
        /** Mensaje cuando se actualiza el perfil */
        PROFILE_UPDATED: 'Perfil actualizado correctamente',
        /** Mensaje cuando se crea un producto (admin) */
        PRODUCT_CREATED: 'Producto creado exitosamente',
        /** Mensaje cuando se actualiza un producto (admin) */
        PRODUCT_UPDATED: 'Producto actualizado exitosamente'
    },
    ERROR: {
        /** Error genérico de carga */
        LOADING_ERROR: 'Error al cargar los datos',
        /** Error de autenticación */
        AUTH_ERROR: 'Credenciales incorrectas',
        /** Error de conexión al servidor */
        SERVER_ERROR: 'Error de conexión con el servidor',
        /** Error cuando un producto no tiene stock */
        NO_STOCK: 'Producto sin stock disponible'
    },
    WARNING: {
        /** Advertencia cuando se alcanza el stock máximo */
        MAX_STOCK_REACHED: 'Stock máximo alcanzado',
        /** Advertencia de sesión expirada */
        SESSION_EXPIRED: 'Tu sesión ha expirado'
    }
} as const;

/**
 * Rutas de navegación de la aplicación
 * Centralizadas para evitar errores de typo y facilitar cambios
 */
export const ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:id',
    CART: '/cart',
    PROFILE: '/profile',
    ADMIN: {
        DASHBOARD: '/admin',
        PRODUCTS: '/admin/products',
        PRODUCT_FORM: '/admin/products/new',
        PRODUCT_EDIT: '/admin/products/edit/:id'
    }
} as const;

/**
 * Opciones de ordenamiento para productos
 */
export const SORT_OPTIONS = [
    { value: 'name-asc', label: 'Nombre (A-Z)' },
    { value: 'name-desc', label: 'Nombre (Z-A)' },
    { value: 'price-asc', label: 'Precio (Menor a Mayor)' },
    { value: 'price-desc', label: 'Precio (Mayor a Menor)' }
] as const;

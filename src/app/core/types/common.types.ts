/**
 * Tipos TypeScript reutilizables para la aplicación
 * 
 * Este archivo contiene tipos auxiliares, tipos utilitarios y tipos
 * genéricos que se utilizan en múltiples partes de la aplicación.
 */

/**
 * Respuesta genérica de la API
 * 
 * @template T - Tipo de datos que contiene la respuesta
 */
export interface ApiResponse<T> {
    /** Datos devueltos por la API */
    data: T;

    /** Mensaje descriptivo de la operación */
    message?: string;

    /** Indica si la operación fue exitosa */
    success: boolean;
}

/**
 * Respuesta de error de la API
 * 
 * Estructura estándar para errores HTTP
 */
export interface ApiError {
    /** Código de estado HTTP */
    status: number;

    /** Mensaje de error descriptivo */
    message: string;

    /** Detalles adicionales del error (opcional) */
    details?: string[];

    /** Timestamp del error */
    timestamp?: string;
}

/**
 * Opciones de paginación para listados
 */
export interface PaginationOptions {
    /** Página actual (base 1) */
    page: number;

    /** Cantidad de elementos por página */
    limit: number;

    /** Campo por el cual ordenar */
    sortBy?: string;

    /** Dirección del ordenamiento */
    sortOrder?: 'asc' | 'desc';
}

/**
 * Respuesta paginada de la API
 * 
 * @template T - Tipo de elementos en el array de datos
 */
export interface PaginatedResponse<T> {
    /** Array de elementos de la página actual */
    data: T[];

    /** Metadatos de paginación */
    pagination: {
        /** Página actual */
        currentPage: number;

        /** Total de páginas disponibles */
        totalPages: number;

        /** Total de elementos en todos los resultados */
        totalItems: number;

        /** Cantidad de elementos por página */
        itemsPerPage: number;
    };
}

/**
 * Estado de carga para componentes
 * 
 * Útil para manejar estados de peticiones asíncronas
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Opciones de ordenamiento
 */
export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc';

/**
 * Filtros para búsqueda de productos
 */
export interface ProductFilters {
    /** ID de categoría para filtrar */
    categoryId?: number;

    /** Término de búsqueda */
    searchQuery?: string;

    /** Precio mínimo */
    minPrice?: number;

    /** Precio máximo */
    maxPrice?: number;

    /** Mostrar solo productos con stock */
    onlyInStock?: boolean;

    /** Opción de ordenamiento */
    sortBy?: SortOption;
}

/**
 * Tipo para query parameters de la URL
 */
export interface RouteQueryParams {
    /** ID de categoría seleccionada */
    categoria?: string;

    /** Término de búsqueda */
    busqueda?: string;

    /** Página actual */
    pagina?: string;
}

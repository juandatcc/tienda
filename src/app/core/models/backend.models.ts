export interface ProductoResponse {
  // Modelo para respuesta de productos desde el backend
  idProducto: number;
  nombre: string;
  descripcion?: string;
  precio: number; // viene como BigDecimal en backend
  stock: number;
  categoriaId?: number;
  categoriaNombre?: string;
}

export interface ProductoAdminResponse {
  // Modelo para respuesta de productos en administración desde el backend
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId?: number;
  categoriaNombre?: string;
}

export interface ProductoRequest {
  // Modelo para solicitud de creación/edición de productos al backend
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId: number;
}

export interface CategoriaAdminResponse {
  // Modelo para categorías en administración desde el backend
  idCategoria: number;
  nombre: string;
  descripcion?: string;
}

export interface AddToCarritoRequest {
  // Modelo para solicitud de agregar producto al carrito
  productoId: number;
  cantidad: number;
}

export interface CarritoItemResponse {
  // Modelo para ítem del carrito desde el backend
  productoId: number;
  nombreProducto: string;
  descripcionProducto?: string;
  cantidad: number;
  precio: number;
}

export interface CarritoResponse {
  // Modelo para respuesta del carrito desde el backend
  carritoId: number;
  items: CarritoItemResponse[];
}

export interface LoginRequest {
  // Modelo para solicitud de login
  correo: string;
  contrasena: string;
}

export interface RegisterRequest {
  // Modelo para solicitud de registro
  correo: string;
  contrasena: string;
  nombre: string;
  telefono: string;
  direccion?: string;
  codigoAdmin?: string;
}

export interface AuthResponseDTO {
  // Modelo para respuesta de autenticación desde el backend
  token: string;
  correo: string;
  rol: string;
}

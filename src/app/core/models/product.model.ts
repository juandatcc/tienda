/**
 * Interfaz que define la estructura de un producto.
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string; // nombre de categoría (para mostrar)
  categoryId?: number; // id de categoría (para formularios)
  stock: number;
}

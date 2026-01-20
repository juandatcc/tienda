import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { ProductoResponse, ProductoRequest, ProductoAdminResponse } from '../models/backend.models';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/productos`; // Actualizado a ruta en español

  private mapProducto(resp: ProductoResponse | ProductoAdminResponse): Product {
    // El backend puede devolver distintos DTOs; manejamos ambos
    const categoriaNombre = (resp as any).categoriaNombre ?? '';
    const categoriaId = (resp as any).categoriaId ?? undefined;


    return {
      id: Number((resp as any).id ?? (resp as any).idProducto),
      name: (resp as any).nombre,
      description: (resp as any).descripcion ?? '',
      price: Number((resp as any).precio),
      imageUrl: (resp as any).imagenUrl ?? '',
      category: categoriaNombre,
      categoryId: categoriaId,
      stock: (resp as any).stock,
    };
  }

  /**
   * Obtiene la lista completa de productos.
   * @returns Observable con array de productos
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<ProductoResponse[]>(this.apiUrl).pipe(
      map((list) => list.map(this.mapProducto)),
      catchError((error) => {
        console.error('Error loading products', error);
        return of([]); // Retornar array vacío en caso de error para evitar fallos en la app
      })
    );
  }

  /**
   * Obtiene un producto específico por su ID.
   * @param id ID del producto
   * @returns Observable con el producto o undefined si falla
   */
  getProduct(id: number): Observable<Product | undefined> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/${id}`).pipe(
      map(this.mapProducto),
      catchError((error) => {
        console.error(`Error loading product ${id}`, error);
        return of(undefined);
      })
    );
  }

  /**
   * Crea un nuevo producto (convierte al DTO del backend antes de enviar).
   * @param product Datos del producto a crear
   * @returns Observable con el producto creado
   */
  createProduct(product: Product): Observable<Product> {
    if (!product.categoryId) throw new Error('categoryId is required to create a product');
    const payload: ProductoRequest = {
      nombre: product.name,
      descripcion: product.description,
      precio: product.price,
      stock: product.stock,
      categoriaId: product.categoryId,
    };
    return this.http.post<ProductoAdminResponse>(this.apiUrl, payload).pipe(map(this.mapProducto));
  }

  /**
   * Actualiza un producto existente.
   * @param id ID del producto a actualizar
   * @param product Nuevos datos del producto
   * @returns Observable con el producto actualizado
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    if (!product.categoryId) throw new Error('categoryId is required to update a product');
    const payload: ProductoRequest = {
      nombre: product.name,
      descripcion: product.description,
      precio: product.price,
      stock: product.stock,
      categoriaId: product.categoryId,
    };
    return this.http
      .put<ProductoAdminResponse>(`${this.apiUrl}/${id}`, payload)
      .pipe(map(this.mapProducto));
  }

  /**
   * Elimina un producto del sistema.
   * @param id ID del producto a eliminar
   * @returns Observable void
   */
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

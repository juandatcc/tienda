import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/productos`; // Actualizado a ruta en español

  /**
   * Obtiene la lista completa de productos.
   * @returns Observable con array de productos
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(error => {
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
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error loading product ${id}`, error);
        return of(undefined);
      })
    );
  }

  /**
   * Crea un nuevo producto.
   * @param product Datos del producto a crear
   * @returns Observable con el producto creado
   */
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  /**
   * Actualiza un producto existente.
   * @param id ID del producto a actualizar
   * @param product Nuevos datos del producto
   * @returns Observable con el producto actualizado
   */
  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
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

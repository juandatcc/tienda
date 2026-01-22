import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { ProductoResponse, ProductoRequest, ProductoAdminResponse } from '../models/backend.models';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private apiUrl = `${environment.apiUrl}/productos`; // Actualizado a ruta en español

  private mapProducto(resp: ProductoResponse | ProductoAdminResponse): Product {
    // El backend puede devolver distintos DTOs; manejamos ambos
    const categoriaNombre = (resp as any).categoriaNombre ?? '';
    const categoriaId = (resp as any).categoriaId ?? undefined;
    const imagenUrl = this.normalizeImageUrl((resp as any).imagenUrl);


    return {
      id: Number((resp as any).id ?? (resp as any).idProducto),
      name: (resp as any).nombre,
      description: (resp as any).descripcion ?? '',
      price: Number((resp as any).precio),
      imageUrl: imagenUrl,
      category: categoriaNombre,
      categoryId: categoriaId,
      stock: (resp as any).stock,
    };
  }

  /**
   * Devuelve una URL absoluta para la imagen si el backend envía rutas relativas (p.ej. "/api/assets/1").
   * Si ya viene absoluta, se respeta.
   */
  private normalizeImageUrl(imagenUrl?: string): string | undefined {
    if (!imagenUrl) return undefined;
    const trimmed = imagenUrl.trim();
    if (!trimmed) return undefined;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;

    // Quita el sufijo /api para reutilizar el host/base (http://localhost:8080)
    const base = environment.apiUrl.replace(/\/api$/, '');
    const needsSlash = trimmed.startsWith('/') ? '' : '/';
    return `${base}${needsSlash}${trimmed}`;
  }

  /**
   * Obtiene la lista completa de productos.
   * @returns Observable con array de productos
   */
  getProducts(): Observable<Product[]> {
    return this.http.get<ProductoResponse[]>(this.apiUrl).pipe(
      map((list) => list.map((item) => this.mapProducto(item))),
      catchError((error) => {
        console.error('Error loading products', error);
        this.notificationService.error('Error al cargar productos');
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
      map((resp) => this.mapProducto(resp)),
      catchError((error) => {
        console.error(`Error loading product ${id}`, error);
        this.notificationService.error('Error al cargar el producto');
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
      imagenUrl: product.imageUrl,
    };
    return this.http
      .post<ProductoAdminResponse>(this.apiUrl, payload)
      .pipe(map((resp) => this.mapProducto(resp)));
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
      imagenUrl: product.imageUrl,
    };
    return this.http
      .put<ProductoAdminResponse>(`${this.apiUrl}/${id}`, payload)
      .pipe(map((resp) => this.mapProducto(resp)));
  }

  /**
   * Crea un producto cargando la imagen como archivo multipart.
   */
  createProductWithImage(product: Product, file: File): Observable<Product> {
    if (!product.categoryId) throw new Error('categoryId is required to create a product');
    const formData = new FormData();
    formData.append('nombre', product.name);
    formData.append('descripcion', product.description ?? '');
    formData.append('precio', String(product.price));
    formData.append('stock', String(product.stock ?? 0));
    formData.append('categoriaId', String(product.categoryId));
    formData.append('imagen', file);

    return this.http
      .post<ProductoAdminResponse>(`${this.apiUrl}/upload`, formData)
      .pipe(map((resp) => this.mapProducto(resp)));
  }

  /**
   * Sube/actualiza la imagen de un producto existente.
   */
  uploadProductImage(id: number, file: File): Observable<Product> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<ProductoAdminResponse>(`${this.apiUrl}/${id}/imagen`, formData)
      .pipe(map((resp) => this.mapProducto(resp)));
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

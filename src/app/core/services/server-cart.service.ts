import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddToCarritoRequest, CarritoResponse } from '../models/backend.models';

@Injectable({ providedIn: 'root' })
export class ServerCartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carrito`;

  addToCart(payload: AddToCarritoRequest): Observable<CarritoResponse> {
    return this.http.post<CarritoResponse>(`${this.apiUrl}/agregar`, payload);
  }

  getCart(): Observable<CarritoResponse> {
    return this.http.get<CarritoResponse>(this.apiUrl);
  }

  removeFromCart(productoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/eliminar/${productoId}`);
  }

  updateCart(payload: { productoId: number; cantidad: number }): Observable<CarritoResponse> {
    return this.http.put<CarritoResponse>(`${this.apiUrl}/actualizar`, payload);
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CategoriaAdminResponse } from '../models/backend.models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/categorias`;

  getCategories(): Observable<CategoriaAdminResponse[]> {
    return this.http.get<CategoriaAdminResponse[]>(this.apiUrl).pipe(
      catchError((err) => {
        console.error('Error loading categories', err);
        return of([]);
      })
    );
  }

  getCategory(id: number) {
    return this.http.get<CategoriaAdminResponse>(`${this.apiUrl}/${id}`);
  }
}

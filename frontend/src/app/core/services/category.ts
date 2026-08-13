import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7001/api/categories';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      this.apiUrl
    );
  }

  createCategory(
    category: Category
  ): Observable<Category> {

    return this.http.post<Category>(
      this.apiUrl,
      category
    );
  }

  deleteCategory(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
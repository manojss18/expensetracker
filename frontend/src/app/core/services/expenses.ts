import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Expense,
  CreateExpense
} from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'https://localhost:7001/api/expenses';

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl);
  }

  getExpense(id: number): Observable<Expense> {
    return this.http.get<Expense>(
      `${this.apiUrl}/${id}`
    );
  }

  createExpense(
    expense: CreateExpense
  ): Observable<Expense> {

    return this.http.post<Expense>(
      this.apiUrl,
      expense
    );
  }

  updateExpense(
    id: number,
    expense: CreateExpense
  ): Observable<void> {

    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      expense
    );
  }

  deleteExpense(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
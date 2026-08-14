import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Income,
  CreateIncome
} from '../models/income.model';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5177/api/income';

  getIncome(): Observable<Income[]> {
    return this.http.get<Income[]>(this.apiUrl);
  }

  getIncomeById(id: number): Observable<Income> {
    return this.http.get<Income>(
      `${this.apiUrl}/${id}`
    );
  }

  createIncome(
    income: CreateIncome
  ): Observable<Income> {
    return this.http.post<Income>(
      this.apiUrl,
      income
    );
  }

  updateIncome(
    id: number,
    income: CreateIncome
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${id}`,
      {
        ...income,
        id: id
      }
    );
  }

  deleteIncome(
    id: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}
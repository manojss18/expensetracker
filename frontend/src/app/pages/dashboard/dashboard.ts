import { Component, OnInit, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  Income as IncomeModel
} from '../../core/models/income.model';

import { IncomeService } from '../../core/services/income';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    RouterLink
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private incomeService = inject(IncomeService);

  // Dashboard totals
  totalIncome = 0;

  totalExpenses = 18500;

  balance = 0;

  // Loading state
  loading = false;

  // Error message
  errorMessage = '';

  // Recent expenses
  recentExpenses = [
    {
      title: 'Grocery Shopping',
      category: 'Food',
      amount: 2500,
      date: '2026-08-12'
    },
    {
      title: 'Electricity Bill',
      category: 'Bills',
      amount: 1800,
      date: '2026-08-10'
    },
    {
      title: 'Internet Bill',
      category: 'Bills',
      amount: 999,
      date: '2026-08-08'
    },
    {
      title: 'Movie',
      category: 'Entertainment',
      amount: 500,
      date: '2026-08-06'
    }
  ];

  ngOnInit(): void {
    this.loadIncome();
  }

  loadIncome(): void {

    this.loading = true;
    this.errorMessage = '';

    this.incomeService.getIncome().subscribe({

      next: (incomes: IncomeModel[]) => {

        this.totalIncome = incomes.reduce(
          (
            total: number,
            income: IncomeModel
          ) => total + income.amount,
          0
        );

        this.calculateBalance();

        this.loading = false;
      },

      error: (error: unknown) => {

        console.error(
          'Error loading income:',
          error
        );

        this.errorMessage =
          'Unable to load income. Please check whether the backend API is running.';

        this.loading = false;
      }

    });
  }

  calculateBalance(): void {

    this.balance =
      this.totalIncome -
      this.totalExpenses;

  }

  get savingsPercentage(): number {

    if (this.totalIncome === 0) {
      return 0;
    }

    return Math.round(
      (this.balance / this.totalIncome) * 100
    );
  }

}
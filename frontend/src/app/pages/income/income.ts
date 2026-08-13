import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Income as IncomeModel,
  CreateIncome
} from '../../core/models/income.model';

import { IncomeService } from '../../core/services/income';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './income.html',
  styleUrl: './income.css'
})
export class Income implements OnInit {

  private incomeService = inject(IncomeService);

  incomes: IncomeModel[] = [];

  sources: string[] = [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Bonus',
    'Other'
  ];

  searchText = '';

  selectedSource = 'All';

  showForm = false;

  editingId: number | null = null;

  form: CreateIncome = {
    source: 'Salary',
    amount: 0,
    description: '',
    incomeDate: ''
  };

  loading = false;

  errorMessage = '';

  ngOnInit(): void {
    this.loadIncome();
  }

  loadIncome(): void {

    this.loading = true;
    this.errorMessage = '';

    this.incomeService.getIncome().subscribe({

      next: (data: IncomeModel[]) => {

        this.incomes = data;
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

  get filteredIncome(): IncomeModel[] {

    return this.incomes.filter(
      (income: IncomeModel) => {

        const search =
          this.searchText
            .trim()
            .toLowerCase();

        const matchesSearch =
          income.source
            .toLowerCase()
            .includes(search) ||
          income.description
            .toLowerCase()
            .includes(search);

        const matchesSource =
          this.selectedSource === 'All' ||
          income.source === this.selectedSource;

        return matchesSearch && matchesSource;
      }
    );
  }

  get totalIncome(): number {

    return this.incomes.reduce(
      (
        total: number,
        income: IncomeModel
      ) => total + income.amount,
      0
    );
  }

  openAddForm(): void {

    this.editingId = null;

    this.form = {
      source: 'Salary',
      amount: 0,
      description: '',
      incomeDate: this.getToday()
    };

    this.showForm = true;
  }

  editIncome(income: IncomeModel): void {

    this.editingId = income.id;

    this.form = {
      source: income.source,
      amount: income.amount,
      description: income.description,
      incomeDate: income.incomeDate
        ? income.incomeDate.substring(0, 10)
        : ''
    };

    this.showForm = true;
  }

  saveIncome(): void {

    if (
      !this.form.source.trim() ||
      this.form.amount <= 0 ||
      !this.form.incomeDate
    ) {

      alert(
        'Please enter source, amount and date.'
      );

      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.editingId !== null) {

      this.incomeService
        .updateIncome(
          this.editingId,
          this.form
        )
        .subscribe({

          next: () => {

            this.loading = false;

            this.closeForm();

            this.loadIncome();

          },

          error: (error: unknown) => {

            console.error(
              'Error updating income:',
              error
            );

            this.loading = false;

            this.errorMessage =
              'Unable to update income.';
          }

        });

      return;
    }

    this.incomeService
      .createIncome(this.form)
      .subscribe({

        next: (createdIncome: IncomeModel) => {

          console.log(
            'Income created:',
            createdIncome
          );

          this.loading = false;

          this.closeForm();

          this.loadIncome();

        },

        error: (error: unknown) => {

          console.error(
            'Error creating income:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Unable to create income. Please check the backend API.';
        }

      });
  }

  deleteIncome(id: number): void {

    const confirmed = confirm(
      'Are you sure you want to delete this income?'
    );

    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.incomeService
      .deleteIncome(id)
      .subscribe({

        next: () => {

          this.loading = false;

          this.loadIncome();

        },

        error: (error: unknown) => {

          console.error(
            'Error deleting income:',
            error
          );

          this.loading = false;

          this.errorMessage =
            'Unable to delete income.';
        }

      });
  }

  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

    this.form = {
      source: 'Salary',
      amount: 0,
      description: '',
      incomeDate: ''
    };
  }

  private getToday(): string {

    return new Date()
      .toISOString()
      .substring(0, 10);
  }
}
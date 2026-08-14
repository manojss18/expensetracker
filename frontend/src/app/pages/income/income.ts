import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  DecimalPipe,
  DatePipe
} from '@angular/common';

import {
  Income,
  CreateIncome
} from '../../core/models/income.model';

import {
  IncomeService
} from '../../core/services/income';


@Component({
  selector: 'app-income',

  standalone: true,

  imports: [
    FormsModule,
    DecimalPipe,
    DatePipe
  ],

  templateUrl: './income.html',

  styleUrl: './income.css'
})
export class IncomePage implements OnInit {

  // ==========================================
  // SERVICE
  // ==========================================

  private incomeService =
    inject(IncomeService);


  // ==========================================
  // DATA
  // ==========================================

  incomes: Income[] = [];


  // ==========================================
  // FILTERS
  // ==========================================

  searchText: string = '';

  selectedSource: string = 'All';

  sources: string[] = [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Other'
  ];


  // ==========================================
  // FORM
  // ==========================================

  showForm: boolean = false;

  editingId: number | null = null;

  form = {
    title: '',
    source: 'Salary',
    amount: 0,
    incomeDate: '',
    description: ''
  };


  // ==========================================
  // INITIALIZE
  // ==========================================

  ngOnInit(): void {

    this.loadIncome();

  }


  // ==========================================
  // GET INCOME
  // ==========================================

  loadIncome(): void {

    this.incomeService
      .getIncome()
      .subscribe({

        next: (data: Income[]) => {

          console.log(
            'Income data:',
            data
          );

          this.incomes = data;

        },

        error: (error: unknown) => {

          console.error(
            'Error loading income:',
            error
          );

          alert(
            'Unable to load income.'
          );

        }

      });

  }


  // ==========================================
  // FILTERED INCOME
  // ==========================================

  get filteredIncome(): Income[] {

    return this.incomes.filter(
      (income: Income) => {

        const matchesSearch =
          income.title
            .toLowerCase()
            .includes(
              this.searchText
                .toLowerCase()
            );


        const matchesSource =
          this.selectedSource === 'All' ||
          income.source ===
          this.selectedSource;


        return (
          matchesSearch &&
          matchesSource
        );

      }
    );

  }


  // ==========================================
  // TOTAL INCOME
  // ==========================================

  get totalIncome(): number {

    return this.filteredIncome.reduce(

      (
        total: number,
        income: Income
      ) => {

        return total + income.amount;

      },

      0

    );

  }


  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  openAddForm(): void {

    this.editingId = null;

    this.form = {

      title: '',

      source: 'Salary',

      amount: 0,

      incomeDate:
        new Date()
          .toISOString()
          .split('T')[0],

      description: ''

    };

    this.showForm = true;

  }


  // ==========================================
  // EDIT
  // ==========================================

  editIncome(
    income: Income
  ): void {

    this.editingId =
      income.id;

    this.form = {

      title:
        income.title,

      source:
        income.source,

      amount:
        income.amount,

      incomeDate:
        income.incomeDate,

      description:
        income.description

    };

    this.showForm = true;

  }


  // ==========================================
  // SAVE
  // ==========================================

  saveIncome(): void {

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (
      !this.form.title.trim() ||
      this.form.amount <= 0 ||
      !this.form.incomeDate
    ) {

      alert(
        'Please enter title, amount and date.'
      );

      return;

    }


    const incomeData: CreateIncome = {

      title:
        this.form.title.trim(),

      amount:
        Number(this.form.amount),

      source:
        this.form.source,

      description:
        this.form.description.trim(),

      incomeDate:
        this.form.incomeDate

    };


    // ========================================
    // UPDATE
    // ========================================

    if (
      this.editingId !== null
    ) {

      console.log(
        'Updating income:',
        incomeData
      );


      this.incomeService
        .updateIncome(
          this.editingId,
          incomeData
        )
        .subscribe({

          next: () => {

            console.log(
              'Income updated successfully'
            );

            this.closeForm();

            this.loadIncome();

          },

          error: (error: unknown) => {

            console.error(
              'Error updating income:',
              error
            );

            alert(
              'Failed to update income.'
            );

          }

        });

      return;

    }


    // ========================================
    // CREATE
    // ========================================

    console.log(
      'Creating income:',
      incomeData
    );


    this.incomeService
      .createIncome(
        incomeData
      )
      .subscribe({

        next: (data: Income) => {

          console.log(
            'Income created:',
            data
          );

          this.closeForm();

          this.loadIncome();

        },

        error: (error: unknown) => {

          console.error(
            'Error creating income:',
            error
          );

          alert(
            'Failed to add income.'
          );

        }

      });

  }


  // ==========================================
  // DELETE
  // ==========================================

  deleteIncome(
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this income?'
      );


    if (!confirmed) {

      return;

    }


    this.incomeService
      .deleteIncome(id)
      .subscribe({

        next: () => {

          console.log(
            'Income deleted successfully'
          );

          this.loadIncome();

        },

        error: (error: unknown) => {

          console.error(
            'Error deleting income:',
            error
          );

          alert(
            'Failed to delete income.'
          );

        }

      });

  }


  // ==========================================
  // CLOSE FORM
  // ==========================================

  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

  }

}
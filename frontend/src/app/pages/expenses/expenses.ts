import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import {
  Expense,
  CreateExpense
} from '../../core/models/expense.model';

import {
  Category
} from '../../core/models/category.model';

import {
  CategoryService
} from '../../core/services/category';

import {
  ExpenseService
} from '../../core/services/expenses';


@Component({
  selector: 'app-expenses',

  standalone: true,

  imports: [
    FormsModule,
    DecimalPipe
  ],

  templateUrl: './expenses.html',

  styleUrl: './expenses.css'
})
export class Expenses implements OnInit {

  // =====================================================
  // SERVICES
  // =====================================================

  private expenseService =
    inject(ExpenseService);

  private categoryService =
    inject(CategoryService);


  // =====================================================
  // EXPENSE DATA
  // =====================================================

  expenses: Expense[] = [];


  // =====================================================
  // CATEGORY DATA
  // =====================================================

  categories: Category[] = [];


  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  searchText: string = '';

  selectedCategory: string = 'All';


  // =====================================================
  // FORM
  // =====================================================

  showForm: boolean = false;

  editingId: number | null = null;


  form: CreateExpense = {

    title: '',

    category: 'Food',

    amount: 0,

    expenseDate: '',

    description: ''

  };


  // =====================================================
  // LOADING / ERROR
  // =====================================================

  isLoading: boolean = false;

  errorMessage: string = '';

  isSaving: boolean = false;

  isDeleting: boolean = false;


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.loadCategories();

    this.loadExpenses();

  }


  // =====================================================
  // LOAD EXPENSES
  // =====================================================

  loadExpenses(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.expenseService
      .getExpenses()
      .subscribe({

        next: (data: Expense[]) => {

          console.log(
            'Expenses loaded:',
            data
          );

          this.expenses = data;

          this.isLoading = false;

        },


        error: (error: unknown) => {

          console.error(
            'Failed to load expenses:',
            error
          );

          this.expenses = [];

          this.errorMessage =
            'Unable to load expenses. Please try again.';

          this.isLoading = false;

        }

      });

  }


  // =====================================================
  // RETRY
  // =====================================================

  retryLoad(): void {

    this.loadCategories();

    this.loadExpenses();

  }


  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  loadCategories(): void {

    this.categoryService
      .getCategories()
      .subscribe({

        next: (data: Category[]) => {

          console.log(
            'Categories loaded:',
            data
          );

          this.categories = data;


          if (
            this.categories.length > 0 &&
            !this.form.category
          ) {

            this.form.category =
              this.categories[0].name;

          }

        },


        error: (error: unknown) => {

          console.error(
            'Failed to load categories:',
            error
          );

        }

      });

  }


  // =====================================================
  // FILTERED EXPENSES
  // =====================================================

  get filteredExpenses(): Expense[] {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    return this.expenses.filter(
      (expense: Expense) => {

        const matchesSearch =
          expense.title
            .toLowerCase()
            .includes(search);


        const matchesCategory =
          this.selectedCategory === 'All' ||
          expense.category ===
          this.selectedCategory;


        return (
          matchesSearch &&
          matchesCategory
        );

      }
    );

  }


  // =====================================================
  // TOTAL EXPENSES
  // =====================================================

  get totalExpenses(): number {

    return this.filteredExpenses.reduce(

      (
        total: number,
        expense: Expense
      ) => {

        return total + expense.amount;

      },

      0

    );

  }


  // =====================================================
  // OPEN ADD FORM
  // =====================================================

  openAddForm(): void {

    this.editingId = null;


    this.form = {

      title: '',

      category:
        this.categories.length > 0
          ? this.categories[0].name
          : 'Food',

      amount: 0,

      expenseDate:
        new Date()
          .toISOString()
          .split('T')[0],

      description: ''

    };


    this.showForm = true;

  }


  // =====================================================
  // EDIT EXPENSE
  // =====================================================

  editExpense(
    expense: Expense
  ): void {

    this.editingId =
      expense.id;


    this.form = {

      title:
        expense.title,

      category:
        expense.category,

      amount:
        expense.amount,

      expenseDate:
        expense.expenseDate
          .split('T')[0],

      description:
        expense.description

    };


    this.showForm = true;

  }


  // =====================================================
  // SAVE EXPENSE
  // =====================================================

  saveExpense(): void {

    // ---------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------

    if (
      !this.form.title.trim() ||
      this.form.amount <= 0 ||
      !this.form.expenseDate
    ) {

      alert(
        'Please enter title, amount and date.'
      );

      return;

    }


    // ---------------------------------------------------
    // PREVENT DOUBLE CLICK
    // ---------------------------------------------------

    if (this.isSaving) {

      return;

    }


    // ---------------------------------------------------
    // CREATE REQUEST OBJECT
    // ---------------------------------------------------

    const expense: CreateExpense = {

      title:
        this.form.title.trim(),

      amount:
        Number(this.form.amount),

      category:
        this.form.category,

      description:
        this.form.description.trim(),

      expenseDate:
        this.form.expenseDate

    };


    this.isSaving = true;


    // ===================================================
    // UPDATE
    // ===================================================

    if (
      this.editingId !== null
    ) {

      console.log(
        'Updating expense:',
        expense
      );


      this.expenseService
        .updateExpense(
          this.editingId,
          expense
        )
        .subscribe({

          next: () => {

            console.log(
              'Expense updated successfully'
            );


            this.isSaving = false;

            this.closeForm();

            this.loadExpenses();

          },


          error: (error: unknown) => {

            console.error(
              'Failed to update expense:',
              error
            );


            this.isSaving = false;


            alert(
              'Failed to update expense.'
            );

          }

        });


      return;

    }


    // ===================================================
    // CREATE
    // ===================================================

    console.log(
      'Creating expense:',
      expense
    );


    this.expenseService
      .createExpense(expense)
      .subscribe({

        next: (createdExpense: Expense) => {

          console.log(
            'Expense created:',
            createdExpense
          );


          this.isSaving = false;

          this.closeForm();

          /*
           * Reload from backend instead of only
           * updating the local array.
           */

          this.loadExpenses();

        },


        error: (error: unknown) => {

          console.error(
            'Failed to create expense:',
            error
          );


          this.isSaving = false;


          alert(
            'Failed to save expense.'
          );

        }

      });

  }


  // =====================================================
  // DELETE EXPENSE
  // =====================================================

  deleteExpense(
    id: number
  ): void {

    const confirmed =
      confirm(
        'Are you sure you want to delete this expense?'
      );


    if (!confirmed) {

      return;

    }


    if (this.isDeleting) {

      return;

    }


    this.isDeleting = true;


    this.expenseService
      .deleteExpense(id)
      .subscribe({

        next: () => {

          console.log(
            'Expense deleted successfully'
          );


          this.isDeleting = false;

          this.loadExpenses();

        },


        error: (error: unknown) => {

          console.error(
            'Failed to delete expense:',
            error
          );


          this.isDeleting = false;


          alert(
            'Failed to delete expense.'
          );

        }

      });

  }


  // =====================================================
  // CLOSE FORM
  // =====================================================

  closeForm(): void {

    this.showForm = false;

    this.editingId = null;

    this.isSaving = false;

  }

}
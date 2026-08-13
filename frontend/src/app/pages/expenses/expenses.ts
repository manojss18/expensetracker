import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

interface Expense {
  id: number;
  title: string;
  category: string;
  amount: number;
  date: string;
  description: string;
}

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
export class Expenses {

  expenses: Expense[] = [
    {
      id: 1,
      title: 'Grocery Shopping',
      category: 'Food',
      amount: 2500,
      date: '2026-08-12',
      description: 'Monthly groceries'
    },
    {
      id: 2,
      title: 'Electricity Bill',
      category: 'Bills',
      amount: 1800,
      date: '2026-08-10',
      description: 'Electricity bill'
    },
    {
      id: 3,
      title: 'Internet Bill',
      category: 'Bills',
      amount: 999,
      date: '2026-08-08',
      description: 'Monthly internet'
    },
    {
      id: 4,
      title: 'Movie',
      category: 'Entertainment',
      amount: 500,
      date: '2026-08-06',
      description: 'Movie ticket'
    }
  ];

  categories: string[] = [
    'Food',
    'Bills',
    'Transport',
    'Entertainment',
    'Shopping',
    'Health',
    'Other'
  ];

  searchText = '';
  selectedCategory = 'All';

  showForm = false;
  editingId: number | null = null;

  form = {
    title: '',
    category: 'Food',
    amount: 0,
    date: '',
    description: ''
  };

  get filteredExpenses(): Expense[] {

    return this.expenses.filter(expense => {

      const matchesSearch =
        expense.title
          .toLowerCase()
          .includes(this.searchText.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'All' ||
        expense.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  get totalExpenses(): number {

    return this.filteredExpenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  }

  openAddForm(): void {

    this.editingId = null;

    this.form = {
      title: '',
      category: 'Food',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      description: ''
    };

    this.showForm = true;
  }

  editExpense(expense: Expense): void {

    this.editingId = expense.id;

    this.form = {
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      description: expense.description
    };

    this.showForm = true;
  }

  saveExpense(): void {

    if (
      !this.form.title.trim() ||
      this.form.amount <= 0 ||
      !this.form.date
    ) {
      alert('Please enter title, amount and date.');
      return;
    }

    if (this.editingId !== null) {

      const index = this.expenses.findIndex(
        expense => expense.id === this.editingId
      );

      if (index !== -1) {

        this.expenses[index] = {
          id: this.editingId,
          title: this.form.title,
          category: this.form.category,
          amount: this.form.amount,
          date: this.form.date,
          description: this.form.description
        };
      }

    } else {

      const newExpense: Expense = {
        id: Date.now(),
        title: this.form.title,
        category: this.form.category,
        amount: this.form.amount,
        date: this.form.date,
        description: this.form.description
      };

      this.expenses.unshift(newExpense);
    }

    this.closeForm();
  }

  deleteExpense(id: number): void {

    const confirmed = confirm(
      'Are you sure you want to delete this expense?'
    );

    if (!confirmed) {
      return;
    }

    this.expenses = this.expenses.filter(
      expense => expense.id !== id
    );
  }

  closeForm(): void {

    this.showForm = false;
    this.editingId = null;
  }
}
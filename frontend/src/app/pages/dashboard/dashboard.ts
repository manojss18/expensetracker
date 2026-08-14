import {
  Component,
  OnInit,
  AfterViewChecked,
  OnDestroy,
  inject,
  ViewChild,
  ElementRef
} from '@angular/core';

import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import {
  Chart,
  registerables
} from 'chart.js';

import { Income } from '../../core/models/income.model';
import { Expense } from '../../core/models/expense.model';

import { IncomeService } from '../../core/services/income';
import { ExpenseService } from '../../core/services/expenses';

Chart.register(...registerables);


@Component({
  selector: 'app-dashboard',

  standalone: true,

  imports: [
    DecimalPipe,
    FormsModule,
    RouterLink
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'
})
export class Dashboard
  implements OnInit, AfterViewChecked, OnDestroy {


  // ==========================================
  // SERVICES
  // ==========================================

  private incomeService =
    inject(IncomeService);

  private expenseService =
    inject(ExpenseService);


  // ==========================================
  // CANVAS
  // ==========================================

  @ViewChild(
    'incomeExpenseChart'
  )
  incomeExpenseChart?: ElementRef<HTMLCanvasElement>;


  @ViewChild(
    'categoryChart'
  )
  categoryChart?: ElementRef<HTMLCanvasElement>;


  // ==========================================
  // DATA
  // ==========================================

  incomes: Income[] = [];

  expenses: Expense[] = [];


  // ==========================================
  // STATE
  // ==========================================

  isLoading = true;

  errorMessage = '';


  selectedMonth =
    new Date()
      .toISOString()
      .slice(0, 7);


  // ==========================================
  // CHART INSTANCES
  // ==========================================

  private incomeChart?: Chart;

  private categoryChartInstance?: Chart;


  private chartsCreated = false;


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadDashboard();

  }


  // ==========================================
  // AFTER ANGULAR RENDERS HTML
  // ==========================================

  ngAfterViewChecked(): void {

    if (
      !this.isLoading &&
      !this.chartsCreated &&
      this.incomeExpenseChart &&
      this.categoryChart
    ) {

      this.createCharts();

      this.chartsCreated = true;

    }

  }


  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.incomeChart?.destroy();

    this.categoryChartInstance?.destroy();

  }


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  loadDashboard(): void {

    console.log(
      'Loading dashboard...'
    );


    this.isLoading = true;

    this.errorMessage = '';

    this.chartsCreated = false;


    forkJoin({

      income:
        this.incomeService.getIncome(),

      expenses:
        this.expenseService.getExpenses()

    })

    .subscribe({

      next: result => {

        console.log(
          'Income data:',
          result.income
        );

        console.log(
          'Expense data:',
          result.expenses
        );


        this.incomes =
          result.income;


        this.expenses =
          result.expenses;


        console.log(
          'Total income:',
          this.totalIncome
        );


        console.log(
          'Total expenses:',
          this.totalExpenses
        );


        this.isLoading = false;

      },


      error: error => {

        console.error(
          'Dashboard error:',
          error
        );


        this.errorMessage =
          'Unable to load dashboard data.';


        this.isLoading = false;

      }

    });

  }


  // ==========================================
  // FILTER INCOME
  // ==========================================

  get filteredIncomes(): Income[] {

    return this.incomes.filter(

      income =>
        income.incomeDate
          .startsWith(
            this.selectedMonth
          )

    );

  }


  // ==========================================
  // FILTER EXPENSES
  // ==========================================

  get filteredExpenses(): Expense[] {

    return this.expenses.filter(

      expense =>
        expense.expenseDate
          .startsWith(
            this.selectedMonth
          )

    );

  }


  // ==========================================
  // TOTAL INCOME
  // ==========================================

  get totalIncome(): number {

    return this.filteredIncomes.reduce(

      (
        total,
        income
      ) =>

        total + income.amount,

      0

    );

  }


  // ==========================================
  // TOTAL EXPENSES
  // ==========================================

  get totalExpenses(): number {

    return this.filteredExpenses.reduce(

      (
        total,
        expense
      ) =>

        total + expense.amount,

      0

    );

  }


  // ==========================================
  // BALANCE
  // ==========================================

  get balance(): number {

    return (
      this.totalIncome -
      this.totalExpenses
    );

  }


  // ==========================================
  // SAVINGS
  // ==========================================

  get savingsPercentage(): number {

    if (
      this.totalIncome === 0
    ) {

      return 0;

    }


    return Math.round(

      (
        this.balance /
        this.totalIncome
      ) * 100

    );

  }


  // ==========================================
  // RECENT EXPENSES
  // ==========================================

  get recentExpenses(): Expense[] {

    return [

      ...this.filteredExpenses

    ]

      .sort(

        (
          a,
          b
        ) =>

          new Date(
            b.expenseDate
          ).getTime()

          -

          new Date(
            a.expenseDate
          ).getTime()

      )

      .slice(0, 5);

  }


  // ==========================================
  // CREATE BOTH CHARTS
  // ==========================================

  createCharts(): void {

    console.log(
      'Creating charts...'
    );


    this.createIncomeExpenseChart();

    this.createCategoryChart();

  }


  // ==========================================
  // INCOME VS EXPENSE CHART
  // ==========================================

  createIncomeExpenseChart(): void {

    if (
      !this.incomeExpenseChart
    ) {

      console.error(
        'Income chart canvas not found'
      );

      return;

    }


    this.incomeChart?.destroy();


    const canvas =
      this.incomeExpenseChart
        .nativeElement;


    this.incomeChart =
      new Chart(
        canvas,
        {

          type: 'bar',

          data: {

            labels: [
              'Income',
              'Expenses'
            ],

            datasets: [

              {

                label:
                  'Amount',

                data: [

                  this.totalIncome,

                  this.totalExpenses

                ]

              }

            ]

          },


          options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

              legend: {

                display: false

              }

            },

            scales: {

              y: {

                beginAtZero: true

              }

            }

          }

        }

      );


    console.log(
      'Income chart created'
    );

  }


  // ==========================================
  // CATEGORY CHART
  // ==========================================

  createCategoryChart(): void {

    if (
      !this.categoryChart
    ) {

      console.error(
        'Category chart canvas not found'
      );

      return;

    }


    this.categoryChartInstance?.destroy();


    const categoryTotals =
      new Map<string, number>();


    for (
      const expense of
      this.filteredExpenses
    ) {

      const current =
        categoryTotals.get(
          expense.category
        ) ?? 0;


      categoryTotals.set(

        expense.category,

        current +
        expense.amount

      );

    }


    const labels =
      Array.from(
        categoryTotals.keys()
      );


    const values =
      Array.from(
        categoryTotals.values()
      );


    this.categoryChartInstance =
      new Chart(

        this.categoryChart
          .nativeElement,

        {

          type: 'doughnut',


          data: {

            labels: labels,

            datasets: [

              {

                label:
                  'Expenses',

                data: values

              }

            ]

          },


          options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

              legend: {

                position: 'bottom'

              }

            }

          }

        }

      );


    console.log(
      'Category chart created'
    );

  }

}
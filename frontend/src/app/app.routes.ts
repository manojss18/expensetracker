import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Expenses } from './pages/expenses/expenses';
import { Income } from './pages/income/income';
import { Categories } from './pages/categories/categories';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'expenses',
    component: Expenses
  },

  {
    path: 'income',
    component: Income
  },

  {
    path: 'categories',
    component: Categories
  },

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];
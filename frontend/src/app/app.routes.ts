import { Routes } from '@angular/router';

import { Dashboard } from './pages/dashboard/dashboard';
import { Expenses } from './pages/expenses/expenses';
import { Categories } from './pages/categories/categories';
import { IncomePage } from './pages/income/income';

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
    component: IncomePage
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
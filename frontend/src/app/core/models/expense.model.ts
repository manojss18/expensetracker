export interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  description: string;
  expenseDate: string;
}

export interface CreateExpense {
  title: string;
  amount: number;
  category: string;
  description: string;
  expenseDate: string;
}
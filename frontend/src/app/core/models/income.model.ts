export interface Income {
  id: number;
  source: string;
  amount: number;
  description: string;
  incomeDate: string;
}

export interface CreateIncome {
  source: string;
  amount: number;
  description: string;
  incomeDate: string;
}
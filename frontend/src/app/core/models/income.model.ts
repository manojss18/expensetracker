export interface Income {
  id: number;
  title: string;
  amount: number;
  source: string;
  description: string;
  incomeDate: string;
}

export interface CreateIncome {
  title: string;
  amount: number;
  source: string;
  description: string;
  incomeDate: string;
}
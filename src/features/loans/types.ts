// Loan management type definitions

export interface Loan {
  _id: string;
  _uid: string;
  loan_number: string;
  borrower_name: string;
  borrower_email: string;
  loan_amount: number;
  interest_rate: number;
  term_months: number;
  disbursement_date: string;
  first_payment_date: string;
  status: 'active' | 'paid' | 'overdue' | 'defaulted';
  purpose: string;
  collateral?: string;
  total_paid: number;
  outstanding_balance: number;
}

export interface LoanInstallment {
  _id: string;
  _uid: string;
  loan_id: string;
  installment_number: number;
  due_date: string;
  principal_amount: number;
  interest_amount: number;
  total_amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paid_amount: number;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
}

export interface LoanFormData {
  borrower_name: string;
  borrower_email: string;
  loan_amount: string;
  interest_rate: string;
  term_months: string;
  disbursement_date: string;
  first_payment_date: string;
  purpose: string;
  collateral?: string;
}

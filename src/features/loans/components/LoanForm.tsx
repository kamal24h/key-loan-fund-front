import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoanFormData } from '../types';
import { calculateLoanSummary } from '../utils/loan-calculator';

interface LoanFormProps {
  onSubmit: (data: LoanFormData) => void;
  onCancel: () => void;
  initialData?: Partial<LoanFormData>;
  isLoading?: boolean;
}

export function LoanForm({ onSubmit, onCancel, initialData, isLoading }: LoanFormProps) {
  const [formData, setFormData] = useState<LoanFormData>({
    borrower_name: initialData?.borrower_name || '',
    borrower_email: initialData?.borrower_email || '',
    loan_amount: initialData?.loan_amount || '',
    interest_rate: initialData?.interest_rate || '',
    term_months: initialData?.term_months || '',
    disbursement_date: initialData?.disbursement_date || new Date().toISOString().split('T')[0],
    first_payment_date: initialData?.first_payment_date || '',
    purpose: initialData?.purpose || '',
    collateral: initialData?.collateral || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Calculate preview if all required fields are filled
  const canCalculate = formData.loan_amount && formData.interest_rate && formData.term_months;
  const loanPreview = canCalculate
    ? calculateLoanSummary(
        parseFloat(formData.loan_amount),
        parseFloat(formData.interest_rate),
        parseInt(formData.term_months)
      )
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="borrower_name">Borrower Name *</Label>
          <Input
            id="borrower_name"
            name="borrower_name"
            value={formData.borrower_name}
            onChange={handleChange}
            required
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="borrower_email">Borrower Email *</Label>
          <Input
            id="borrower_email"
            name="borrower_email"
            type="email"
            value={formData.borrower_email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loan_amount">Loan Amount ($) *</Label>
          <Input
            id="loan_amount"
            name="loan_amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.loan_amount}
            onChange={handleChange}
            required
            placeholder="100000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interest_rate">Annual Interest Rate (%) *</Label>
          <Input
            id="interest_rate"
            name="interest_rate"
            type="number"
            step="0.01"
            min="0"
            max="100"
            value={formData.interest_rate}
            onChange={handleChange}
            required
            placeholder="5.5"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="term_months">Term (Months) *</Label>
          <Input
            id="term_months"
            name="term_months"
            type="number"
            min="1"
            value={formData.term_months}
            onChange={handleChange}
            required
            placeholder="36"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="disbursement_date">Disbursement Date *</Label>
          <Input
            id="disbursement_date"
            name="disbursement_date"
            type="date"
            value={formData.disbursement_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="first_payment_date">First Payment Date *</Label>
          <Input
            id="first_payment_date"
            name="first_payment_date"
            type="date"
            value={formData.first_payment_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purpose">Purpose *</Label>
          <Input
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
            placeholder="Business expansion"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="collateral">Collateral (Optional)</Label>
        <Textarea
          id="collateral"
          name="collateral"
          value={formData.collateral}
          onChange={handleChange}
          placeholder="Property at 123 Main St..."
          rows={3}
        />
      </div>

      {loanPreview && (
        <div className="bg-muted/50 border rounded-lg p-4 space-y-2">
          <h4 className="font-semibold text-sm mb-3">Loan Preview</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Monthly Payment</div>
              <div className="font-semibold">${loanPreview.monthlyPayment.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Total Payment</div>
              <div className="font-semibold">${loanPreview.totalPayment.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Total Interest</div>
              <div className="font-semibold">${loanPreview.totalInterest.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Effective Rate</div>
              <div className="font-semibold">{loanPreview.effectiveRate}%</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Loan'}
        </Button>
      </div>
    </form>
  );
}

import { Link } from 'react-router-dom';
import { FileText, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loan } from '../types';

interface LoanCardProps {
  loan: Loan;
}

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-500/10 text-green-700 border-green-200' },
  paid: { label: 'Paid', className: 'bg-blue-500/10 text-blue-700 border-blue-200' },
  overdue: { label: 'Overdue', className: 'bg-red-500/10 text-red-700 border-red-200' },
  defaulted: { label: 'Defaulted', className: 'bg-gray-500/10 text-gray-700 border-gray-200' },
};

export function LoanCard({ loan }: LoanCardProps) {
  const status = statusConfig[loan.status];
  const progressPercentage = (loan.total_paid / loan.loan_amount) * 100;

  return (
    <Link to={`/loans/${loan._id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {loan.loan_number}
              </CardTitle>
              <div className="text-sm text-muted-foreground">{loan.borrower_name}</div>
            </div>
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <DollarSign className="h-3.5 w-3.5" />
                <span>Loan Amount</span>
              </div>
              <div className="text-lg font-semibold">
                ${loan.loan_amount.toLocaleString()}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>Interest Rate</span>
              </div>
              <div className="text-lg font-semibold">{loan.interest_rate}%</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Repayment Progress</span>
              <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Paid: ${loan.total_paid.toLocaleString()}</span>
              <span>Balance: ${loan.outstanding_balance.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 border-t flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{loan.term_months} months</span>
            </div>
            <div>
              Disbursed: {new Date(loan.disbursement_date).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

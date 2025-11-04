import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  TrendingUp,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { table } from '@devvai/devv-code-backend';
import { Loan, LoanInstallment } from '@/features/loans/types';

const statusConfig = {
  active: { label: 'Active', className: 'bg-green-500/10 text-green-700 border-green-200' },
  paid: { label: 'Paid', className: 'bg-blue-500/10 text-blue-700 border-blue-200' },
  overdue: { label: 'Overdue', className: 'bg-red-500/10 text-red-700 border-red-200' },
  defaulted: { label: 'Defaulted', className: 'bg-gray-500/10 text-gray-700 border-gray-200' },
};

const installmentStatusConfig = {
  pending: { icon: Clock, className: 'text-yellow-600', label: 'Pending' },
  paid: { icon: CheckCircle2, className: 'text-green-600', label: 'Paid' },
  overdue: { icon: AlertCircle, className: 'text-red-600', label: 'Overdue' },
  partial: { icon: Clock, className: 'text-orange-600', label: 'Partial' },
};

export function LoanDetailPage() {
  const { loanId } = useParams<{ loanId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loan, setLoan] = useState<Loan | null>(null);
  const [installments, setInstallments] = useState<LoanInstallment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInstallment, setSelectedInstallment] = useState<LoanInstallment | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentNotes, setPaymentNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (loanId) {
      loadLoanDetails();
    }
  }, [loanId]);

  const loadLoanDetails = async () => {
    try {
      setIsLoading(true);

      // Load loan by ID
      const loanResponse = await table.getItems('f33mzfsmxrlt', {
        query: { _id: loanId },
        limit: 1
      });

      if (!loanResponse.items || loanResponse.items.length === 0) {
        throw new Error('Loan not found');
      }

      setLoan(loanResponse.items[0] as Loan);

      // Load installments
      const installmentsResponse = await table.getItems('f33mzfsmxrls', {
        query: { loan_id: loanId },
        limit: 100
      });

      if (installmentsResponse.items) {
        const sorted = installmentsResponse.items.sort(
          (a: any, b: any) => a.installment_number - b.installment_number
        );
        setInstallments(sorted as LoanInstallment[]);
      }
    } catch (error) {
      console.error('Failed to load loan details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load loan details.',
        variant: 'destructive',
      });
      navigate('/loans');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentClick = (installment: LoanInstallment) => {
    setSelectedInstallment(installment);
    setPaymentAmount(installment.total_amount.toString());
    setPaymentMethod('bank_transfer');
    setPaymentNotes('');
    setIsPaymentDialogOpen(true);
  };

  const handleRecordPayment = async () => {
    if (!selectedInstallment || !loan) return;

    try {
      setIsSubmitting(true);
      const amount = parseFloat(paymentAmount);

      if (isNaN(amount) || amount <= 0) {
        toast({
          title: 'Error',
          description: 'Please enter a valid payment amount.',
          variant: 'destructive',
        });
        return;
      }

      const newPaidAmount = selectedInstallment.paid_amount + amount;
      const newStatus =
        newPaidAmount >= selectedInstallment.total_amount
          ? 'paid'
          : newPaidAmount > 0
          ? 'partial'
          : 'pending';

      // Update installment
      await table.updateItem('f33mzfsmxrls', {
        _uid: selectedInstallment._uid,
        _id: selectedInstallment._id,
        paid_amount: newPaidAmount,
        status: newStatus,
        paid_date: new Date().toISOString(),
        payment_method: paymentMethod,
        notes: paymentNotes,
      });

      // Update loan totals
      const newTotalPaid = loan.total_paid + amount;
      const newOutstanding = loan.outstanding_balance - amount;
      const newLoanStatus =
        newOutstanding <= 0 ? 'paid' : loan.status;

      await table.updateItem('f33mzfsmxrlt', {
        _uid: loan._uid,
        _id: loan._id,
        total_paid: newTotalPaid,
        outstanding_balance: Math.max(0, newOutstanding),
        status: newLoanStatus,
      });

      toast({
        title: 'Success',
        description: `Payment of $${amount.toLocaleString()} recorded successfully.`,
      });

      setIsPaymentDialogOpen(false);
      loadLoanDetails();
    } catch (error) {
      console.error('Failed to record payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to record payment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !loan) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-muted-foreground">Loading loan details...</div>
      </div>
    );
  }

  const status = statusConfig[loan.status];
  const progressPercentage = (loan.total_paid / loan.loan_amount) * 100;
  const paidInstallments = installments.filter(i => i.status === 'paid').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/loans')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{loan.loan_number}</h1>
            <Badge variant="outline" className={status.className}>
              {status.label}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{loan.borrower_name}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Loan Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${loan.loan_amount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              Interest Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loan.interest_rate}%</div>
            <div className="text-xs text-muted-foreground mt-1">Annual</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              Term
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loan.term_months}</div>
            <div className="text-xs text-muted-foreground mt-1">Months</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Installments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {paidInstallments}/{loan.term_months}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Paid</div>
          </CardContent>
        </Card>
      </div>

      {/* Loan Details */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Borrower Email</div>
              <div className="font-medium">{loan.borrower_email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Purpose</div>
              <div className="font-medium">{loan.purpose}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Disbursement Date</div>
              <div className="font-medium">
                {new Date(loan.disbursement_date).toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">First Payment Date</div>
              <div className="font-medium">
                {new Date(loan.first_payment_date).toLocaleDateString()}
              </div>
            </div>
          </div>

          {loan.collateral && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Collateral</div>
              <div className="font-medium">{loan.collateral}</div>
            </div>
          )}

          <div className="pt-4 border-t space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Repayment Progress</span>
              <span className="font-medium">{progressPercentage.toFixed(1)}%</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-xs text-muted-foreground">Total Paid</div>
                <div className="text-lg font-semibold">${loan.total_paid.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Outstanding Balance</div>
                <div className="text-lg font-semibold">
                  ${loan.outstanding_balance.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Installment Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Repayment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {installments.map(installment => {
              const config = installmentStatusConfig[installment.status];
              const StatusIcon = config.icon;
              const isOverdue =
                installment.status === 'pending' &&
                new Date(installment.due_date) < new Date();

              return (
                <div
                  key={installment._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`${config.className}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        Installment #{installment.installment_number}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Due: {new Date(installment.due_date).toLocaleDateString()}
                        {isOverdue && ' (Overdue)'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        ${installment.total_amount.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Principal: ${installment.principal_amount.toLocaleString()} | Interest: $
                        {installment.interest_amount.toLocaleString()}
                      </div>
                      {installment.paid_amount > 0 && (
                        <div className="text-xs text-green-600 mt-1">
                          Paid: ${installment.paid_amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  {installment.status !== 'paid' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-4"
                      onClick={() => handlePaymentClick(installment)}
                    >
                      Record Payment
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for Installment #{selectedInstallment?.installment_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="payment_amount">Payment Amount ($)</Label>
              <Input
                id="payment_amount"
                type="number"
                step="0.01"
                min="0"
                value={paymentAmount}
                onChange={e => setPaymentAmount(e.target.value)}
                placeholder="0.00"
              />
              {selectedInstallment && (
                <div className="text-xs text-muted-foreground mt-1">
                  Total due: ${selectedInstallment.total_amount.toLocaleString()} | Already paid: $
                  {selectedInstallment.paid_amount.toLocaleString()}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="wire">Wire Transfer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payment_notes">Notes (Optional)</Label>
              <Textarea
                id="payment_notes"
                value={paymentNotes}
                onChange={e => setPaymentNotes(e.target.value)}
                placeholder="Additional notes about this payment..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsPaymentDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleRecordPayment} disabled={isSubmitting}>
                {isSubmitting ? 'Recording...' : 'Record Payment'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

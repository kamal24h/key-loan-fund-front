import { useState, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/store/auth-store';
import { table } from '@devvai/devv-code-backend';
import { LoanCard } from '@/features/loans/components/LoanCard';
import { LoanForm } from '@/features/loans/components/LoanForm';
import { Loan, LoanFormData } from '@/features/loans/types';
import { generateAmortizationSchedule } from '@/features/loans/utils/loan-calculator';

export function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { toast } = useToast();
  const { user } = useAuthStore();

  // Load loans
  useEffect(() => {
    loadLoans();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...loans];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        loan =>
          loan.borrower_name.toLowerCase().includes(query) ||
          loan.loan_number.toLowerCase().includes(query) ||
          loan.borrower_email.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(loan => loan.status === statusFilter);
    }

    setFilteredLoans(filtered);
  }, [loans, searchQuery, statusFilter]);

  const loadLoans = async () => {
    if (!user?.uid) return;
    
    try {
      setIsLoading(true);
      const response = await table.getItems('f33mzfsmxrlt', {
        query: { _uid: user.uid },
        limit: 100
      });

      if (response.items) {
        // Sort by creation date (newest first)
        const sorted = response.items.sort((a: any, b: any) => 
          new Date(b._id).getTime() - new Date(a._id).getTime()
        );
        setLoans(sorted as Loan[]);
      }
    } catch (error) {
      console.error('Failed to load loans:', error);
      toast({
        title: 'Error',
        description: 'Failed to load loans. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLoan = async (formData: LoanFormData) => {
    try {
      setIsSubmitting(true);

      const loanAmount = parseFloat(formData.loan_amount);
      const interestRate = parseFloat(formData.interest_rate);
      const termMonths = parseInt(formData.term_months);

      // Generate loan number
      const loanNumber = `LN${Date.now().toString().slice(-8)}`;

      // Create loan record
      const loanData = {
        loan_number: loanNumber,
        borrower_name: formData.borrower_name,
        borrower_email: formData.borrower_email,
        loan_amount: loanAmount,
        interest_rate: interestRate,
        term_months: termMonths,
        disbursement_date: formData.disbursement_date,
        first_payment_date: formData.first_payment_date,
        status: 'active' as const,
        purpose: formData.purpose,
        collateral: formData.collateral || '',
        total_paid: 0,
        outstanding_balance: loanAmount,
      };

      await table.addItem('f33mzfsmxrlt', loanData);

      // Fetch the just-created loan to get its ID
      const loansResponse = await table.getItems('f33mzfsmxrlt', {
        query: { _uid: user.uid, loan_number: loanNumber },
        limit: 1
      });

      if (!loansResponse.items || loansResponse.items.length === 0) {
        throw new Error('Failed to create loan');
      }

      const loanId = loansResponse.items[0]._id;

      // Generate amortization schedule
      const schedule = generateAmortizationSchedule(
        loanAmount,
        interestRate,
        termMonths,
        new Date(formData.first_payment_date)
      );

      // Create installment records
      const installmentPromises = schedule.map(item =>
        table.addItem('f33mzfsmxrls', {
          loan_id: loanId,
          installment_number: item.installment_number,
          due_date: item.due_date,
          principal_amount: item.principal_amount,
          interest_amount: item.interest_amount,
          total_amount: item.total_amount,
          status: 'pending' as const,
          paid_amount: 0,
          paid_date: '',
          payment_method: '',
          notes: '',
        })
      );

      await Promise.all(installmentPromises);

      toast({
        title: 'Success',
        description: `Loan ${loanNumber} created successfully with ${termMonths} installments.`,
      });

      setIsDialogOpen(false);
      loadLoans();
    } catch (error) {
      console.error('Failed to create loan:', error);
      toast({
        title: 'Error',
        description: 'Failed to create loan. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate summary statistics
  const stats = {
    total: loans.length,
    active: loans.filter(l => l.status === 'active').length,
    totalDisbursed: loans.reduce((sum, l) => sum + l.loan_amount, 0),
    totalOutstanding: loans.reduce((sum, l) => sum + l.outstanding_balance, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan Management</h1>
          <p className="text-muted-foreground mt-1">
            Track member loans, schedules, and repayment progress
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          New Loan
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Loans</div>
          <div className="text-2xl font-bold mt-1">{stats.total}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Active Loans</div>
          <div className="text-2xl font-bold mt-1">{stats.active}</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Disbursed</div>
          <div className="text-2xl font-bold mt-1">
            ${stats.totalDisbursed.toLocaleString()}
          </div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Outstanding</div>
          <div className="text-2xl font-bold mt-1">
            ${stats.totalOutstanding.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by borrower name, email, or loan number..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="defaulted">Defaulted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loans Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading loans...</div>
      ) : filteredLoans.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'No loans match your filters'
              : 'No loans yet'}
          </div>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Loan
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLoans.map(loan => (
            <LoanCard key={loan._id} loan={loan} />
          ))}
        </div>
      )}

      {/* Create Loan Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Loan</DialogTitle>
            <DialogDescription>
              Enter loan details to create a new member loan with automatic installment scheduling.
            </DialogDescription>
          </DialogHeader>
          <LoanForm
            onSubmit={handleCreateLoan}
            onCancel={() => setIsDialogOpen(false)}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

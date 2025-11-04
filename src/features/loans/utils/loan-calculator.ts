// Loan amortization calculator utilities

export interface AmortizationScheduleItem {
  installment_number: number;
  due_date: string;
  principal_amount: number;
  interest_amount: number;
  total_amount: number;
  remaining_balance: number;
}

/**
 * Calculate monthly payment using the amortization formula
 * P = L[c(1 + c)^n]/[(1 + c)^n - 1]
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  months: number
): number {
  if (annualRate === 0) {
    return principal / months;
  }
  
  const monthlyRate = annualRate / 100 / 12;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);
  
  return Math.round(payment * 100) / 100;
}

/**
 * Generate complete amortization schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  months: number,
  firstPaymentDate: Date
): AmortizationScheduleItem[] {
  const schedule: AmortizationScheduleItem[] = [];
  let remainingBalance = principal;
  const monthlyRate = annualRate / 100 / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, months);
  
  for (let i = 1; i <= months; i++) {
    const interestAmount = Math.round(remainingBalance * monthlyRate * 100) / 100;
    const principalAmount = Math.round((monthlyPayment - interestAmount) * 100) / 100;
    
    // Adjust last payment to account for rounding
    const totalAmount = i === months 
      ? remainingBalance + interestAmount 
      : monthlyPayment;
    const adjustedPrincipal = i === months 
      ? remainingBalance 
      : principalAmount;
    
    remainingBalance -= adjustedPrincipal;
    
    // Calculate due date
    const dueDate = new Date(firstPaymentDate);
    dueDate.setMonth(dueDate.getMonth() + (i - 1));
    
    schedule.push({
      installment_number: i,
      due_date: dueDate.toISOString(),
      principal_amount: adjustedPrincipal,
      interest_amount: interestAmount,
      total_amount: Math.round(totalAmount * 100) / 100,
      remaining_balance: Math.max(0, Math.round(remainingBalance * 100) / 100),
    });
  }
  
  return schedule;
}

/**
 * Calculate loan summary statistics
 */
export function calculateLoanSummary(
  principal: number,
  annualRate: number,
  months: number
) {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, months);
  const totalPayment = monthlyPayment * months;
  const totalInterest = totalPayment - principal;
  
  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    effectiveRate: annualRate,
  };
}

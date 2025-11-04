import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Briefcase, Activity, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/auth-store';
import { table } from '@devvai/devv-code-backend';
import { useToast } from '@/hooks/use-toast';

interface DashboardMetrics {
  totalAUM: number;
  totalPortfolios: number;
  totalInvestments: number;
  totalInvestors: number;
  totalLoans: number;
  activeLoans: number;
  loansOutstanding: number;
  avgIRR: number;
  avgMOIC: number;
  recentChange: number;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);

      // Fetch portfolios
      const portfoliosResult = await table.getItems('f33m6xybmt4w', {
        query: { _uid: user.uid },
        limit: 100
      });

      // Fetch investments
      const investmentsResult = await table.getItems('f33m6xybmzgg', {
        query: { _uid: user.uid },
        limit: 100
      });

      // Fetch investors
      const investorsResult = await table.getItems('f33m6xy95340', {
        query: { _uid: user.uid },
        limit: 100
      });

      // Fetch loans
      const loansResult = await table.getItems('f33mzfsmxrlt', {
        query: { _uid: user.uid },
        limit: 100
      });

      // Calculate metrics
      const portfolios = portfoliosResult.items;
      const investments = investmentsResult.items;
      const investors = investorsResult.items;
      const loans = loansResult.items;

      const totalAUM = portfolios.reduce((sum: number, p: any) => sum + (p.current_nav || 0), 0);
      const totalIRR = portfolios.reduce((sum: number, p: any) => sum + (p.irr || 0), 0);
      const avgIRR = portfolios.length > 0 ? totalIRR / portfolios.length : 0;
      const totalMOIC = portfolios.reduce((sum: number, p: any) => sum + (p.moic || 0), 0);
      const avgMOIC = portfolios.length > 0 ? totalMOIC / portfolios.length : 0;

      const activeLoans = loans.filter((l: any) => l.status === 'active').length;
      const loansOutstanding = loans.reduce((sum: number, l: any) => sum + (l.outstanding_balance || 0), 0);

      setMetrics({
        totalAUM,
        totalPortfolios: portfolios.length,
        totalInvestments: investments.length,
        totalInvestors: investors.length,
        totalLoans: loans.length,
        activeLoans,
        loansOutstanding,
        avgIRR,
        avgMOIC,
        recentChange: 5.2, // Mock data for now
      });
    } catch (error) {
      toast({
        title: 'Error loading dashboard',
        description: 'Failed to fetch data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-6 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.email}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total AUM
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {formatCurrency(metrics?.totalAUM || 0)}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs">
              {metrics && metrics.recentChange >= 0 ? (
                <>
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600 font-medium">
                    {formatPercent(metrics.recentChange)}
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3 w-3 text-red-600" />
                  <span className="text-red-600 font-medium">
                    {formatPercent(metrics?.recentChange || 0)}
                  </span>
                </>
              )}
              <span className="text-muted-foreground">vs last quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average IRR
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {formatPercent(metrics?.avgIRR || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Internal rate of return
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Investments
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {metrics?.totalInvestments || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {metrics?.totalPortfolios || 0} portfolios
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Investors
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {metrics?.totalInvestors || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active LPs
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Loans
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {metrics?.activeLoans || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              of {metrics?.totalLoans || 0} total loans
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Loans Outstanding
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {formatCurrency(metrics?.loansOutstanding || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total balance remaining
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {metrics?.totalPortfolios === 0 && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Create your first fund portfolio to begin tracking performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No portfolios yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mb-6">
                Start by creating a fund portfolio. You'll be able to track investments,
                manage investors, and monitor performance metrics.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest transactions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InvestmentsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
          <p className="text-muted-foreground mt-1">
            Track portfolio company investments and exits
          </p>
        </div>
        <Button>Add Investment</Button>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No Investments Yet</CardTitle>
          <CardDescription>
            Add your first portfolio company investment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start tracking investments</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              Record investments in portfolio companies, track valuations, and monitor
              performance metrics including entry and exit multiples.
            </p>
            <Button>Add Your First Investment</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

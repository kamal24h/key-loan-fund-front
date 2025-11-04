import { Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PortfoliosPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolios</h1>
          <p className="text-muted-foreground mt-1">
            Manage your fund portfolios and track performance
          </p>
        </div>
        <Button>Create Portfolio</Button>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No Portfolios Yet</CardTitle>
          <CardDescription>
            Create your first fund portfolio to start tracking investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Get started with portfolios</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              Portfolio management allows you to track multiple funds, monitor their performance,
              and generate comprehensive reports for your investors.
            </p>
            <Button>Create Your First Portfolio</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

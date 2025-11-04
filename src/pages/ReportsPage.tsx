import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate performance reports and analytics
          </p>
        </div>
        <Button>Generate Report</Button>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No Reports Available</CardTitle>
          <CardDescription>
            Create reports once you have portfolio data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Professional reporting</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              Generate comprehensive quarterly reports, investor statements, and performance
              analytics. Add portfolio data first to unlock reporting features.
            </p>
            <Button disabled>Generate Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

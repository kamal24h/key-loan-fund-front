import { Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function InvestorsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investors</h1>
          <p className="text-muted-foreground mt-1">
            Manage investor relationships and capital commitments
          </p>
        </div>
        <Button>Add Investor</Button>
      </div>

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>No Investors Yet</CardTitle>
          <CardDescription>
            Add your first limited partner or investor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Manage your investor base</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              Keep track of all your limited partners, their commitments, capital calls,
              distributions, and maintain strong investor relations.
            </p>
            <Button>Add Your First Investor</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
